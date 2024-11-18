import { ChangeEvent, KeyboardEvent, MouseEvent, useCallback } from 'react';
import {
  useCreateMessageMutation,
  useDeleteMessageMutation,
  useGetMessagesQuery,
} from './example/api';
import { tabId, useAppDispatch, useAppSelector } from 'example/store';
import { exampleSlice_selectNewMessage, setNewMessage } from 'example/slice';

function App() {
  const messagesResult = useGetMessagesQuery({
    visibility: 'public',
  });
  const [createMessage] = useCreateMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();
  const appDispatch = useAppDispatch();
  const newMessage = useAppSelector(exampleSlice_selectNewMessage);

  const handleAdd = useCallback(() => {
    createMessage({ message: newMessage, visibility: 'public' });
    appDispatch(setNewMessage({ newMessage: '' }));
  }, [appDispatch, createMessage, newMessage]);

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleAdd();
      }
    },
    [handleAdd],
  );

  const handleDelete = useCallback(
    (e: MouseEvent<HTMLDivElement>) =>
      deleteMessage({ id: e.currentTarget.id }),
    [deleteMessage],
  );

  const setInputValue = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      appDispatch(setNewMessage({ newMessage: e.target.value })),
    [appDispatch],
  );

  const openWindow = useCallback(
    () =>
      window.open(
        `${window.location}?id=${windowCounter.count++}`,
        'mozillaWindow',
        'popup',
      ),
    [],
  );

  return (
    <div className="main-container">
      <div className="message-container">
        {messagesResult.data
          ? messagesResult.data.map((current) => {
              return (
                <div
                  key={current.id}
                  id={current.id}
                  className="message"
                  onClick={handleDelete}
                >
                  {current.message || '- empty -'}
                </div>
              );
            })
          : null}
      </div>
      <input
        value={newMessage}
        onChange={setInputValue}
        onKeyDown={handleEnter}
        className="field"
      />
      <button onClick={handleAdd} className="button">
        Add
      </button>
      {tabId ? null : (
        <button onClick={openWindow} className="button">
          New Window
        </button>
      )}
    </div>
  );
}

const windowCounter = { count: 0 };

export default App;
