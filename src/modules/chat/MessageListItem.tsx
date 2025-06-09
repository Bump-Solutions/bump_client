import { JSX } from "react";
import { MessageModel } from "../../models/chatModel";

import Image from "../../components/Image";

interface MessageListItemProps {
  message: MessageModel;
  onImageClick?: (src: string, messageId: number) => void;
}

const MAX_IMAGE_VISIBLE = 5;

/**
 * Egy üzenet megjelenítése:
 * - ha text-only, egyszerű szöveg
 * - kép esetén maximum MAX_IMAGE_VISIBLE thumbnail + "+N" overlay
 */
const MessageListItem = ({ message, onImageClick }: MessageListItemProps) => {
  let content: JSX.Element;
  let className = "message__body";

  switch (message.type) {
    case 0:
      className += " text";
      content = <div>{message.body}</div>;
      break;
    case 1:
      const atts = message.attachment.split(";;").filter(Boolean);
      const visible = atts.slice(0, MAX_IMAGE_VISIBLE);
      const remaining = atts.length - visible.length;
      className += atts.length > 1 ? " images" : " image";
      content = (
        <>
          {/* Thumbnail képek */}
          {visible.map((src, idx) => (
            <div key={idx} onClick={() => onImageClick?.(src, message.id)}>
              <Image
                src={src}
                alt={`${idx + 1}. kép`}
                placeholderColor='#212529'
              />
            </div>
          ))}

          {/* +N overlay, ha több kép van */}
          {remaining > 0 && (
            <div
              className='image more'
              onClick={() =>
                onImageClick?.(atts.slice(MAX_IMAGE_VISIBLE)[0], message.id)
              }>
              +{remaining}
            </div>
          )}
        </>
      );
      break;
    default:
      content = <></>;
  }

  return (
    <div className='message'>
      <article className={className}>{content}</article>
    </div>
  );
};

export default MessageListItem;
