import { vi } from 'vitest';
import type { PubSubMessage, SubScribeParams } from '../../src/pubSub/types.js';
import type { MyMessageTypes } from '../shared/shared.types.js';

export const sub1 = { subscriberId: 'SUB1' };

export const sub2 = { subscriberId: 'SUB2' };

export const handlerSUB1_A = vi.fn();

export const handlerSUB2_A = vi.fn();

export const handlerSUB2_B = vi.fn();

export const messageSRC1_A: PubSubMessage<MyMessageTypes, 'A'> = {
  type: 'A',
  paramA: 123,
  publisherId: 'SRC1',
};

export const messageSRC2_A: PubSubMessage<MyMessageTypes, 'A'> = {
  type: 'A',
  paramA: 456,
  publisherId: 'SRC2',
};

export const messageSRC2_B: PubSubMessage<MyMessageTypes, 'B'> = {
  type: 'B',
  paramB: 'ParamB_Value',
  publisherId: 'SRC2',
};

export const subscriberSUB1_A: SubScribeParams<MyMessageTypes, 'A'> = {
  type: 'A',
  ...sub1,
  handler: handlerSUB1_A,
};

export const subscriberSUB2_A: SubScribeParams<MyMessageTypes, 'A'> = {
  type: 'A',
  ...sub2,
  handler: handlerSUB2_A,
};

export const subscriberSUB2_B: SubScribeParams<MyMessageTypes, 'B'> = {
  type: 'B',
  ...sub2,
  handler: handlerSUB2_B,
};
