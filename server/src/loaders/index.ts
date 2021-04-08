import { Application } from 'express';
import expressLoader from './express';

export default async (app : Application) => {

  // load express
  expressLoader(app);
}