import { Router } from 'express';
import { NpsController } from '../controllers/NpsController';

const router = Router();

const npsController = new NpsController();

router.route('/:survey_id').get(npsController.execute);

export { router as npsRouter };
