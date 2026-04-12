import https from 'https';
import logger from '../loggers';

export const downtime = function (
  server: https.Server | null,
  err_name: string,
  err_message: any,
) {
  //  learnt: ensure errors are controllable, as unknown errors could lead to disasters during operations
  logger.critical_logger.error(
    `[SERVER] downtime: ${err_name}: ${err_message}`,
  );
  //  1. for case when server in progress
  if (server) {
    server.close(() => {
      process.exit(1);
    });
    setTimeout(() => {
      logger.critical_logger.error('[SERVER] FORCE EXIT');
      process.exit(1);
    }, 5000); // remarks: soft downtime with forceful exit, avoid zombie connections remained
  }
  //  2. for case of uncaught exceptions (server not yet started)
  else {
    process.exit(1); //  remarks: manage fatal errors with immediate exit
  }
};
