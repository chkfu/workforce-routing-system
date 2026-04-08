import { Request, Response, NextFunction } from 'express';
import loggers from '../infra/loggers';
import { postgre_err_list } from '../util/error_control/postgre_err_list';
import ValueError from '../util/error_control/classes/ValueError';

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

  //  1. for input value error
  if (err instanceof ValueError) {
    return res.status(400).json({ status: 'failed', message: err.message });
  }

  //  2. for postgres cases
  if (err.code && typeof err.code === 'string') {
    const pgcode_full: string = err.code;
    const pgcode_type: string = pgcode_full.slice(0, 2);

    //  2a. try exact match first, fallback to 2-char prefix
    const match =
      postgre_err_list[pgcode_full] ?? postgre_err_list[pgcode_type];
    if (match && typeof match === 'object') {
      statusCode = Number(match.err_code);
      message = `[POSTGRES] error: ${match.message}. ${err.message || ''}`;
    }

    //  2b. without expectation
    else {
      statusCode = 400;
      message = `[APP] error: operational condition not specified - ${err.message || ''}`;
    }

    //  remarks: for operational errors not from AppError, but with postgre code
    isOperational = true;
  }

  //  B. programmatic cases
  if (!isOperational) {
    statusCode = 500;
    message = `[CRITICAL] error: programmatic condition not specified -  ${err}`;
  }

  //  error responses
  loggers.app_logger.error(`[APP] error: [${statusCode}] - ${message}`);
  res.status(statusCode).json({
    status: statusCode >= 500 ? 'error' : 'failed',
    message,
  });
}

export default global_err_handler;
