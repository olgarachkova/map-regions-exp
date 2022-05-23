import { statement } from '../../jscore/db/statement';
import { sql } from '../../jscore/db/sqlUni';
import config from '../ignoreVCS/ignoreCfg';

import { cutPoints, TPointArr } from '../../front/func';

async function main() {
    config();

    let stmt = await statement.getStmt();
    (global as any).stmt = stmt;
    let q = "SELECT * FROM border_region"; //  AND id IN (179178,178946)
    let rows = await stmt.fetchList(q);

    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        let coords = JSON.parse(row['coords']);
        let coordsCutted = [];
        if (row.type === 'Polygon') {
            coords.forEach((crd) => {
                let coords = cutPoints(crd as TPointArr[], 10);
                coordsCutted.push(coords)
            });
        }

        if (row.type === 'MultiPolygon') {
            coords.forEach((crds) => {
                let crdCut = [];
                crds.forEach(crd => {
                    let coords = cutPoints(crd, 10);
                    crdCut.push(coords);
                });
                coordsCutted.push(crdCut);
            });
        }

        let strCoordsCutted = JSON.stringify(coordsCutted);
        //console.log(strCoordsCutted);


        let qq = `
                        UPDATE border_region 
                        SET 
                        coords_10000m = ${sql(strCoordsCutted)}
                        WHERE regionId = ${row['regionId']}`;
        let resql = await stmt.exec(qq);
        await stmt.commit();

    }

    await stmt.close();
}

main();