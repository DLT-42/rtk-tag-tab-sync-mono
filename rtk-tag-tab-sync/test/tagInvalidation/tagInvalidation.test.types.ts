import { RenderOptions } from '@testing-library/react';
import {
  api,
  rootReducer,
  setupStoreWithMocks,
} from './tagInvalidation.test.rtk';
import { InvalidationMap } from '../../src/tagInvalidation/types';

export const MessagesTag = 'messages' as const;

export type RootState = ReturnType<typeof rootReducer>;

export type AppStore = ReturnType<typeof setupStoreWithMocks>['store'];

export type AppDispatch = AppStore['dispatch'];

export interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
}

export type TestInvalidationMap = InvalidationMap<(typeof api)['endpoints']>;
