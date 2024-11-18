import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  ApiTagList,
  Liked,
  Message,
  MessagePayload,
  MessagesTag,
  Visibility,
} from './types';

export const exampleApi = createApi({
  reducerPath: 'exampleApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5002' }),
  tagTypes: ApiTagList,
  endpoints: (build) => ({
    createMessage: build.mutation<{ id: string }, MessagePayload>({
      query: (arg) => {
        return {
          url: `message`,
          method: 'POST',
          body: JSON.stringify(arg),
        };
      },
    }),
    deleteMessage: build.mutation<void, { id: string }>({
      query: (arg) => {
        const searchParams = new URLSearchParams(arg).toString();
        return {
          url: `messages${searchParams.length > 0 ? `?${searchParams}` : ``}`,
          method: 'DELETE',
        };
      },
    }),
    getMessages: build.query<
      Message[],
      { visibility?: Visibility; liked?: Liked }
    >({
      query: (arg) => {
        const searchParams = new URLSearchParams(arg).toString();
        return {
          url: `messages${searchParams.length > 0 ? `?${searchParams}` : ``}`,
          method: 'GET',
        };
      },
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

export const {
  useCreateMessageMutation,
  useGetMessagesQuery,
  useDeleteMessageMutation,
} = exampleApi;
