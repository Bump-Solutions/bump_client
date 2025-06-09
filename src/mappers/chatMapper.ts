import { ChatGroupDTO, LastMessageDTO, MessageDTO } from "../dtos/ChatDTO";
import {
  ChatGroupModel,
  LastMessageModel,
  MessageModel,
} from "../models/chatModel";

export function fromMessageDTO(dto: MessageDTO): MessageModel {
  return {
    id: dto.id,
    authorUsername: dto.author_username,
    body: dto.body,
    attachment: dto.attachment,
    type: dto.type,
    createdAt: dto.created_at,
  };
}

export function fromLastMessageDTO(dto: LastMessageDTO): LastMessageModel {
  return {
    ...fromMessageDTO(dto),
    isRead: dto.is_read,
    ownMessage: dto.own_message,
  };
}

export function fromChatGroupDTO(dto: ChatGroupDTO): ChatGroupModel {
  return {
    id: dto.id,
    name: dto.name,
    user: {
      id: dto.user.id,
      username: dto.user.username,
      profilePicture: dto.user.profile_picture,
    },
    lastMessage: dto.last_message ? fromLastMessageDTO(dto.last_message) : null,
    createdAt: dto.created_at,
  };
}
