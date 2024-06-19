import { Request, Response } from 'express';
import pool from '../database/db';

export const updateWord = async (req: Request, res: Response) => {
  const { word } = req.params;
  const { newWord, size, weight } = req.body;
  console.log(newWord, size, weight);
  
  if (newWord === undefined) {
    return res.status(400).send('newWord is required');
  }

  try {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM words WHERE word = $1', [word]);
      if (result.rows.length === 0) {
        return res.status(404).send('Word not found');
      }

      await client.query('UPDATE words SET word = $1, size = $2, weight = $3 WHERE word = $4', [newWord, size, weight, word]);
    
      res.status(200).send('Word updated');
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error updating word:', error);
    res.status(500).send('An error occurred');
  }
};
