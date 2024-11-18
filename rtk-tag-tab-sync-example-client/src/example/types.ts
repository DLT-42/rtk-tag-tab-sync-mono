export const MessagesTag = 'Messages' as const;

export const ApiTagList = [MessagesTag];

export type Visibility = 'public' | 'private';

export type Liked = 'true' | 'false';

export type Message = {
  id: string;
  message: string;
  liked: boolean;
  visibility: Visibility;
};

export type MessagePayload = {
  message: string;
  visibility: Visibility;
};

export type ExampleSliceState = {
  newMessage: string;
};
