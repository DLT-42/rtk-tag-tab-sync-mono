import { MessagesTag, TestInvalidationMap } from './tagInvalidation.test.types';

export const testAllInvalidationMap: TestInvalidationMap = {
  createMessage: (params, result) => {
    const { id } = result;
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

export const testIncludeInvalidationMap: TestInvalidationMap = {
  createMessage: (_, { id }) => {
    return [
      {
        recipient: {
          recipientType: 'INCLUDE',
          include: ['OTHER'],
        },
        tags: [
          { id: 'LIST', type: MessagesTag },
          { id, type: MessagesTag },
        ],
      },
    ];
  },
};

export const testExcludeInvalidationMap: TestInvalidationMap = {
  createMessage: (_, { id }) => {
    return [
      {
        recipient: {
          recipientType: 'EXCLUDE',
          exclude: ['MAIN'],
        },
        tags: [
          { id: 'LIST', type: MessagesTag },
          { id, type: MessagesTag },
        ],
      },
    ];
  },
};
