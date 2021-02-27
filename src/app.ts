import express from 'express';
import 'reflect-metadata';
import 'express-async-errors';

import createConnection from './database';
import errorMiddleware from './middlewares/errorMiddleware';
import { router } from './routes';

createConnection();
const app = express();

app.use(express.json());
app.use(router);
app.use(errorMiddleware);

export { app };
