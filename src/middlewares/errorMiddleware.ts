import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError';

export default (
  err: Error,
  _request: Request,
  response: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    console.log('Erro no controller -> ', err.controller);
    return response.status(err.statusCode).json({
      message: err.message,
    });
  }

  return response.status(500).json({
    status: 'Error',
    message: `Internal server error - ${err.message}`,
  });
};
