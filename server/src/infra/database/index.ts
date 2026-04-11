import path from 'path';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import logger from '../loggers';

dotenv.config({
  path: path.resolve(__dirname, '../../process.env.example'),
  override: true,
});

//  Connect postgre database
//  learnt: connection pool set for reusability, optimised performance and database management
if (!process.env.POSTGRE_CONN) {
  const err_message: string = `[DATABASE] error: postgre connection not found in environment variables`;
  logger.critical_logger.error(err_message);
  throw new Error(err_message);
}
const pg_pool = new Pool({
  connectionString: process.env.POSTGRE_CONN,
  connectionTimeoutMillis: 15000, // learnt: timeout pending for neon postgre wake-up
  ssl: {
    rejectUnauthorized: true,
  },
});

export default pg_pool;
