import { Request, Response } from 'express';
import pool from '../database/db';

export const deleteWord = async (req: Request, res: Response) => {
  const { word } = req.params;
  try {
    const client = await pool.connect();
    try {
      await client.query('DELETE FROM words WHERE word = $1', [word]);
      res.status(200).send('Word deleted');
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
};
