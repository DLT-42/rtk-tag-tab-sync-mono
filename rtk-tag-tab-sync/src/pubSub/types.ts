export type Messages = {
  type: string;
};

export type PubSubMessage<E extends Messages, T extends E['type']> = {
  type: T;
  publisherId: string;
} & E;

export type PubSubHandler<E extends Messages, T extends E['type']> = (
  msg: PubSubMessage<E, T> & { subscriberId: string },
) => void;

export type PubSubHandlerStore<E extends Messages> = {
  [T in E['type']]: {
    handler: PubSubHandler<E, T>;
    subscriberId: string;
  }[];
};

export type SubScribeParams<E extends Messages, T> = T extends E['type']
  ? {
      type: T;
      subscriberId: string;
      handler: PubSubHandler<E, T>;
    }
  : never;

export type PubSub<E extends Messages> = {
  publish: (msg: PubSubMessage<E, E['type']>) => void;
  subscribe: (params: SubScribeParams<E, E['type']>) => () => void;
  clearHandlers: () => void;
};

export type PubSubStore<E extends Messages> = {
  pubSub: PubSub<E> | null;
};
