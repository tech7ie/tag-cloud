import { Request, Response } from 'express';
import pool from '../database/db';
import { config } from 'dotenv';
config();

export async function getWords(req: Request, res: Response) {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT word, size, weight FROM words');
      res.json(result.rows);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
}
