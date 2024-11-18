import type {
  Messages,
  PubSubHandlerStore,
  PubSubStore,
  PubSubMessage,
  PubSub,
} from './types.js';

declare global {
  interface Window {
    getPubSub: <M extends Messages>(
      params:
        | {
            send: BroadcastChannel;
            receive: BroadcastChannel;
          }
        | undefined,
    ) => PubSub<M> | null;
  }
}

const pubSubStore: PubSubStore<Messages> = {
  pubSub: null,
};

export const getPubSub = <M extends Messages>(
  params?:
    | {
        send: BroadcastChannel;
        receive: BroadcastChannel;
      }
    | undefined,
): PubSub<M> | null => {
  const pubSubStoreRef = pubSubStore as unknown as PubSubStore<M>;
  if (pubSubStoreRef.pubSub !== null) {
    return pubSubStoreRef.pubSub;
  }
  const sendChannel = params?.send || new BroadcastChannel('pub-sub');
  const receiveChannel = params?.receive || new BroadcastChannel('pub-sub');
  window.addEventListener('beforeunload', () => {
    if (!params) return;
    sendChannel.close();
    receiveChannel.close();
  });

  const handlerStore: PubSubHandlerStore<M> = {} as PubSubHandlerStore<M>;
  receiveChannel.addEventListener('message', (event) => {
    if ('type' in event.data) {
      const msg = event.data as PubSubMessage<M, M['type']>;
      (handlerStore[msg.type] || []).forEach(({ handler, subscriberId }) => {
        handler({ ...msg, subscriberId });
      });
    }
  });
  const pubSub: PubSub<M> = {
    publish: (msg) => sendChannel.postMessage(msg),
    subscribe: (handlerDetails) => {
      const type = handlerDetails.type;
      handlerStore[type] = [...(handlerStore[type] || []), handlerDetails];
      return () => {
        handlerStore[type] = (handlerStore[type] || []).filter(
          (entry) => handlerDetails !== entry,
        );
      };
    },
    clearHandlers: () => {
      Object.keys(handlerStore).forEach((key) => {
        handlerStore[key as keyof typeof handlerStore] = [];
      });
    },
  };

  pubSubStoreRef.pubSub = pubSub;
  return pubSub;
};

(() => {
  window.getPubSub = getPubSub;
})();
