import { Application } from 'express';
import expressLoader from './express';
import Logger from './logger';
import http from 'http';
import dependencyInectorLoader from './dependencyInjector';
import { sockets } from '../api';

export default async (app : Application, server : http.Server) => {

  await dependencyInectorLoader();
  Logger.info("Dependency Injector loaded.");

  // load express
  expressLoader(app);
  Logger.info("Express loaded.");

  // load sockets
  sockets(server);
  Logger.info("Sockets loaded.");
}