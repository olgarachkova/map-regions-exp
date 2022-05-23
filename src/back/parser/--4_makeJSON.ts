import * as fs from 'fs';

import { statement } from '../../jscore/db/statement';
import { Cfg_sqlend } from '../../jscore/db/connection';

import config from '../ignoreVCS/ignoreCfg';

async function main() {
    config();
    let stmt = await statement.getStmt();

    (global as any).stmt = stmt;

    let q = `SELECT b.id as objectId, r.OKTMO_ID as regionOKTMO, r.Name as regionName, b.name as objectName, coords, b.type as objectType FROM border_district b
    JOIN oktmo o ON b.id = o.id
    JOIN regions r ON o.SubKod1 = r.OKTMO_ID
    WHERE coords IS NOT NULL
    AND regionId = 74`;

    let doCont = true;

    let file = __dirname + '/../../mid/districts.json';

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
    "${row['objectId']}": {
        "regionOKTMO": ${row['regionOKTMO']}, 
        "regionName": "${row['regionName']}",
        "objectName": ${JSON.stringify(row['objectName'])}, 
        "coords": ${row['coords']}, 
        "objectType": "${row['objectType']}"
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