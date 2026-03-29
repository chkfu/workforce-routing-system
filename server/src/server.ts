import fs from 'fs';
import path from 'path';
import express, { Express } from 'express';
import dotenv from 'dotenv';
import https from 'https';
import cors from 'cors';

//  Setup dotenv

dotenv.config({ path: `${__dirname}/../process.env.example` });

//  Setup express server

const exp_app: Express = express();
exp_app.use(express.json());

//  Setup cors
const cors_opts = {}; //  remarks: to be applied for frontend communication
exp_app.use(cors());

//  Setup https server with SSL/TLS
const cert_path = path.resolve(__dirname, './ssl/localhost.pem');
const key_path = path.resolve(__dirname, './ssl/localhost-key.pem');

if (!fs.existsSync(cert_path)) {
  throw new Error(`[SERVER] error: SSL cert not found at ${cert_path}`);
}
if (!fs.existsSync(key_path)) {
  throw new Error(`[SERVER] error: SSL key not found at ${key_path}`);
}

const httpsServer: https.Server = https.createServer(
  {
    cert: fs.readFileSync(cert_path),
    key: fs.readFileSync(key_path),
  },
  exp_app,
);

//  Listen to server
const exp_server_port: number = Number(process.env.EXP_SERVER_PORT) || 8080;
try {
  httpsServer.listen(exp_server_port, () => {
    console.log(
      `[SERVER] succeed: listening to https://localhost:128.0.0.1:${exp_server_port}`,
    );
  });
} catch (err) {
  throw Error(
    `[SERVER] error: failed to listen to server port ${exp_server_port}\n${err}`,
  );
}
