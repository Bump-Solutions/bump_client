import { MessageType } from "../models/chatModel";

export interface InboxDTO {
  messages: ChatGroupDTO[];
  next: number | null;
  previous: string | null;
  count: number;
}

export interface ChatGroupDTO {
  id: number;
  name: string;
  user: {
    id: number;
    username: string;
    profile_picture: string | null;
  };
  last_message: LastMessageDTO | null;
  created_at: string;
}

export interface MessagesPageDTO {
  messages: MessageDTO[];
  next: number | null;
  previous: string | null;
  count: number;
}

export interface MessageDTO {
  id: number;
  author_username: string;
  body: string;
  attachment: string;
  type: MessageType;
  created_at: string;
}

export interface LastMessageDTO extends MessageDTO {
  is_read: boolean;
  own_message: boolean;
}
