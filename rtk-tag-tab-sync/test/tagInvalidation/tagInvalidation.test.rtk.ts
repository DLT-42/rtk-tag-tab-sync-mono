import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  MessagesTag,
  RootState,
  TestInvalidationMap,
} from './tagInvalidation.test.types';
import { getInvalidateTagsMiddleware } from '../../src/tagInvalidation/tagInvalidation';
import { vi } from 'vitest';

export const baseUrl = 'http://localhost:5002';

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: [MessagesTag],
  endpoints: (build) => ({
    createMessage: build.mutation<{ id: string }, { message: string }>({
      query: (arg) => {
        return {
          url: `message`,
          method: 'POST',
          body: JSON.stringify(arg),
        };
      },
    }),
    getMessages: build.query<{ message: string; id: string }[], void>({
      query: () => ({
        url: `messages`,
        method: 'GET',
      }),
      providesTags: (result) => {
        return [
          ...(result
            ? result.map(({ id }) => ({ type: MessagesTag, id }))
            : []),
          { type: MessagesTag, id: 'LIST' },
        ];
      },
    }),
  }),
});

export const rootReducer = combineReducers({
  api: api.reducer,
});

export const setupStoreWithMocks = (
  invalidationMap: TestInvalidationMap,
  preloadedState?: Partial<RootState>,
) => {
  const sendBC = new BroadcastChannel('tag-invalidation');
  const receiveBC = new BroadcastChannel('tag-invalidation');
  const broadcastChannelSpy = {
    postMessage: vi.spyOn(sendBC, 'postMessage'),
    addEventListener: vi.spyOn(receiveBC, 'addEventListener'),
  };
  const tagInvalidationMiddleware = getInvalidateTagsMiddleware({
    api,
    invalidationMap,
    getStore: () => store,
    tabId: 'MAIN',
    send: sendBC,
    receive: receiveBC,
  });
  const store = configureStore({
    reducer: rootReducer,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    middleware: (getDefaultMiddleware: any) =>
      getDefaultMiddleware().concat(api.middleware, tagInvalidationMiddleware),
    preloadedState,
  });
  return { store, broadcastChannelSpy, tagInvalidationMiddleware, api };
};
