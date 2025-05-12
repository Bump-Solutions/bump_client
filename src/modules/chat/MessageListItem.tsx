import { Message } from "../../types/chat";

interface MessageProps {
  message: Message;
}

const MessageListItem = ({ message }: MessageProps) => {
  return (
    <div className='message'>
      <article className='message__body'>
        <div>{message.body}</div>
      </article>
    </div>
  );
};

export default MessageListItem;
