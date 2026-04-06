import { error } from 'console';
import sql from 'mssql';

const config: sql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER!,
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

let pool: sql.ConnectionPool;

export async function getPool() {
  if (!pool) {
    pool = await sql.connect(config);
  }
  return pool;
}