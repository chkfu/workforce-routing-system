import { Request, Response, NextFunction } from 'express';
import loggers from '../infra/loggers';
import { postgre_err_list } from '../util/error_control/postgre_err_list';

//  Global error handler
//  remarks: operational errors refers to failed status with code 4xx
//           programmatic errors refers to error status with code 500
function global_err_handler(
  err: any, // remakrs: can be AppError or unknown error
  req: Request,
  res: Response,
  next: NextFunction,
) {
  //  infomation to be sent from server
  let statusCode: number = Number(err.statusCode) || 500;
  let message: string = err.message;
  let isOperational: boolean = err.isOperational || false; // reamrks: customised column, update by manual

  //  A. operational cases
  if (err.code && typeof err.code === 'string') {
    const pgcode_full: string = err.code;
    const pgcode_type: string = pgcode_full.slice(0, 2);

    //  1. postgre related — try exact match first, fallback to 2-char prefix
    const match =
      postgre_err_list[pgcode_full] ?? postgre_err_list[pgcode_type];
    if (match && typeof match === 'object') {
      statusCode = Number(match.err_code);
      message = `[POSTGRES] error: ${match.message}. ${err.message || ''}`;
    }

    //  2. without expectation
    else {
      statusCode = 400;
      message = `[POSTGRES] error: unknown operational condition. ${err.message || ''}`;
    }

    //  remarks: for operational errors not from AppError, but with postgre code
    isOperational = true;
  }

  //  B. programmatic cases
  if (!isOperational) {
    statusCode = 500;
    message = `[CRITICAL] error: unknown programmatic condition. ${err}`;
  }

  //  error responses
  loggers.app_logger.error(`[APP] error: [${statusCode}] - ${message}`);
  res.status(statusCode).json({
    status: statusCode >= 500 ? 'error' : 'failed',
    message,
  });
}

export default global_err_handler;
