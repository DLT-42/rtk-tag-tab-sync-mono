// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { useEffect, useState } from 'react';
import { useCallback } from 'react';
import { usePubSub } from '../../src/pubSub/usePubSub.js';
import type { PubSub } from '../../src/pubSub/types.js';
import type { MyMessageTypes } from '../shared/shared.types.js';

export const ElemA = (
  params: { receive: BroadcastChannel; send: BroadcastChannel } | undefined,
) => {
  const pubSub = usePubSub<MyMessageTypes>(params);
  const [displayValue, setDisplayValue] = useState<(string | number)[]>([]);

  const handleClick = useCallback(() => {
    pubSub.publish({
      type: 'A',
      paramA: 1,
      publisherId: 'ElemA',
    });
  }, [pubSub]);

  useEffect(() => {
    const unsubscribe = pubSub.subscribe({
      type: 'B',
      subscriberId: 'ElemeA',
      handler: (params) => {
        const { paramB } = params;
        setDisplayValue((current) => {
          return [...current, paramB];
        });
      },
    });
    return () => {
      unsubscribe();
    };
  }, [pubSub]);

  return (
    <span data-testid="elemA">
      <button data-testid="elemA-button" onClick={handleClick}>
        Click
      </button>
      <p data-testid="elemA-output">{displayValue}</p>
    </span>
  );
};

export const ElemB = (
  params: { receive: BroadcastChannel; send: BroadcastChannel } | undefined,
) => {
  const pubSub: PubSub<MyMessageTypes> = usePubSub(params);
  const [displayValue, setDisplayValue] = useState<(string | number)[]>([]);

  const handleClick = useCallback(() => {
    pubSub.publish({
      type: 'B',
      paramB: '2',
      publisherId: 'ElemB',
    });
  }, [pubSub]);

  useEffect(() => {
    const unsubscribe = pubSub.subscribe({
      type: 'A',
      subscriberId: 'ElemeB',
      handler: (params) => {
        const { paramA } = params;
        setDisplayValue((current) => {
          return [...current, paramA];
        });
      },
    });
    return () => {
      unsubscribe();
    };
  }, [pubSub]);

  return (
    <span data-testid="elemB">
      <button data-testid="elemB-button" onClick={handleClick}>
        Click
      </button>
      <p data-testid="elemB-output">{displayValue}</p>
    </span>
  );
};
