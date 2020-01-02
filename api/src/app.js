import './bootstrap';

import Youch from 'youch';
import express from 'express';
import cookieParser from 'cookie-parser';
import 'express-async-errors';
import * as Sentry from '@sentry/node';
import cors from 'cors';
import routes from './routes';
import sentryConfig from './config/sentry';
import queue from './lib/Queue';
import database from './database';

class App {
  constructor() {
    this.database = database;
    this.queue = queue;
    this.server = express();
    Sentry.init(sentryConfig);
    this.middlewares();
    this.routes();
    this.handleException();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
    this.server.use(cookieParser());
    this.server.use(cors());
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  handleException() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();
        return res.status(500).json(errors);
      }

      return res.status(500).json({
        error: 'Internal Server Error',
      });
    });
  }
}

export default new App();
