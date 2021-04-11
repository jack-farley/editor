import { Router, Request, Response, NextFunction } from "express";
import { Container } from 'typedi';
import { Logger } from 'winston';


const requestLogger = (req : Request, res : Response, next : NextFunction) => {
  const LoggerInst : Logger = Container.get('logger');
  LoggerInst.http(`${req.originalUrl} - ${req.method} - ${req.body} - ${req.ip}`);
  return next();
}


export default (app : Router) => {
  app.use(requestLogger);
}