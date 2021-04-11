import { Router } from 'express';

import DocumentRouter from './routes/DocumentRouter';
import RequestLogger from './middlewares/RequestLogger';

const routes = () => {
  const app = Router();

  // log requests
  RequestLogger(app);

  // routes for documents
  DocumentRouter(app);

  return app;
}

export { routes };

export { default as sockets } from './sockets/sockets';