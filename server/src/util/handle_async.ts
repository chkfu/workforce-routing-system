import { Request, Response, NextFunction, RequestHandler } from 'express';

//  remarks: prevent repeated try-catch handling
//  learnt: see wrapper functions
export const handle_async = <T = Record<string, string>>(
  fn: RequestHandler<T>,
): RequestHandler<T> => {
  return (req: Request<T>, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next); // remarks: enable both sync and async
  };
};
