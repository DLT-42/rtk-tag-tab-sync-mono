import { FastifyLoggerInstance, FastifyReply, FastifyRequest, RequestGenericInterface } from 'fastify';
import { IncomingMessage, Server } from 'http';

enum Visibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

enum Liked {
  LIKED = 'true',
  NOT_LIKED = 'false',
}

type VisibilityFilterValue = Visibility.PRIVATE | Visibility.PUBLIC | '';

type LikedFilterValue = Liked.LIKED | Liked.NOT_LIKED | '';

type MessageQuery = {
  visibility?: VisibilityFilterValue;
  liked?: LikedFilterValue;
};

type DeleteMessageQuery = {
  id?: UUID;
};

type UUID = string;

type NewMessagesRequest = FastifyRequest<
  { Querystring: MessageQuery },
  Server,
  IncomingMessage,
  RequestGenericInterface,
  FastifyLoggerInstance
>;

type DeleteMessagesRequest = FastifyRequest<
  { Querystring: DeleteMessageQuery },
  Server,
  IncomingMessage,
  RequestGenericInterface,
  FastifyLoggerInstance
>;

export type Message = {
  id: UUID;
  message: string;
  liked: boolean;
  visibility: Visibility;
};

export type MessagePayload = {
  message: string;
  visibility: Visibility;
};

export type GetMessagesHandler = (request: NewMessagesRequest, reply: FastifyReply) => Promise<Message[]>;

export type DeleteMessageHandler = (request: DeleteMessagesRequest, reply: FastifyReply) => Promise<FastifyReply>;

export type PostMessagesHandler = (request: FastifyRequest, reply: FastifyReply) => Promise<{ id: string }>;
