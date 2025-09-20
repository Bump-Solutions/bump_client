import { MessageType, MessageTypeOptions } from "../../models/chatModel";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  KeyboardEvent,
} from "react";
import { useToggle } from "../../hooks/useToggle";
import { toast } from "sonner";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useUploadChatImages } from "../../hooks/chat/useUploadChatImages";
import { FileUpload } from "../../types/form";

import Button from "../../components/Button";
import ImageUpload from "./ImageUpload";
import MessagesFooterImages from "./MessagesFooterImages";

import { ArrowUp, CircleAlert } from "lucide-react";

interface MessagesFooterProps {
  chat: string;
  onSend: (data: any) => void;
}

const MAX_MSG_LENGTH = 4000; // Define the maximum length for the message

const getMessageType = ({
  hasText,
  hasImages,
}: MessageTypeOptions): MessageType => {
  if (hasText && hasImages) {
    return 2; // text + images
  } else if (hasImages) {
    return 1; // images
  } else if (hasText) {
    return 0; // text
  }
  return 0;
};

const MessagesFooter = ({ chat, onSend }: MessagesFooterProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [message, setMessage] = useState<string>("");
  const [images, setImages] = useState<FileUpload[]>([]);
  const [isFocused, toggleFocus] = useToggle(false);
  const [isLoading, toggleLoading] = useToggle(false);

  useClickOutside({
    ref: wrapperRef,
    callback: () => toggleFocus(false),
  });

  useEffect(() => {
    if (isFocused) {
      textareaRef.current?.focus();
    }
  }, [isFocused]);

  const uploadChatImagesMutation = useUploadChatImages();

  const handleSend = async () => {
    if (isLoading) return; // Prevent sending if already loading

    toggleLoading(true);

    const text = message.trim();
    const hasText = text.length > 0;
    const hasImages = images.length > 0;

    if (!hasText && !hasImages) return;

    let imageUrls: string = "";

    try {
      if (hasImages) {
        const { data } = await uploadChatImagesMutation.mutateAsync({
          chat: chat,
          images: images,
        });
        imageUrls = data.images
          .map((img: { id: number; image_url: string }) => img.image_url)
          .join(";;");
      }
    } catch (error) {
      toast.error("Hiba történt a képek feltöltése során.");
      return;
    }

    const type = getMessageType({ hasText, hasImages });

    const payload = {
      message: text,
      attachment: imageUrls,
      type,
    };

    onSend(payload);
    setMessage("");
    setImages([]);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset the height to auto
    }

    toggleLoading(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const adjustHeight = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto"; // Reset the height to auto to get the correct scrollHeight
    ta.style.height = `${ta.scrollHeight}px`; // Set the height to the scrollHeight
  }, []);

  useLayoutEffect(adjustHeight, [adjustHeight]);

  const remainingChars = MAX_MSG_LENGTH - message.length;
  const showCounter = remainingChars <= 50;
  const isOverLimit = remainingChars < 0;

  const disabled =
    (message.trim().length === 0 && images.length === 0) || isOverLimit;

  return (
    <footer className='messages__footer'>
      <div
        ref={wrapperRef}
        className={`chat__message__input__wrapper ${
          isFocused ? "focused" : ""
        }`}
        onClick={() => toggleFocus(true)}>
        <div className='chat__message__input'>
          <textarea
            ref={textareaRef}
            placeholder='Írj üzenetet...'
            onFocus={() => toggleFocus(true)}
            onInput={adjustHeight}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            tabIndex={0}
          />
        </div>

        {showCounter && (
          <div className={`max-length${isOverLimit ? " over-limit" : ""}`}>
            <div>
              {isOverLimit && (
                <>
                  <CircleAlert className='svg-20' />
                  Maximális karakterszám
                </>
              )}
            </div>
            <div className='fw-700'>
              {message.length} / {MAX_MSG_LENGTH}
            </div>
          </div>
        )}

        {images.length > 0 && (
          <MessagesFooterImages images={images} setImages={setImages} />
        )}

        <div className='chat__message__actions'>
          <ImageUpload setImages={setImages} />

          <div className='btn__send'>
            <Button
              className='primary'
              onClick={handleSend}
              disabled={disabled || isLoading}
              loading={isLoading}>
              <ArrowUp />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MessagesFooter;
