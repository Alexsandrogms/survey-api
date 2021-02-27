import { Router } from 'express';
import { AnswerController } from '../controllers/AnswerController';

const router = Router();

const answerController = new AnswerController();

router.route('/:value').get(answerController.execute);

export { router as answerRouter };
