import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';
import ConflictError from '../errors/conflict-error';

export const getProducts = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => Product.find({}).lean()
  .then((items) => {
    res.json({
      items,
      total: items.length,
    });
  })
  .catch((err) => next(err));

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => Product.create(req.body)
  .then((product) => {
    res.status(201).json(product);
  })
  .catch((err) => {
    if (err instanceof Error && err.message.includes('E11000')) {
      return next(new ConflictError('Товар с таким названием уже существует'));
    }
    return next(err);
  });
