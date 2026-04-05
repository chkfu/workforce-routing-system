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
import { downtime } from './util/error_control/downtime';

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
  statusCode: 429,
  message: {
    status: 'failure',
    message:
      '[SERVER] failure: client requests overloadding, please try it later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

//  Setup express router
exp_app.use('/api/v1', rate_restriction);
exp_app.use('/api/v1/departments', departmentRoute);

//  Setup https server with SSL/TLS
const cert_path = path.resolve(__dirname, './ssl/localhost.pem');
const key_path = path.resolve(__dirname, './ssl/localhost-key.pem');

if (!fs.existsSync(cert_path)) {
  throw new Error(`[SERVER] error: SSL cert not found at ${cert_path}`);
}
if (!fs.existsSync(key_path)) {
  throw new Error(`[SERVER] error: SSL key not found at ${key_path}`);
}

//  remarks: https_server is exported for downtime function
export const https_server: https.Server = https.createServer(
  {
    cert: fs.readFileSync(cert_path),
    key: fs.readFileSync(key_path),
  },
  exp_app,
);

//  Verify database connection
pool.connect((err, client, release) => {
  if (err) {
    throw new Error(`[DATABASE] error: failed to connect to database\n${err}`);
  }
  release();
  logger.app_logger.info('[DATABASE] success: connected to database');
});

//  Global error handler

function global_err_handler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  //  setup err header info
  const critical_err_message: string = `[SERVER] critical error internally found.`;
  logger.critical_logger.error(critical_err_message);
  return res.status(500).json({
    status: 'error',
    message: critical_err_message,
  });
}

exp_app.use(global_err_handler);

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
