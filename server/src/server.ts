import fs from 'fs';

import path from 'path';
import pool from './database/pool';
import dotenv from 'dotenv';
import https from 'https';
import logger from './infra/loggers';
import { downtime } from './util/error_control/downtime';
import exp_app from './app';

//  BEFORE RUNNING: handle uncaught exceptions
//  learnt: hard downtime, as no impact when server has not been started
//  remarks: https_server not yet available, exit directly
process.on('uncaughtException', (err: Error) => {
  downtime(null, 'uncaughtException', err);
});

//  Setup dotenv

dotenv.config({ path: `${__dirname}/../process.env.example` });

//  Setup https server with SSL/TLS
const cert_path = path.resolve(__dirname, './ssl/localhost.pem');
const key_path = path.resolve(__dirname, './ssl/localhost-key.pem');

if (!fs.existsSync(cert_path)) {
  throw new Error(`[SERVER] error: SSL cert not found at ${cert_path}`);
}
if (!fs.existsSync(key_path)) {
  throw new Error(`[SERVER] error: SSL key not found at ${key_path}`);
}

const https_server: https.Server = https.createServer(
  {
    cert: fs.readFileSync(cert_path),
    key: fs.readFileSync(key_path),
  },
  exp_app,
);

//  Setup error handling middleware
pool.connect((err, client, release) => {
  if (err) {
    logger.critical_logger.error(`[DATABASE] error: ${err.message}`);
    throw err;
  }
  release();
  logger.app_logger.info('[DATABASE] success: connected to database');
});

//  Listen to server
const exp_server_port: number = Number(process.env.EXP_SERVER_PORT) || 8080;
try {
  https_server.listen(exp_server_port, () => {
    console.log(
      `[SERVER] success: listening to https://localhost:${exp_server_port}`,
    );
  });
} catch (err) {
  throw Error(
    `[SERVER] error: failed to listen to server port ${exp_server_port}\n${err}`,
  );
}

//  AFTER RUNNING: handle unhandle rejections
//  learnt: soft downtime, as the server is supposed to be running
//          ensure all tcp handshakes completed before the forceful exit
process.on('unhandledRejection', (reason, promise) => {
  downtime(https_server, 'unhandledRejection', reason);
});
