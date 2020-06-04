import dotenv from 'dotenv';

dotenv.config();

export default {
  db: 'mongodb://127.0.0.1:27017/alpha',
  port: 80,
  allowedOrigins: ['http://localhost:4000', 'http://localhost:3000', 'http://localhost:80']
};
