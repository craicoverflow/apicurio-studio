if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
import fastify from 'fastify';
import { configureRoutes } from './routes';
import createService from './services/createService';

// Run the server!
const start = async () => {
  const server = fastify({ logger: process.env.NODE_ENV !== "production" });

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