import { InvalidationMap } from 'rtk-tag-tab-sync';
import { exampleApi } from './api';
import { MessagesTag } from './types';

export const invalidationMap: InvalidationMap<typeof exampleApi.endpoints> = {
  createMessage: (_, { id }) => {
    return [
      {
        recipient: {
          recipientType: 'ALL',
        },
        tags: [
          { id: 'LIST', type: MessagesTag },
          { id, type: MessagesTag },
        ],
      },
    ];
  },
  deleteMessage: ({ id }) => {
    return [
      {
        recipient: {
          recipientType: 'ALL',
        },
        tags: [
          { id: 'LIST', type: MessagesTag },
          { id, type: MessagesTag },
        ],
      },
    ];
  },
};
