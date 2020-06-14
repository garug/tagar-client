interface IRoom {
  id: string;
  messages: Array<IMessage>;
}

interface IMessage {
  body: string;
  user: string;
}

export { IRoom, IMessage };
