import { Application } from 'express';
import expressLoader from './express';
import Logger from './logger';
import dependencyInectorLoader from './dependencyInjector';

export default async (app : Application) => {

  await dependencyInectorLoader();
  Logger.info("Dependency Injector loaded.");

  // load express
  expressLoader(app);
  Logger.info("Express loaded.");
}