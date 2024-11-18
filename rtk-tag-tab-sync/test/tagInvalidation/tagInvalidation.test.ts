import { test, beforeEach, describe, vi, beforeAll, expect, it } from 'vitest';
import '@testing-library/jest-dom';
import { waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { baseUrl, setupStoreWithMocks } from './tagInvalidation.test.rtk';
import {
  testAllInvalidationMap,
  testExcludeInvalidationMap,
  testIncludeInvalidationMap,
} from './tagInvalidation.test.data';
import { Dispatch } from '@reduxjs/toolkit';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { TestInvalidationMap } from './tagInvalidation.test.types';

const server = setupServer();

beforeAll(() => {
  server.listen();
});

afterAll(() => {
  server.close();
});

beforeEach(() => {
  vi.clearAllMocks();
  server.resetHandlers(
    http.get(`${baseUrl}/messages`, () => {
      return HttpResponse.json([{ message: 'A message', id: '1' }]);
    }),
    http.post(`${baseUrl}/message`, () => {
      return HttpResponse.json({ id: '0' });
    }),
  );
});

beforeAll(async () => {
  vi.restoreAllMocks();
});

describe('Tag invalidation middleware', () => {
  const startMiddlewareTest = async (invalidationMap: TestInvalidationMap) => {
    const {
      broadcastChannelSpy: { postMessage },
      store,
      api,
    } = setupStoreWithMocks(invalidationMap, {});
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const createMessageSpy = vi.spyOn(invalidationMap, 'createMessage');
    expect(postMessage).not.toHaveBeenCalled();
    expect(createMessageSpy).not.toHaveBeenCalled();
    (store.dispatch as Dispatch<(typeof store)['dispatch']['arguments']>)(
      api.endpoints.createMessage.initiate({ message: 'A message' }),
    );
    await waitFor(() => {
      expect(postMessage).toHaveBeenCalled();
    });
    return { dispatchSpy, createMessageSpy, postMessage };
  };

  test('can be created', () => {
    const { tagInvalidationMiddleware } = setupStoreWithMocks(
      testAllInvalidationMap,
      {},
    );
    expect(tagInvalidationMiddleware).toMatchObject(expect.any(Function));
  });

  test('creation adds an event listener to the broadcast channel', () => {
    const {
      broadcastChannelSpy: { addEventListener },
    } = setupStoreWithMocks(testAllInvalidationMap, {});
    expect(addEventListener).toHaveBeenCalled();
  });

  it('processes a mutation and invalidates tags via a single call to BroadcastChannel', async () => {
    const { createMessageSpy, dispatchSpy, postMessage } =
      await startMiddlewareTest(testAllInvalidationMap);
    expect(postMessage).toHaveBeenCalledTimes(1);
    expect(createMessageSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      payload: [
        {
          id: 'LIST',
          type: 'messages',
        },
        {
          id: '0',
          type: 'messages',
        },
      ],
      type: 'api/invalidateTags',
    });
  });

  it('processes a mutation but does not invalidate tags in the current tab because it is not an included recipient', async () => {
    const { createMessageSpy, dispatchSpy, postMessage } =
      await startMiddlewareTest(testIncludeInvalidationMap);
    expect(postMessage).toHaveBeenCalledTimes(1);
    expect(createMessageSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
  });

  it('processes a mutation but does not invalidate tags in the current tab because it is an excluded recipient', async () => {
    const { createMessageSpy, dispatchSpy, postMessage } =
      await startMiddlewareTest(testExcludeInvalidationMap);
    expect(postMessage).toHaveBeenCalledTimes(1);
    expect(createMessageSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
  });
});
