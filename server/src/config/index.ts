import dotenv from 'dotenv';

dotenv.config();

export default {
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.SERVER_PORT, 10),

  api: {
    prefix: '/',
  },

  logs : {
    level: process.env.LOG_LEVEL || 'silly',
  },
}