interface IRoom {
  id: string;
  messages: Array<IMessage>;
  userTyping?: string;
  active: boolean;
}

interface IMessage {
  body: string;
  user: string;
}

interface IChatStore {
  rooms: Array<IRoom>;
  waitingRoom: boolean;
  user: string;
  newRoom(): void;
  exitRoom(room: IRoom): void;
  sendChatMessage(room: IRoom, message: string): void;
  sendChatTyping(room:IRoom): void;
}

export { IRoom, IMessage, IChatStore };
