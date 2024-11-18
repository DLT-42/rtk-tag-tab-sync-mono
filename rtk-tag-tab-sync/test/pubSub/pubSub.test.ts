import { test, expect, beforeEach, describe, vi, beforeAll } from 'vitest';
import {
  handlerSUB1_A,
  handlerSUB2_A,
  handlerSUB2_B,
  messageSRC1_A,
  messageSRC2_A,
  messageSRC2_B,
  sub1,
  sub2,
  subscriberSUB1_A,
  subscriberSUB2_A,
  subscriberSUB2_B,
} from './pubSub.test.data.js';
import { mockBroadcastChannel } from '../shared/shared.mocks.js';
import { createPubSub } from './pubSub.test.utils.js';

beforeEach(() => {
  vi.clearAllMocks();
  mockBroadcastChannel();
});

beforeAll(async () => {
  vi.restoreAllMocks();
});

describe('PubSub', () => {
  test('A call to getPubSub returns an instance of PubSub', () => {
    const { pubSub } = createPubSub();

    expect(pubSub).toMatchObject({
      clearHandlers: expect.any(Function),
      publish: expect.any(Function),
      subscribe: expect.any(Function),
    });
  });

  test('Adds an event listener to the broadcast channel when created', () => {
    const { mockReceiveBC, mockSendBC } = createPubSub();
    expect(mockReceiveBC.addEventListener).not.toHaveBeenCalled();
    expect(mockSendBC.addEventListener).not.toHaveBeenCalled();
  });

  test('A pubsub handler is called with the correct details', () => {
    const { pubSub } = createPubSub();
    if (!pubSub) throw Error();
    pubSub.subscribe(subscriberSUB1_A);
    pubSub.publish(messageSRC1_A);
    expect(handlerSUB1_A).toBeCalledWith({
      ...messageSRC1_A,
      ...sub1,
    });
  });

  test('The correct pubsub handler is called with the correct details', () => {
    const { pubSub } = createPubSub();
    if (!pubSub) throw Error();
    pubSub.subscribe(subscriberSUB1_A);
    pubSub.subscribe(subscriberSUB2_A);

    pubSub.publish(messageSRC1_A);
    expect(handlerSUB1_A).toBeCalledWith({
      ...messageSRC1_A,
      ...sub1,
    });
    expect(handlerSUB2_B).not.toBeCalled();
  });

  test('A handler is not called after being unsubscribed', () => {
    const { pubSub } = createPubSub();
    if (!pubSub) throw Error();
    const unsubscribeSUB1_A = pubSub.subscribe(subscriberSUB1_A);

    pubSub.publish(messageSRC1_A);
    expect(handlerSUB1_A).toBeCalledWith({
      ...messageSRC1_A,
      ...sub1,
    });

    unsubscribeSUB1_A();
    handlerSUB1_A.mockReset();

    pubSub.publish(messageSRC1_A);
    expect(handlerSUB1_A).not.toBeCalled();
  });

  test('Only an unsubscribed handler is not called', () => {
    const { pubSub } = createPubSub();
    if (!pubSub) throw Error();
    const unsubscribeSUB1_A = pubSub.subscribe(subscriberSUB1_A);
    pubSub.subscribe(subscriberSUB2_A);

    pubSub.publish(messageSRC1_A);
    expect(handlerSUB1_A).toBeCalledWith({
      ...messageSRC1_A,
      ...sub1,
    });
    expect(handlerSUB2_A).toBeCalledWith({
      ...messageSRC1_A,
      ...sub2,
    });

    unsubscribeSUB1_A();
    handlerSUB1_A.mockReset();
    handlerSUB2_A.mockReset();

    pubSub.publish(messageSRC2_A);
    expect(handlerSUB1_A).not.toBeCalled();
    expect(handlerSUB2_A).toBeCalledWith({
      ...messageSRC2_A,
      ...sub2,
    });
  });

  test('Two handlers are called with the same details', () => {
    const { pubSub } = createPubSub();
    if (!pubSub) throw Error();
    pubSub.subscribe(subscriberSUB1_A);
    pubSub.subscribe(subscriberSUB2_A);

    pubSub.publish(messageSRC1_A);
    expect(handlerSUB1_A).toBeCalledWith({
      ...messageSRC1_A,
      ...sub1,
    });
    expect(handlerSUB2_A).toBeCalledWith({
      ...messageSRC1_A,
      ...sub2,
    });
  });

  test('Handlers are not called after being cleared directly', () => {
    const { pubSub } = createPubSub();
    if (!pubSub) throw Error();
    pubSub.subscribe(subscriberSUB1_A);
    pubSub.subscribe(subscriberSUB2_A);

    pubSub.publish(messageSRC1_A);
    expect(handlerSUB1_A).toBeCalledWith({
      ...messageSRC1_A,
      ...sub1,
    });
    expect(handlerSUB2_A).toBeCalledWith({
      ...messageSRC1_A,
      ...sub2,
    });

    handlerSUB1_A.mockReset();
    handlerSUB2_A.mockReset();

    pubSub.clearHandlers();
    pubSub.clearHandlers();

    pubSub.publish(messageSRC1_A);
    expect(handlerSUB1_A).not.toHaveBeenCalled();
    expect(handlerSUB2_A).not.toHaveBeenCalled();
  });

  test('Handlers only receive the details for the message they are subscribed to', () => {
    const { pubSub } = createPubSub();
    if (!pubSub) throw Error();
    pubSub.subscribe(subscriberSUB1_A);
    pubSub.subscribe(subscriberSUB2_B);

    pubSub.publish(messageSRC1_A);
    expect(handlerSUB1_A).toBeCalledWith({
      ...messageSRC1_A,
      ...sub1,
    });
    expect(handlerSUB2_B).not.toBeCalled();

    handlerSUB1_A.mockReset();
    handlerSUB2_B.mockReset();

    pubSub.publish(messageSRC2_B);
    expect(handlerSUB1_A).not.toBeCalled();
    expect(handlerSUB2_B).toBeCalledWith({
      ...messageSRC2_B,
      ...sub2,
    });
  });
});
