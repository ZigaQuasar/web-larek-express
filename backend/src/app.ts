import dotenv from 'dotenv';

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import productRoutes from './routes/product';
import orderRoutes from './routes/order';
import { notFoundHandler, errorHandler } from './middlewares/error-handler';
import { errorLogger, requestLogger } from './middlewares/logger';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const MONGODB_URI = process.env.DB_ADDRESS || 'mongodb://127.0.0.1:27017/weblarek';

app.use(cors());
app.use(express.json());

mongoose.connect(MONGODB_URI);

app.use('/images', express.static(path.join(__dirname, './public/images')));

app.use(requestLogger);

app.use('/product', productRoutes);
app.use('/order', orderRoutes);

app.use(notFoundHandler);
app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
