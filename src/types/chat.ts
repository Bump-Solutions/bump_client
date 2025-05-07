import { User } from "./user";

export interface IInbox {
  messages: ChatGroup[];
  next?: number;
}

export interface ChatGroup {
  id: number;
  name: string;
  user: Partial<User>;
  last_message: Message;
  created_at: string;
}

export interface Message {
  id: number;
  name: string;
  author_username: User["username"];
  body: string;
  created_at: string;
  is_read: boolean;
  own_message: boolean;
}
