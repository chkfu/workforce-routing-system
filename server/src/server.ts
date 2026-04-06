import fs from 'fs';

import path from 'path';
import express, { Application, Request, Response, NextFunction } from 'express';
import pool from './database/pool';
import dotenv from 'dotenv';
import https from 'https';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import cookie_parser from 'cookie-parser';
import departmentRoute from './routes/department_route';
import logger from './infra/loggers';
import global_err_handler from './controllers/error_controller';
import { downtime } from './util/error_control/downtime';

//  BEFORE RUNNING: handle uncaught exceptions
//  learnt: hard downtime, as no impact when server has not been started
//  remarks: https_server not yet available, exit directly
process.on('uncaughtException', (err: Error) => {
  downtime(null, 'uncaughtException', err);
});

//  Setup dotenv

dotenv.config({ path: `${__dirname}/../process.env.example` });

//  Setup express server

const exp_app: Application = express();

//  Setup additional security opts

//  1.  secure http response headers
exp_app.use(helmet());

//  TODO: to be applied for frontend communication
//  2. setup cors, enabling to access server url from designated sites
const cors_opts = {
  origin: [''],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
exp_app.use(cors(cors_opts));

//  TODO: whitelist to be set for routes
//  3.  prevent pollution from parameter attacks
exp_app.use(hpp());

//  4.  prevent overloading memories from clients
exp_app.use(express.json({ limit: '50kb' })); // remarks: from api requests
exp_app.use(
  express.urlencoded({
    extended: true,
    limit: '50kb', // remarks: from html form submission
  }),
);

//  5. prevent clients pollute secret with signed cookies
exp_app.use(cookie_parser(process.env.COOKIE_SECRET));

//  6.  prevent overloading request with rate limit
const rate_restriction = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // remarks: restrict 100 visits each hour
  statusCode: 429, // learnt: code 429 for overloading requests
  message: {
    status: 'failed',
    message:
      '[SERVER] error: client requests overloadding, please try it later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

//  Setup express router
exp_app.use('/api/v1', rate_restriction);
exp_app.use('/api/v1/departments', departmentRoute);

//  Catch-all handler for 404: invalid routes
//  learnt: '*' is not supported from express 5
exp_app.all('/{*path}', (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: 'failed',
    message: `[SERVER] error: can't find ${req.originalUrl} on this server.`,
  });
});

exp_app.use(global_err_handler);

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
