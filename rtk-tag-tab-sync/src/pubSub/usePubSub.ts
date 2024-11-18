import { useMemo } from 'react';
import { getPubSub } from './pubSub.js';
import type { Messages } from './types.js';

export const usePubSub = <T extends Messages>(
  params: { receive: BroadcastChannel; send: BroadcastChannel } | undefined,
) =>
  useMemo(() => {
    const pubSub = getPubSub<T>(params);
    if (!pubSub) {
      throw { error: 'No pubSubStore' };
    }
    return pubSub;
  }, [params]);
