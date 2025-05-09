import { ImageWithId } from "../../types/chat";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useToggle } from "../../hooks/useToggle";
import { useClickOutside } from "../../hooks/useClickOutside";

import Button from "../../components/Button";
import ImageUpload from "./ImageUpload";
import MessagesFooterImages from "./MessagesFooterImages";

import { ArrowUp, CircleAlert } from "lucide-react";

const MAX_MSG_LENGTH = 4000; // Define the maximum length for the message

const MessagesFooter = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [message, setMessage] = useState<string>("");
  const [images, setImages] = useState<ImageWithId[]>([]);
  const [isFocused, toggleFocus] = useToggle(false);

  useClickOutside({
    ref: wrapperRef,
    callback: () => toggleFocus(false),
  });

  const adjustHeight = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto"; // Reset the height to auto to get the correct scrollHeight
    ta.style.height = `${ta.scrollHeight}px`; // Set the height to the scrollHeight
  }, []);

  useLayoutEffect(adjustHeight, [adjustHeight]);

  useEffect(() => {
    if (isFocused) {
      textareaRef.current?.focus();
    }
  }, [isFocused]);

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
            placeholder='Írj üzenetet ...'
            onFocus={() => toggleFocus(true)}
            onInput={adjustHeight}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
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
            <Button className='primary' disabled={disabled}>
              <ArrowUp />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MessagesFooter;
