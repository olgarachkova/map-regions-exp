import * as fs from 'fs';
import AlCurl from '../../jscore/jssn/main/AlCurl';

import { statement } from '../../jscore/db/statement';
import { Cfg_sqlend } from '../../jscore/db/connection';
import { sql } from '../../jscore/db/sqlUni';

let curl = new AlCurl();

async function main() {
    let cfg_sqlend = new Cfg_sqlend;
    // cfg_sqlend.server = 'localhost:23366';
    cfg_sqlend.port = 23366;
    cfg_sqlend.user = 'root';
    cfg_sqlend.password = 'bulit';
    cfg_sqlend.db = '007_rachkova_004_map-svg-real';
    (global as any).cfg_sqlend = cfg_sqlend;

    let stmt = await statement.getStmt();

    (global as any).stmt = stmt;

    let q = "SELECT * FROM border_region"; //  AND id IN (179178,178946)
    let rows = await stmt.fetchList(q);
    let url;

    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        let name = row['name'];

        url = 'https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURI(name) + '&polygon_geojson=1'; // работало без encodeURI !
        curl.init(url);

        let res = await curl.exec();
        let coords;

        let json = JSON.parse(res);

        let filtered = json.filter(row => row.type === 'administrative'); // для Москвы имеется два набора данных "administrative" и "state"

        if (filtered.length) {
            let one = filtered[0];
            let geojson = one.geojson;

            coords = JSON.stringify(geojson.coordinates);
            
            let q = `
UPDATE border_region 
SET 
coords = ${sql(coords)},
type = ${sql(geojson.type)},
bbLatMin = ${sql(one.boundingbox[0])},
bbLatMax = ${sql(one.boundingbox[1])},
bbLngMin = ${sql(one.boundingbox[2])},
bbLngMax = ${sql(one.boundingbox[3])}
WHERE regionId = ${row['regionId']}`;

            let resql = await stmt.exec(q);
            await stmt.commit();
        } else { // пусто

        }

        // console.log(res);
        console.log(i);
    }

    await stmt.close();
}

main();