import 'reflect-metadata';
import 'express-async-errors';
import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import swaggerUI from 'swagger-ui-express';

import '@shared/container';

import { AppError } from '@shared/errors/AppError';
import { router } from '@shared/infra/http/routes';
import createConnection from '@shared/infra/typeorm';

import swaggerFile from '../../../swagger.json';

createConnection();
const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerFile));

app.use(router);

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({ error: err.message });
    }

    console.error(err);

    return response.status(500).json({ error: 'Internal server error' });
  }
);

export { app };