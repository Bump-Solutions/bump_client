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
  count: number;
  next: number | null;
  previous: string | null;
}

export interface MessageModel {
  id: number;
  authorUsername: string;
  body: string;
  attachment: string | null;
  type: MessageType;
  createdAt: string;
}

export type MessageType = 0 | 1 | 2; // text, images, text + images
