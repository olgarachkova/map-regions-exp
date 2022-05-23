// import data from '../../mid/countries.json';
const data = {};

import { statement } from '../../jscore/db/statement';

import config from '../ignoreVCS/ignoreCfg';
import { sql } from '../../jscore/db/sqlUni';

async function main() {
    config();
    let stmt = await statement.getStmt();

    (global as any).stmt = stmt;

    let rows = (data as any).features;
    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];

        try {
            let geom = row.geometry;
            let type = geom.type;
            let coords = geom.coordinates;
            let props = row.properties;
            let name = props.ADMIN;
            let iso_a3 = props.ISO_A3;

            let q = 
`
INSERT country SET type = ${sql(type)}, name = ${sql(name)}, iso_a3 = ${sql(iso_a3)}, coords = ${sql(JSON.stringify(coords))}
`
            let resql = await stmt.exec(q);
            await stmt.commit();
            let t = 1;
        } catch (e) {
            console.log(e);
        }

        console.log(i);
    }

    await stmt.close();
}

main();