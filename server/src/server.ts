import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import pool from './infra/database';
import https from 'https';
import logger from './infra/loggers';
import { downtime } from './infra/utils/downtime';
import exp_app from './app';

//  Setup dotenv env
dotenv.config({ path: path.resolve(__dirname, '../process.env.example') });

//  BEFORE RUNNING: handle uncaught exceptions
//  learnt: hard downtime, as no impact when server has not been started
//  remarks: https_server not yet available, exit directly
process.on('uncaughtException', (err: Error) => {
  downtime(null, 'uncaughtException', err);
});

//  Setup https server with SSL/TLS
const cert_path = path.resolve(__dirname, './infra/ssl/localhost.pem');
const key_path = path.resolve(__dirname, './infra/ssl/localhost-key.pem');

if (!fs.existsSync(cert_path)) {
  const err_message: string = `[SERVER] error: SSL cert not found at ${cert_path}`;
  logger.critical_logger.error(err_message);
  throw new Error(err_message);
}
if (!fs.existsSync(key_path)) {
  const err_message: string = `[SERVER] error: SSL key not found at ${key_path}`;
  logger.critical_logger.error(err_message);
  throw new Error(err_message);
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
    logger.app_logger.info(
      `[SERVER] success: listening to https://localhost:${exp_server_port}`,
    );
  });
} catch (err) {
  logger.critical_logger.error(
    `[SERVER] error: failed to listen to server port ${exp_server_port}\n${err}`,
  );
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
