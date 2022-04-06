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

    /*let q = "";
    let rows = await stmt.fetchList(q);*/

    for (let i = 0; i < russianRivers.length; i++) {
        let url = `https://nominatim.openstreetmap.org/search?format=json&q=${russianRivers[i]}&polygon_geojson=1`;
        curl.init(url);

        let res = await curl.exec();
        try {
            let json = JSON.parse(res);
            console.log(json);
        } catch (e) {

        }
    }

    await stmt.close();
}

main();