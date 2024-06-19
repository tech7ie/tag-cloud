import { Router } from 'express';
import { getWords } from '../controllers/word-get';
import { postWord } from '../controllers/word-post';
import { updateWord } from '../controllers/word-update';
import { deleteWord } from '../controllers/word-delete';
import checkToken from '../middleware/auth';
const router = Router();

router.get('/getword', getWords);
router.post('/words',checkToken, postWord);
router.put('/words/:word', checkToken,updateWord);
router.delete('/words/:word', checkToken,deleteWord);

export default router;
