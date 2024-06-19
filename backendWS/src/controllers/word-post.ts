import { Request, Response } from 'express';
import pool from '../database/db';
import { clients } from '../app';
import { ServerResponse } from 'http';
import OpenAI from 'openai';

export const postWord = async (req: Request, res: Response) => {
  try {

    const client = await pool.connect();
    let word = req.body.word.toLowerCase();
    let weight = req.body.weight;
    const regex = /^[a-zA-Zа-яА-ЯёЁ]{1,24}$/;
    const size = word.length;
    console.log(word)
    if (regex.test(word)) {
      try {
        let boolStr = await sendPrompt(word);
        console.log(boolStr)
        if (boolStr === "1") {
          res.status(400).send('Bad word');
        }
        else {
          const result = await client.query('SELECT * FROM words WHERE word = $1', [word]);

          if (result.rows.length > 0) {
            
            await client.query('UPDATE words SET weight = weight + 1 WHERE word = $1', [word]);
          } else {
            if (weight) {
              await client.query('INSERT INTO words (word, size, weight) VALUES ($1, $2, $3)', [word, size, weight]);
            }
            else {
              await client.query('INSERT INTO words (word, size, weight) VALUES ($1, $2, $3)', [word, size, 7]);
            }
          }

          res.send('sent');

          clients.forEach((client: ServerResponse) => client.write(`data: ${JSON.stringify({ word })}\n\n`));
        
      }} finally {
        client.release();
      }
    } else {
      res.status(400).send('Invalid word format');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }

  async function sendPrompt(word: string) {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY as string,
    });
    const chatCompletion = await openai.chat.completions.create({
      messages: [{
        role: 'user',
        content: `если строка "${word}" является словом и словом оскорбительным или нецензурным то
                     ОТПРАВЬ ТОЛЬКО ЦИФРУ: если да, то 1, если нет - 0 `
      }],
      model: 'gpt-4',
    });
    
    return chatCompletion.choices[0].message.content
  }
};
