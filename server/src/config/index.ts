import dotenv from 'dotenv';

dotenv.config();

export default {
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.SERVER_PORT, 10),
}