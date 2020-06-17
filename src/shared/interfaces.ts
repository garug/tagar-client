import { Subscription } from 'webstomp-client';

interface IRoom {
  id: string;
  messages: Array<IMessage>;
  subscription?: Subscription;
}

interface IMessage {
  body: string;
  user: string;
}

export { IRoom, IMessage };
