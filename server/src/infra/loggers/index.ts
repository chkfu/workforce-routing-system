import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

//  learnt: winston's built-in functions, spec usage
const { combine, timestamp, printf, colorize, errors, label } = format;

//  Setup log files format
const createRotateTransport = (filename: string, level: string) => {
  return new DailyRotateFile({
    filename: `./src/infra/logs/${filename}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '128m',
    maxFiles: '7d', //  learnt: kepts logs for the max timespan
    level, // learnt: include this level and its above
  });
};

//  Setup message format

const msg_format = printf(({ level, message, label, timestamp, stack }) => {
  const log_message = stack || message;
  return `${timestamp} - ${label || 'API'} - ${level}: ${log_message}`;
});

//  Setup loggers

//  remarks: reusable creater for further expansions
const create_loggers = (filename: string, level: string = 'info') => {
  return createLogger({
    format: combine(
      label({ label: filename.toUpperCase() }),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      errors({ stack: true }),
      msg_format,
    ),
    transports: [
      //  1.  first transport formatter - rotate version
      createRotateTransport(filename, level),
      //  2.  second transport formatter - terminal console version
      new transports.Console({
        format: combine(colorize({ all: true }), msg_format),
      }),
    ],
  });
};

const app_logger = create_loggers('app');
const auth_logger = create_loggers('auth');
const http_logger = create_loggers('http');
const critical_logger = create_loggers('critical', 'error');

export default {
  app_logger,
  auth_logger,
  http_logger,
  critical_logger,
};
