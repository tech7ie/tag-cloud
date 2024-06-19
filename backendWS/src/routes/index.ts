import { Router } from 'express';
import { getWords } from '../controllers/word-get';
import { postWord } from '../controllers/word-post';
import { updateWord } from '../controllers/word-update';
import { deleteWord } from '../controllers/word-delete';

const router = Router();

router.get('/getword', getWords);
router.post('/words', postWord);
router.put('/words/:word', updateWord);
router.delete('/words/:word', deleteWord);

export default router;
