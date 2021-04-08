import { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from '../api';
import config from '../config';
import { Status } from '../api/HttpStatusCode';

export default (app : Application) => {

  // health checkpoints
  app.get('/status', (req, res) => {
    res.status(Status.OK).end();
  });
  app.head('/status', (req, res) => {
    res.status(Status.OK).end();
  });

  app.enable('trust proxy');
  app.use(cors());
  app.use(require('method-override')());

  // body parsing
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // load the api routes
  app.use(config.api.prefix, routes());

}