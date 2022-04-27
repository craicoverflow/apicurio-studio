if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
import fastify from 'fastify';
import { configureRoutes } from './routes';
import createService from './services/createService';
import cors, { FastifyCorsOptions } from '@fastify/cors';

// Run the server!
const start = async () => {
  const server = fastify({ logger: process.env.NODE_ENV !== "production" });

  // specify which origins can access the server
  server.register(cors, () => {
    return (req, callback) => {
      const origin = req.headers.origin

      const allowedOrigins = process.env.ALLOWED_ORIGINS;
      const options: FastifyCorsOptions = { origin: false };
      if (!allowedOrigins) {
        callback(null, options);
      }
      const allowedOriginList = allowedOrigins.split(',');
      if (!allowedOriginList.length) {
        callback(null, options);
      }
      
      if (allowedOriginList.includes(origin)) {
        options.origin = true;
      }
      callback(null, options);
    } 
  });

  const spectralService = createService();

  configureRoutes(server, spectralService);

  const port = parseInt(process.env.HTTP_PORT) || 8080;
  try {
    await server.listen(port, process.env.HTTP_HOST || '127.0.0.1');
  } catch (err) {
    server.log.error(err);
    process.exit(1)
  }
}

start();