import { isFulfilled } from '@reduxjs/toolkit';
import type {
  GetInvalidateTagsMiddleware,
  InvalidateTagsMessage,
} from './types.js';
import { getInvalidationDetails } from './utils.js';

export const getInvalidateTagsMiddleware: GetInvalidateTagsMiddleware = ({
  api,
  invalidationMap,
  getStore,
  tabId,
  send,
  receive,
}) => {
  const sendChannel = send || new BroadcastChannel('tag-invalidation');
  const receiveChannel = receive || new BroadcastChannel('tag-invalidation');
  window.addEventListener('beforeunload', () => {
    if (!send) sendChannel.close();
    if (!receive) receiveChannel.close();
  });

  receiveChannel.addEventListener('message', (event) => {
    if ('type' in event.data && event.data['type'] === 'INVALIDATE_TAGS') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const invalidateTagsMessage = event.data as InvalidateTagsMessage<any>;
      const subscriberId = tabId;
      const { recipientType, tags } = invalidateTagsMessage;

      if (recipientType === 'ALL') {
        getStore().dispatch(api.util.invalidateTags(tags));
        return;
      }

      if (recipientType === 'EXCLUDE') {
        const { exclude } = invalidateTagsMessage;
        if (!exclude.includes(subscriberId)) {
          getStore().dispatch(api.util.invalidateTags(tags));
          return;
        }
      }

      if (recipientType === 'INCLUDE') {
        const { include } = invalidateTagsMessage;
        if (include.includes(subscriberId)) {
          getStore().dispatch(api.util.invalidateTags(tags));
        }
      }
    }
  });

  return () => (next) => (unknownAction) => {
    if (isFulfilled(unknownAction)) {
      Object.keys(invalidationMap).forEach((key) => {
        if (
          api.endpoints[key] &&
          api.endpoints[key].matchFulfilled(unknownAction)
        ) {
          const arg = unknownAction.meta.arg;
          if (!arg || typeof arg !== 'object' || !('originalArgs' in arg)) {
            return;
          }

          const params = arg.originalArgs;
          if (!params || typeof params !== 'object') {
            return;
          }

          const { payload: result } = unknownAction;

          const invalidationDetails = getInvalidationDetails(
            invalidationMap,
            key,
            params,
            result,
          );
          if (!invalidationDetails) {
            return;
          }

          invalidationDetails.forEach((current) => {
            const { tags, recipient } = current;
            sendChannel.postMessage({
              type: 'INVALIDATE_TAGS',
              ...recipient,
              publisherId: tabId,
              tags,
            });
          });
        }
      });
    }

    return next(unknownAction);
  };
};
