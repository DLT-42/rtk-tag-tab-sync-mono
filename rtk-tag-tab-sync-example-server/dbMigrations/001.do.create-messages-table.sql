CREATE TABLE messages (
  id UUID NOT NULL,
  message VARCHAR,
  liked BOOLEAN NOT NULL,
  visibility VARCHAR NOT NULL
);