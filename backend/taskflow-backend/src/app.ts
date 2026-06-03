import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { apiRouter } from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';
import { env } from './config/env';
import { API_PREFIX } from './constants';

const app: Application = express();

app.use(helmet());

app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  })
);

app.use(morgan(env.isProduction ? 'combined' : 'dev'));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(API_PREFIX, apiRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
