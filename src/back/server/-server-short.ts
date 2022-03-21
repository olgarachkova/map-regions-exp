const express = require('express');
const cors = require('cors');
import * as dotenv from 'dotenv';
import { createServer } from "http";
const path = require('path');

async function main() {
    dotenv.config();

    let app = express();
    app.use(cors());

    const httpServer = createServer(app);

    app.get('/', function (req, res) {
        res.sendFile(path.resolve(__dirname + '/../../front/index.html'));

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
    });

    app.use(express.static(path.resolve(__dirname + '/../../front')));

    httpServer.listen(process.env.PORT);
}

main();