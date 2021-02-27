import { Router } from 'express';
import { SendMailController } from '../controllers/SendMailController';

const router = Router();

const sendMailController = new SendMailController();

router.route('/').post(sendMailController.execute);

router.route('/answers/:value').post();

export { router as sendMailRouter };
