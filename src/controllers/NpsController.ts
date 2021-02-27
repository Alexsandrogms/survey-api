import { Request, Response } from 'express';
import { getCustomRepository, Not, IsNull } from 'typeorm';
import { AppError } from '../errors/AppError';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';

interface CustomRequest extends Request {
  params: {
    survey_id: string;
  };
}

class NpsController {
  /**
   *
   * 1 2 3 4 5 6 7 8 9 10
    Detratores => 0 - 6
    Passivos => 7 - 8
    Promotores => 9 - 10

    Cálculo => (n° promotores - n° detratores) / (n° respondentes) * 100
   */

  async execute(req: CustomRequest, res: Response) {
    const { survey_id } = req.params;

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveysUsers = await surveysUsersRepository.find({
      survey_id,
      value: Not(IsNull()),
    });

    if (!surveysUsers) {
      throw new AppError('Survey User does not exists!');
    }

    const detractor = surveysUsers.filter(
      ({ value }) => value >= 0 && value <= 6
    ).length;

    const promoters = surveysUsers.filter(
      ({ value }) => value >= 9 && value <= 10
    ).length;

    const passive = surveysUsers.filter(({ value }) => value >= 7 && value <= 8)
      .length;

    const totalAnswers = surveysUsers.length;

    const calculate = ((promoters - detractor) / totalAnswers) * 100;

    return res.json({
      detractor,
      promoters,
      passive,
      totalAnswers,
      nps: Number(calculate.toFixed(2)),
    });
  }
}

export { NpsController };
