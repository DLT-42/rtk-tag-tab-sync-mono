import { Client } from 'pg';
import Postgrator from 'postgrator';

export const postgrator = new Postgrator({
  migrationDirectory: `${__dirname}/../dbMigrations`,
  driver: 'pg',
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  port: 5003,
  host: 'localhost',
});

export const client = new Client({
  user: 'postgres',
  password: 'postgres',
  database: 'postgres',
  port: 5003,
  host: 'localhost',
});
