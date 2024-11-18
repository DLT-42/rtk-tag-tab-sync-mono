import { combineReducers } from '@reduxjs/toolkit';
import { exampleApi } from './api';
import { withReduxStateSync } from 'redux-state-sync';
import { exampleSlice } from './slice';

const combinedReducers = combineReducers({
  ui: combineReducers({
    [exampleSlice.reducerPath]: exampleSlice.reducer,
  }),
  [exampleApi.reducerPath]: exampleApi.reducer,
});

export const rootReducer = withReduxStateSync(combinedReducers);
