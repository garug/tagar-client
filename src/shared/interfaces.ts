interface IRoom {
  id: string;
  messages: Array<IMessage>;
  active?: boolean;
}

interface IMessage {
  body: string;
  user: string;
}

export { IRoom, IMessage };
