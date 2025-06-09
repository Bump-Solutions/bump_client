import { UserModel } from "./userModel";

// Defines the paginated message group list
export interface InboxModel {
  messages: ChatGroupModel[];
  next: number | null;
  previous: string | null;
  count: number;
}

export interface ChatGroupModel {
  id: number;
  name: string;
  user: {
    id: number;
    username: string;
    profilePicture: string | null;
  };
  lastMessage: LastMessageModel | null;
  createdAt: string;
}

export interface LastMessageModel extends MessageModel {
  isRead: boolean;
  ownMessage: boolean;
}

export interface MessagesPageModel {
  messages: MessageModel[];
  next: number | null;
  previous: string | null;
  count: number;
}

export interface MessageModel {
  id: number;
  authorUsername: string;
  body: string;
  attachment: string;
  type: MessageType;
  createdAt: string;
}

export type MessageType = 0 | 1 | 2; // text, images, text + images

export interface MessageTypeOptions {
  hasText: boolean;
  hasImages: boolean;
  // bővíthető pl. videó, fájl stb.
}

export interface MessageGroupModel {
  author: string;
  partner: Partial<UserModel> | null;
  isOwn: boolean;
  timestamp: string;
  messages: MessageModel[];
  lastAt: Date;
  attachmentsCount?: number;
}
