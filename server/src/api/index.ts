import { Router } from 'express';

import DocumentRouter from './routes/DocumentRouter';

const routes = () => {
  const app = Router();

  DocumentRouter(app);

  return app;
}

export { routes };

export { default as sockets } from './sockets/sockets';