import fastify, { FastifyInstance } from 'fastify';
import fastifyCors from 'fastify-cors';
import { Server } from 'https';
import { client, postgrator } from './Database';
import { deleteMessageHandler, getMessagesHandler, postMessagesHandler } from './API/handlers';

export class ServerApp {
  private readonly fastify: FastifyInstance<Server>;
  private readonly port: number;

  constructor(port: number) {
    this.port = port;
    this.fastify = fastify({
      logger: true,
    });
    this.fastify.register(fastifyCors);
    this.fastify.post('/message', postMessagesHandler);
    this.fastify.get('/messages', getMessagesHandler);
    this.fastify.delete('/message:id', deleteMessageHandler);
  }

  async start() {
    const appliedMigrations = await postgrator.migrate();
    console.log(`App applied migrations: ${appliedMigrations}`);

    await client.connect();
    console.log(`Connected to db`);

    const url = await this.fastify.listen(this.port);
    console.log(`App listening on: ${url}`);
  }

  async stop() {
    await client.end();
    return this.fastify.close();
  }
}
