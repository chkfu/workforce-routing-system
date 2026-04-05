import { Request, Response, NextFunction, RequestHandler } from 'express';

//  remarks: prevent repeated try-catch handling
//  learnt: see wrapper functions
export const handle_async = (fn: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next); // remarks: enable both sync and async
  };
};
