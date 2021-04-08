import { Router } from 'express';
import DocumentController from '../controllers/DocumentController';

const router = Router();

export default (app : Router) => {

  app.use('/documents', router);

  router.get('/', DocumentController.getDocuments);
  router.post('/', DocumentController.createdocument);


}