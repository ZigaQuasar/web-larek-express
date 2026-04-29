import { Request, Response, NextFunction } from 'express';
import NotFoundError from '../errors/not-found-error';

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError('Маршрут не найден'));
};

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err.details) {
    const message = Object.values(err.details)
      .flat()
      .map((d: any) => d.message)
      .join(', ');
    return res.status(400).json({ message: message || 'Ошибка валидации данных' });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'На сервере произошла ошибка';
  return res.status(statusCode).json({ message });
};
