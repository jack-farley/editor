import { Container } from 'typedi';
import Logger from './logger';

export default () => {
  try {
    Container.set('logger', Logger);

  } catch (err) {
    Logger.error('Error on dependency injector loader: %o', err);
    throw err;
  }
}