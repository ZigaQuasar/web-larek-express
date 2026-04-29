import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import NotFoundError from '../errors/not-found-error';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction) => next(new NotFoundError('Маршрут не найден'));

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const statusCode = err.statusCode || 500;
  let message = err.message || 'На сервере произошла ошибка';

  if (err instanceof MongooseError.ValidationError) {
    message = Object.values(err.errors).map((e) => e.message).join(', ');
    return res.status(400).json({ message });
  }

  if (err instanceof Error && err.message.includes('E11000')) {
    const [field] = Object.keys((err as any).keyPattern || {}) as [string?];
    const fieldName = field || 'title';
    message = `Поле "${fieldName}" уже существует`;
    return res.status(409).json({ message });
  }

  if (err instanceof BadRequestError) return res.status(400).json({ message });
  if (err instanceof ConflictError) return res.status(409).json({ message });
  if (err instanceof NotFoundError) return res.status(404).json({ message });

  if (err.details && typeof err.details === 'object') {
    const { details } = err;
    let messages: string[] = [];

    if (Array.isArray(details)) {
      messages = details.map((d: any) => d.message);
    } else {
      Object.values(details).forEach((group: any) => {
        if (Array.isArray(group)) {
          messages.push(...group.map((d: any) => d.message));
        }
      });
    }

    return res.status(400).json({ message: messages.join(', ') || 'Ошибка валидации данных' });
  }

  return res.status(statusCode).json({ message });
};
