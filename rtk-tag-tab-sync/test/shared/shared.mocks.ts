import { vi } from 'vitest';
import { ListenerMock } from './shared.types';

const listeners: ListenerMock[] = [];

export const mockBroadcastChannel = () => {
  vi.stubGlobal(
    'BroadcastChannel',
    vi.fn((name: string) => {
      const channel = {
        name,
        postMessage: vi.fn(),
        dispatchEvent: vi.fn(),
        onmessage: vi.fn(),
        onmessageerror: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        close: vi.fn(),
      };

      channel.addEventListener.mockImplementation(
        (_: 'message', listener: ListenerMock) => {
          listeners.push(listener);
          return () => {
            const index = listeners.indexOf(listener);
            if (index > -1) listeners.splice(index, 1);
          };
        },
      );

      channel.postMessage.mockImplementation((message) =>
        listeners.forEach((listener) =>
          listener(new MessageEvent('message', { data: message })),
        ),
      );

      return channel;
    }),
  );
};
