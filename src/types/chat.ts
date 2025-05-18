import { User } from "./user";

export interface IInbox {
  messages: ChatGroup[];
  next?: number;
}

export interface ChatGroup {
  id: number;
  name: string;
  user: Partial<User>;
  last_message?: Message;
  created_at: string;
}

export type MessageType = 0 | 1 | 2; // text, images, text + images

export interface MessageTypeOptions {
  hasText: boolean;
  hasImages: boolean;
  // bővíthető pl. videó, fájl stb.
}

export interface Message {
  id: number;
  author_username: User["username"];
  body: string;
  created_at?: string;
  is_read?: boolean;
  own_message?: boolean;
}

export interface MessagesPage {
  messages: Message[];
  count: number;
  next?: number;
}

export interface MessageGroup {
  author: string;
  partner: Partial<User>;
  isOwn: boolean;
  timestamp: string;
  messages: Message[];
  lastAt: Date;
}
