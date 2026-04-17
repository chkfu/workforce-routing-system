import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rate_restriction } from './infra/middlewares/rate_limiter';
import hpp from 'hpp';
import cookie_parser from 'cookie-parser';
import dept_route from './modules/departments/route';
import staff_route from './modules/staff/route';
import candidate_route from './modules/candidates/route';
import sys_user_route from './modules/sys_users/route';
import cdd_edu_route from './modules/cdd_education/route';
import cdd_exp_route from './modules/cdd_experience/route';
import cdd_test_route from './modules/cdd_tests/route';
import cdd_pref_route from './modules/cdd_preference/route';
import slt_weight_route from './modules/slt_weighting/route';
import slt_criteria_route from './modules/slt_criteria/route';
import slt_score_route from './modules/slt_scoring/route';
import pbt_intake_route from './modules/pbt_intakes/route';
import pbt_score_route from './modules/pbt_scoring/route';
import hire_weight_route from './modules/hire_weighting/route';
import hire_score_route from './modules/hire_scoring/route';
import hire_criteria_route from './modules/hire_criteria/route';
import hire_intake_route from './modules/hire_intakes/route';
import global_err_handler from './infra/middlewares/error_handler';

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

//  Setup express router
const API_BASE_PATH = '/api/v1';
// exp_app.use(API_BASE_PATH, rate_restriction);
exp_app.use(`${API_BASE_PATH}/departments`, dept_route);
exp_app.use(`${API_BASE_PATH}/staff`, staff_route);
exp_app.use(`${API_BASE_PATH}/candidates`, candidate_route);
exp_app.use(`${API_BASE_PATH}/sys_users`, sys_user_route);
exp_app.use(`${API_BASE_PATH}/candidate_education`, cdd_edu_route);
exp_app.use(`${API_BASE_PATH}/candidate_experience`, cdd_exp_route);
exp_app.use(`${API_BASE_PATH}/candidate_tests`, cdd_test_route);
exp_app.use(`${API_BASE_PATH}/candidate_preferences`, cdd_pref_route);
exp_app.use(`${API_BASE_PATH}/selection_weighting`, slt_weight_route);
exp_app.use(`${API_BASE_PATH}/selection_criteria`, slt_criteria_route);
exp_app.use(`${API_BASE_PATH}/selection_scoring`, slt_score_route);
exp_app.use(`${API_BASE_PATH}/probation_intakes`, pbt_intake_route);
exp_app.use(`${API_BASE_PATH}/probation_scoring`, pbt_score_route);
exp_app.use(`${API_BASE_PATH}/hire_criteria`, hire_criteria_route);
exp_app.use(`${API_BASE_PATH}/hire_weighting`, hire_weight_route);
exp_app.use(`${API_BASE_PATH}/hire_scoring`, hire_score_route);
exp_app.use(`${API_BASE_PATH}/hire_intakes`, hire_intake_route);

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
