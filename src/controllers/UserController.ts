import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import * as yup from 'yup';
import { AppError } from '../errors/AppError';
import { UsersRepository } from '../repositories/UsersRepository';

interface CustomRequest extends Request {
  body: {
    name: string;
    email: string;
  };
}

class UserController {
  async create(req: CustomRequest, res: Response) {
    const { email, name } = req.body;

    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (error) {
      throw new AppError(error);
    }

    const userRepository = getCustomRepository(UsersRepository);

    const userAlreadyExits = await userRepository.findOne({
      email,
    });

    if (userAlreadyExits) {
      throw new AppError('User already exists, try again');
    }

    const user = userRepository.create({ email, name });

    await userRepository.save(user);

    return res.status(201).json(user);
  }
}

export { UserController };
