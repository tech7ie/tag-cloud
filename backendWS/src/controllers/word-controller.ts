import { Request, Response } from 'express';
import { broadcast } from '../websockets/word-websoket';
import pool from '../database/db';
import { config } from 'dotenv';
config();

export async function postWord(req: Request, res: Response) {
  try {
    const client = await pool.connect();
    let word = req.body.word.toLowerCase();
    const regex = /^[a-zA-Zа-яА-ЯёЁ]{1,15}$/;
    
    if (regex.test(word)) {
      try {
        await client.query('INSERT INTO words (word) VALUES ($1)', [word]);
        broadcast(word);
        res.send('sent');
      } finally {
        client.release();
      }
    } else {
      res.status(400).send('Invalid word format');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
}
