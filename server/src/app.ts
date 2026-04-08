import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import cookie_parser from 'cookie-parser';
import dept_route from './routes/department_route';
import staff_route from './routes/staff_route';
import global_err_handler from './controllers/error_controller';

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
exp_app.use('/api/v1/departments', dept_route);
exp_app.use('/api/v1/staff', staff_route);

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
