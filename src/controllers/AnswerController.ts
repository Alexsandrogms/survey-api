import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { AppError } from '../errors/AppError';

import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';

interface CustomRequest extends Request {
  params: {
    value: string;
  };
  query: {
    u: string;
  };
}

class AnswerController {
  async execute(req: CustomRequest, res: Response) {
    const { value } = req.params;
    const { u } = req.query;

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveyUser = await surveysUsersRepository.findOne({ id: u });

    if (!surveyUser) {
      throw new AppError('Survey User does not exists!');
    }

    surveyUser.value = Number(value);

    await surveysUsersRepository.save(surveyUser);

    return res.status(201).json(surveyUser);
  }
}

export { AnswerController };
