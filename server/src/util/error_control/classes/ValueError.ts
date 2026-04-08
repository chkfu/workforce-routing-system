export class ValueError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'ValueError';
    this.isOperational = true;
    this.statusCode = statusCode;
    this.status = 'failed';

    Error.captureStackTrace(this, this.constructor);
  }
}

//  Export

export default ValueError;
