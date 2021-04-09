import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { Status } from '../HttpStatusCode';
import { DocumentService } from '../../services';

class DocumentController {

  async getDocuments (req : Request, res : Response, next : NextFunction) {
    try {
      const documentServiceInstance = Container.get(DocumentService);
      const documents = documentServiceInstance.getDocuments();

      return res.status(200).json(JSON.stringify(documents));
    } catch(err) {
      return next(err);
    }
  }

  async createdocument (req : Request, res : Response, next : NextFunction) {
    try {
      let name = req.body.name;
      if (!name) name = "New Document";

      let content = req.body.content;
      if (!content) content = "";

      const documentServiceInstance = Container.get(DocumentService);
      const docId = documentServiceInstance.createDocument(name, content);

      return res.status(200).json(JSON.stringify(docId));
    } catch(err) {
      return next(err);
    }
  }
}

export default new DocumentController();