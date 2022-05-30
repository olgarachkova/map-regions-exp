import * as fs from 'fs';

import { statement } from '../../jscore/db/statement';
import { Cfg_sqlend } from '../../jscore/db/connection';

import config from '../ignoreVCS/ignoreCfg';

async function main() {
    config();
    let stmt = await statement.getStmt();

    (global as any).stmt = stmt;

    let q = `SELECT * FROM border_region b`; //  WHERE regionId = 74  regionId, b.name as regionName, coords, b.type as objectType

    let doCont = true;

    let file = __dirname + '/../../mid/regions.json';

    await fs.promises.writeFile(file, '{'); // перезапись

    let limit = 10000;
    // let limit = 120;

    let rec = await stmt.getRecordSet(q);

    let i = 0;
    while (doCont) {
        let row = await rec.next();

        if (row) {
            if (i < limit) {
                if (i) {
                    await fs.promises.writeFile(file, `,\n`, { flag: 'a' });
                }

                await fs.promises.writeFile(file, `
    "${row['regionId']}": { 
        "regionName": "${row['name']}",
        "coords": ${row['coords']}, 
        "objectType": "${row['type']}",
        "bbLatMin": ${row['bbLatMin']},
        "bbLatMax": ${row['bbLatMax']},
        "bbLngMin": ${row['bbLngMin']},
        "bbLngMax": ${row['bbLngMax']}
    }`, { flag: 'a' });
            } else {
                doCont = false;
            }
        } else {
            doCont = false;
        }

        i++;
        console.log(i);
    }

    await fs.promises.writeFile(file, '}', { flag: 'a' });

    await stmt.close();
}

main();