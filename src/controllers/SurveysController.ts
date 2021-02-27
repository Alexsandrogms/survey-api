import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { AppError } from '../errors/AppError';
import { SurveysRepository } from '../repositories/SurveysRepository';

interface CustomRequest extends Request {
  body: {
    title: string;
    description: string;
  };
}

class SurveysController {
  async create(req: CustomRequest, res: Response) {
    const { title, description } = req.body;

    const surveysRepository = getCustomRepository(SurveysRepository);

    const survey = surveysRepository.create({ title, description });

    await surveysRepository.save(survey);

    return res.status(201).json(survey);
  }

  async show(req: Request, res: Response) {
    const surveysRepository = getCustomRepository(SurveysRepository);

    const surveyAll = await surveysRepository.find();

    if (!surveyAll) {
      throw new AppError('Surveys not found!');
    }

    return res.status(200).json(surveyAll);
  }
}

export { SurveysController };
