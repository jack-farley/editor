import { Router } from 'express';

import DocumentRouter from './routes/DocumentRouter';

export default () => {
  const app = Router();

  DocumentRouter(app);

  return app;
}