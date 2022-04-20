import { Client } from 'pg';
import { PostgreSQLDatabaseProvider } from '../providers/PostgreSQLDatabaseProvider';
import { SpectralService } from './SpectralService';
import { ISpectralService } from "./ISpectralService";

// Create a SpectralService with database connection
export default (): SpectralService => {
  // connect to the database
  const client = new Client({
    user: process.env.AS_SPECTRAL_DB_USER,
    host: process.env.AS_SPECTRAL_DB_HOST,
    database: process.env.AS_SPECTRAL_DATABASE,
    password: process.env.AS_SPECTRAL_DB_PASSWORD,
    port: parseInt(process.env.AS_SPECTRAL_DB_PORT),
  });
  client.connect();

  const dbProvider = new PostgreSQLDatabaseProvider(client);
  const service = new SpectralService(dbProvider);

  return service;
}
