import { Request, Response } from 'express';
import { resolve } from 'path';
import { getCustomRepository } from 'typeorm';

import { AppError } from '../errors/AppError';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import { UsersRepository } from '../repositories/UsersRepository';
import SendMailServices from '../services/SendMailServices';

interface CustomRequest extends Request {
  body: {
    email: string;
    survey_id: string;
  };
}

class SendMailController {
  async execute(req: CustomRequest, res: Response) {
    const { email, survey_id } = req.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const userAlreadyExists = await usersRepository.findOne({ email });

    if (!userAlreadyExists) {
      throw new AppError('User does not exists');
    }

    const surveyAlreadyExists = await surveysRepository.findOne({
      id: survey_id,
    });

    if (!surveyAlreadyExists) {
      throw new AppError('Survey does not exists');
    }

    const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');

    const surveyUserAlreadyExits = await surveysUsersRepository.findOne({
      where: { user_id: userAlreadyExists.id, value: null },
    });

    const variables = {
      name: userAlreadyExists.name,
      title: surveyAlreadyExists.title,
      description: surveyAlreadyExists.description,
      id: '',
      url: process.env.URL_MAIL,
    };

    if (surveyUserAlreadyExits) {
      variables.id = surveyAlreadyExists.id;
      await SendMailServices.execute(
        email,
        variables.title,
        variables,
        npsPath
      );
      return res.json(surveyUserAlreadyExits);
    }

    const surveyUser = surveysUsersRepository.create({
      user_id: userAlreadyExists.id,
      survey_id,
    });

    await surveysUsersRepository.save(surveyUser);

    variables.id = surveyUser.id;

    await SendMailServices.execute(email, variables.title, variables, npsPath);

    return res.status(201).json(surveyUser);
  }
}

export { SendMailController };
