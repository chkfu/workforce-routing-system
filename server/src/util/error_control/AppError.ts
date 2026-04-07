import { error } from 'console';

class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  stack: string | undefined;
  error: any;

  constructor(statusCode: number, message: string) {
    //  remarks: extract the message and status code from original error class
    super(message);

    // remarks: code 4xx for operational errors
    this.isOperational = true;
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    //  learnt: refers to the error directly, by pass the trace of this error constructor
    Error.captureStackTrace(this, this.constructor);
  }
}

//  Export
export default AppError;
