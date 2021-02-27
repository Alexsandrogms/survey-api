import { Router } from 'express';

import { answerRouter } from './answers';
import { npsRouter } from './nps';
import { sendMailRouter } from './sendMail';
import { surveyRouter } from './surveys';
import { userRouter } from './users';

const router = Router();

router.use('/users', userRouter);
router.use('/surveys', surveyRouter);
router.use('/sendMail', sendMailRouter);
router.use('/answers', answerRouter);
router.use('/nps', npsRouter);

export { router };
