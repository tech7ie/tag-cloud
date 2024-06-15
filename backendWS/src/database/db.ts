import { Pool } from 'pg';
import { config } from 'dotenv';
config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.PORT),
});

export default pool;