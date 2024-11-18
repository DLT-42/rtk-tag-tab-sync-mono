import { Mock } from 'vitest';

export type MyMessageTypes =
  | {
      type: 'A';
      paramA: number;
    }
  | {
      type: 'B';
      paramB: string;
    };

export type ListenerMock = (ev: MessageEvent) => unknown;

export type BroadcastChannelMock = Omit<
  Record<keyof BroadcastChannel, Mock>,
  'name'
> & {
  name: string;
};
