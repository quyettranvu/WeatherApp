import pg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pg;
dotenv.config();

const port = process.env.PG_PORT ? parseInt(process.env.PG_PORT, 10) : 5432;

export const pool = new Pool({
  host: process.env.PG_HOST,
  port: port,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

(async () => {
  try {
    const client = await pool.connect();
    console.log('Connected to DB successfully!');
  } catch (err) {
    console.error(err);
  }
})();
