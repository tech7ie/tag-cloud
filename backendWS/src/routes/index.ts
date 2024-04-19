import { Router } from 'express';
import { postWord } from '../controllers/word-controller'

const router = Router();

router.post('/word', postWord);

export default router;