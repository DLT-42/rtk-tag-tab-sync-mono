import 'immer'; // See: https://github.com/reduxjs/redux-toolkit/issues/1806
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { ExampleSliceState } from './types';

const initialState: ExampleSliceState = { newMessage: '' };

export const exampleSlice = createSlice({
  initialState: initialState,
  name: 'exampleSlice',
  reducerPath: 'exampleSlice',
  reducers: {
    setNewMessage: (state, action: PayloadAction<{ newMessage: string }>) => {
      const {
        payload: { newMessage },
      } = action;
      state.newMessage = newMessage;
    },
    clearTextFilter: (state) => {
      state.newMessage = '';
    },
  },
});

export const { setNewMessage } = exampleSlice.actions;

export const exampleSlice_selectNewMessage = (state: RootState) =>
  state.ui.exampleSlice.newMessage;
