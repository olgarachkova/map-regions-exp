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

    let q = "SELECT * FROM border WHERE coords IS NULL"; //  AND id IN (179178,178946)
    let rows = await stmt.fetchList(q);
    let url;

    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        let name;
        name = row['name'].replace('муниципальный ', '');
        name = name.replace('город ', '');

        if (name.match(/\sи\s/)) {
            continue;
        }

        // name = 'Баганский район';
        // name = 'Алексеевский район';

        url = 'https://nominatim.openstreetmap.org/search?format=json&q=' + name + '&polygon_geojson=1';
        curl.init(url);

        let res = await curl.exec();
        let coords;

        try {
            let json = JSON.parse(res);

            if (json.length === 1) {
                coords = JSON.stringify(json[0].geojson.coordinates);
                let resql = await stmt.exec("UPDATE border SET coords = " + sql(coords) + ", type = " + sql(json[0].geojson.type) + " WHERE id = " + row['id']);
                await stmt.commit();
                let t = 1;
            }

        } catch (e) {

        }

        // console.log(res);
        console.log(i);
    }

    await stmt.close();
}

main();