import winston from 'winston';
import appRoot from 'app-root-path';

import config from '../config';


class TimestampFirst {
  enabled: boolean;
  constructor(enabled = true) {
      this.enabled = enabled;
  }
  transform(obj : any) {
      if (this.enabled) {
          return Object.assign({
              timestamp: obj.timestamp,
              level: obj.level,
          }, obj);
      }
      return obj;
  }
}

const logger = winston.createLogger({
  level: config.logs.level,
  levels: winston.config.npm.levels,
  transports: [
    new winston.transports.File({
      filename: `${appRoot}/logs/error.log`,
      level: 'error',
    }),
    new winston.transports.File({
      filename: `${appRoot}/logs/combined.log`
    }),
  ],
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    new TimestampFirst(true),
    winston.format.json()
  ),
  exitOnError: false,
});


export default logger;