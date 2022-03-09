const express = require('express');
const cors = require('cors');
import * as dotenv from 'dotenv';
import { createServer } from "http";
import { sql } from '../../jscore/db/sqlUni';
const path = require('path');

import { statement } from '../../jscore/db/statement';

import config from '../ignoreVCS/ignoreCfg';

async function main() {
    config();
    dotenv.config();

    let app = express();
    app.use(cors());

    let stmt = await statement.getStmt();
    const httpServer = createServer(app);

    app.get('/', function (req, res) {
        res.sendFile(path.resolve(__dirname + '/../../front/index.html'));

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
    });

    app.get('/region/(:id)', async function (req, res) {
        let row = await stmt.fetchRow("SELECT * FROM border_region WHERE regionId = " + sql(req.params.id));
        if (row) {
            res.json(row);
        } else {

        }
    });

    app.get('/districts/(:regionId)', async function (req, res) {
        let q = `
        SELECT bd.* FROM border_district bd
        JOIN oktmo o ON bd.id = o.ID
        WHERE RegionId = ${sql(req.params.regionId)}
        `;
        
        let rows = await stmt.fetchList(q);
        if (rows) {
            res.json(rows);
        } else {

        }
    });

    app.use(express.static(path.resolve(__dirname + '/../../front')));

    httpServer.listen(process.env.PORT);
}

main();