import path from 'path';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import logger from '../infra/loggers';

//  Setup dotenv
dotenv.config({ path: path.resolve(__dirname, '../../process.env.example') });

//  Connect postgre database
//  learnt: connection pool set for reusability, optimised performance and database management
if (!process.env.POSTGRE_CONN) {
  const err_message: string = `[DATABASE] error: postgre connection not found in environment variables`;
  logger.critical_logger.error(err_message);
  throw new Error(err_message);
}
const pool = new Pool({
  connectionString: process.env.POSTGRE_CONN,
  connectionTimeoutMillis: 5000, // learnt: timeout pending for neon postgre wake-up
  ssl: {
    rejectUnauthorized: true,
  },
});

export default pool;
