import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { Status } from '../HttpStatusCode';
import { DocumentService } from '../../services';

class DocumentController {

  async getDocuments (req : Request, res : Response, next : NextFunction) {
    try {
      const documentServiceInstance = Container.get(DocumentService);
      const documents = documentServiceInstance.getDocuments();
      
      res.send(200).json(JSON.stringify(documents));
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

      const documentServiceInstance = Container.get(DocumentService);
      const doc = documentServiceInstance.createDocument(name, content);

      res.send(200).json(JSON.stringify(doc));
    } catch(err) {
      return next(err);
    }
  }
}

export default new DocumentController();