// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { ElemA, ElemB } from './usePubSub.components';
import { mockBroadcastChannel } from '../shared/shared.mocks';

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  vi.clearAllMocks();
  mockBroadcastChannel();
});

beforeAll(async () => {
  vi.restoreAllMocks();
});

describe('usePubSub', () => {
  test('adds an event listener to the broadcast channel when called', () => {
    const send = new BroadcastChannel('pub-sub');
    const receive = new BroadcastChannel('pub-sub');
    render(<ElemA send={send} receive={receive} />);
    expect(receive.addEventListener).toHaveBeenCalled();
    expect(send.addEventListener).not.toHaveBeenCalled();
  });

  test('can be used to publish a message from one component to another', () => {
    const sendA = new BroadcastChannel('pub-sub');
    const receiveA = new BroadcastChannel('pub-sub');
    const sendB = new BroadcastChannel('pub-sub');
    const receiveB = new BroadcastChannel('pub-sub');

    const { getByTestId } = render(
      <>
        <ElemA send={sendA} receive={receiveA} />
        <ElemB send={sendB} receive={receiveB} />
      </>,
    );

    const buttonA = getByTestId('elemA-button');
    const labelB = getByTestId('elemB-output');

    act(() => {
      fireEvent.click(buttonA);
    });
    expect(labelB.textContent).toBe('1');
  });

  test('can be used to publish a sequence of messages between two components', () => {
    const sendA = new BroadcastChannel('pub-sub');
    const receiveA = new BroadcastChannel('pub-sub');
    const sendB = new BroadcastChannel('pub-sub');
    const receiveB = new BroadcastChannel('pub-sub');

    const { getByTestId } = render(
      <>
        <ElemA send={sendA} receive={receiveA} />
        <ElemB send={sendB} receive={receiveB} />
      </>,
    );

    const buttonA = getByTestId('elemA-button');
    const buttonB = getByTestId('elemB-button');
    const labelA = getByTestId('elemA-output');
    const labelB = getByTestId('elemB-output');

    expect(labelA.textContent).toBe('');
    expect(labelB.textContent).toBe('');

    act(() => {
      fireEvent.click(buttonA);
    });
    expect(labelA.textContent).toBe('');
    expect(labelB.textContent).toBe('1');

    act(() => {
      fireEvent.click(buttonB);
    });
    expect(labelA.textContent).toBe('2');
    expect(labelB.textContent).toBe('1');
  });
});
