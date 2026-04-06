import { Request, Response, NextFunction } from 'express';
import AppError from '../util/error_control/AppError';

//  Global error handler

function global_err_handler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  err.statusCode = Number(err.statusCode) || 500;
  err.status = String(err.status) || 'error';
  //  setup err header info
  res.status(err.statusCode).json({
    status: err.status,
    mesage: err.message,
  });
}

export default global_err_handler;
