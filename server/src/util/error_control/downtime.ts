import logger from '../../infra/loggers';
import { https_server } from '../../server';

export const downtime = function (err_name: string, err_message: any) {
  //  learnt: ensure errors are controllable, as unknown errors could lead to disasters during operations
  logger.critical_logger.error(
    `[SERVER] downtime: ${err_name}: ${err_message}`,
  );
  https_server.close(() => process.exit(1));

  //  learnt: the forceful exit to prevent any failure get stuck (zombie connections)
  setTimeout(() => {
    logger.critical_logger.error(
      '[SERVER] downtime: FORCEFUL EXIT PROCESSING...',
    );
    process.exit(1);
  }, 5000);
};
