import { Request, Response } from 'express';
import OpenAI from 'openai';
import { broadcast } from '../websockets/word-websoket'
import { config } from 'dotenv';
config();


export async function postWord(req: Request, res: Response) {
    try {
      let word = req.body.word.toLowerCase();
      (async (str) => {
        const regex = /^[a-zA-Zа-яА-ЯёЁ]{1,15}$/;
        if (regex.test(str)) {
            let boolStr = await sendPrompt(str);
            console.log(boolStr);
            if (boolStr === '0') {
                broadcast(str);
            }
        }
      })(word);
      res.send('sent');
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  }


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY as string,
  });

async function sendPrompt(word: string) {
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
