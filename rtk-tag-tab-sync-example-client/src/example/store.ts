import { configureStore, Middleware } from '@reduxjs/toolkit';
import { rootReducer } from './reducer';
import { exampleApi } from './api';
import { createStateSyncMiddleware } from 'redux-state-sync';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { invalidationMap } from './invalidation';
import { getInvalidateTagsMiddleware } from 'rtk-tag-tab-sync';

export const tabId = new URLSearchParams(window.location.search).get('id');

const blacklist = ['exampleApi', 'exampleSlice'];

export const invalidateTagsMiddleware: Middleware = getInvalidateTagsMiddleware(
  {
    api: exampleApi,
    invalidationMap,
    getStore: () => store,
    tabId: tabId || 'MAIN',
  },
);

export const store = configureStore({
  reducer: rootReducer,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware().concat(
      exampleApi.middleware,
      invalidateTagsMiddleware,
      createStateSyncMiddleware({
        predicate: (action) => {
          if (action.type.startsWith('exampleApi')) return false;
          for (let i = 0; i < blacklist.length; i++)
            if (action.type.startsWith(blacklist[i])) return false;
          return true;
        },
      }),
    ),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppStore = typeof store;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export const useAppSelector = useSelector.withTypes<RootState>();

export const useAppStore = useStore.withTypes<AppStore>();
