import type { PubSub } from '../../src/pubSub/types.js';
import { getPubSub } from '../../src/pubSub/pubSub.js';
import type { MyMessageTypes } from '../shared/shared.types.js';

export const createPubSub = () => {
  const mockSendBC = new BroadcastChannel('pub-sub');
  const mockReceiveBC = new BroadcastChannel('pub-sub');
  const pubSub: PubSub<MyMessageTypes> | null = getPubSub({
    send: mockSendBC,
    receive: mockReceiveBC,
  });
  return { pubSub, mockSendBC, mockReceiveBC };
};
