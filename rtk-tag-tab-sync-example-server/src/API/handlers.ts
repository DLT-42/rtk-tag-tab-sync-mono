import { DeleteMessageHandler } from 'API/types';
import { Message, GetMessagesHandler, MessagePayload, PostMessagesHandler } from './types';
import { client } from '../Database';
import { v4 as uuid } from 'uuid';

export const postMessagesHandler: PostMessagesHandler = async ({ body }, reply) => {
  const messagePayload = JSON.parse(body as unknown as string) as MessagePayload;
  const { message, visibility } = messagePayload;
  const result = await client.query(
    `INSERT INTO messages (id, message, liked, visibility) VALUES ('${uuid()}', '${message}', FALSE, '${visibility}');`,
  );
  return reply.code(201).send({ id: result.oid });
};

export const getMessagesHandler: GetMessagesHandler = async ({ query: { visibility, liked } }, reply) => {
  const queryFilters = [];
  if (visibility) {
    queryFilters.push(` visibility='${visibility}'`);
  }
  if (liked) {
    queryFilters.push(` liked=${liked}`);
  }
  const filterString = queryFilters.length ? ` WHERE${queryFilters.join(' AND')}` : '';
  const query = `SELECT * FROM messages${filterString}`;
  const result = await client.query(`${query}`);
  const messages: Message[] = result.rows.map((row) => ({
    id: row.id,
    message: row.message,
    liked: row.liked,
    visibility: row.visibility,
  }));
  return reply.code(200).send(messages);
};

export const deleteMessageHandler: DeleteMessageHandler = async ({ query: { id } }, reply) => {
  await client.query(`DELETE FROM messages WHERE id='${id}'`);
  return reply.code(204).send();
};
