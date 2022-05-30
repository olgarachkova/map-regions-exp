import { statement } from '../../jscore/db/statement';
import { sql } from '../../jscore/db/sqlUni';
import config from '../ignoreVCS/ignoreCfg';
import AlCurl from '../../jscore/jssn/main/AlCurl';

let curl = new AlCurl();

let russianRivers = ['Лена', 'Иртыш', 'Обь', 'Волга', 'Енисей', 'Амур', 'Колыма', 'Вилюй'];

async function main() {
    config();


    let stmt = await statement.getStmt();
    (global as any).stmt = stmt;

    for (let i = 0; i < russianRivers.length; i++) {
        let url = `https://nominatim.openstreetmap.org/search?format=json&q=${russianRivers[i]}&polygon_geojson=1`;
        curl.init(url);

        let res = await curl.exec();
        try {
            let jsonRes = JSON.parse(res);




            for (let j = 0; j < jsonRes.length; j++) {
                if (jsonRes[j].type === 'river') {
                    let name = JSON.stringify(jsonRes[j].display_name);
                    let coords = JSON.stringify(jsonRes[j].geojson.coordinates);
                    let type = JSON.stringify(jsonRes[j].geojson.type);
                    let boundingBox = jsonRes[j].boundingbox;
                    let q = `INSERT INTO rivers (riverId, name, coords, type, bbLatMin, bbLatMax, bbLngMin, bbLngMax) VALUES (${i}, ${sql(name)}, ${sql(coords)}, ${sql(type)}, ${boundingBox[0]},${sql(boundingBox[1])},${JSON.stringify(boundingBox[2])},${JSON.stringify(boundingBox[3])})`;
                    let resql = await stmt.exec(q);
                }
            }

            await stmt.commit();

        } catch (e) {

        }
    }
    await stmt.close();
}

main();