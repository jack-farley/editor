import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { Status } from '../HttpStatusCode';
import fs from '../../files/FileSystem';

class DocumentController {

  async getDocuments (req : Request, res : Response, next : NextFunction) {
    try {
      res.send(200).json(JSON.stringify(fs.getDocuments()));
    } catch(err) {
      return next(err);
    }
  }

  async createdocument (req : Request, res : Response, next : NextFunction) {
    try {
      var name = req.body.name;
      if (!name) name = "New Document";

      var content = req.body.content;
      if (!content) content = "";

      const doc = fs.createDocument(name, content);

      res.send(200).json(JSON.stringify(doc));
    } catch(err) {
      return next(err);
    }
  }
}

export default new DocumentController();