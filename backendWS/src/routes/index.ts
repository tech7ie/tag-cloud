import {Router, Request, Response} from 'express';
import {postWord} from '../controllers/word-controller'

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.status(200).send('health check');
});
router.post('/word', postWord);

export default router;