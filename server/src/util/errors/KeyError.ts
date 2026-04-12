export class KeyError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'KeyError';
    this.isOperational = true;
    this.statusCode = statusCode;
    this.status = 'failed';

    Error.captureStackTrace(this, this.constructor);
  }
}

//  Export

export default KeyError;
