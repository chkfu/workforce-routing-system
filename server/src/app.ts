import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { route_register } from './infra/server/route_register';
import hpp from 'hpp';
import cookie_parser from 'cookie-parser';
import global_err_handler from './infra/middlewares/error_handler';
import { rate_restriction } from './infra/middlewares/rate_limiter';

//  Setup express server

const exp_app: Application = express();

//  Setup additional security opts

//  1.  secure http response headers
exp_app.use(helmet());

//  TODO: to be applied for frontend communication
//  2. setup cors, enabling to access server url from designated sites
const cors_opts = {
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
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

//  Setup express router
const API_BASE_PATH = '/api/v1';
exp_app.use(API_BASE_PATH, rate_restriction);

for (const [key, value] of Object.entries(route_register)) {
  exp_app.use(`${API_BASE_PATH}/${key}`, value);
}

//  Catch-all handler for 404: invalid routes
//  learnt: '*' is not supported from express 5
exp_app.all('/{*path}', (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: 'failed',
    message: `[SERVER] error: can't find ${req.originalUrl} on this server.`,
  });
});

exp_app.use(global_err_handler);

//  Export
export default exp_app;
