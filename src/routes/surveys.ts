import { Router } from 'express';
import { SurveysController } from '../controllers/SurveysController';

const router = Router();

const surveysController = new SurveysController();

router.route('/')
  .get(surveysController.show)
  .post(surveysController.create);

export { router as surveyRouter };
