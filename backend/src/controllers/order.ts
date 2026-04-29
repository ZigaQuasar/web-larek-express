import { Request, Response, NextFunction } from 'express';
import { faker } from '@faker-js/faker';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';

const createOrder = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { total, items } = req.body;

  return Product.find({ _id: { $in: items } }).lean()
    .then((products) => {
      if (products.length !== items.length) {
        throw new BadRequestError('Один или несколько товаров не найдены');
      }

      const unavailable = products.find((p) => p.price === null);
      if (unavailable) {
        throw new BadRequestError(`Товар "${unavailable.title}" временно не продаётся`);
      }

      const calculatedTotal = products.reduce<number>((sum, p) => sum + (p.price as number), 0);

      if (calculatedTotal !== total) {
        throw new BadRequestError('Неверная сумма заказа');
      }

      return res.status(200).json({
        id: faker.string.uuid(),
        total,
      });
    })
    .catch((error) => next(error));
};

export default createOrder;
