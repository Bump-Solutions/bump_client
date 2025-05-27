import "../assets/css/image.css";
import { API } from "../utils/api";
import { ImgHTMLAttributes, useState, MouseEvent } from "react";

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderColor?: string;
  className?: string;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
}

// const PLACEHOLDER_COLOR = "#e0e0e0";
const PLACEHOLDER_COLOR = "#212529";

const Image = ({
  src,
  alt,
  placeholderColor = PLACEHOLDER_COLOR,
  className = "",
  onClick,
  ...props
}: ImageProps) => {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    "loading"
  );

  // Ha teljesen sikeres a kép, akkor legyen átlátszó; egyébként (loading vagy error) placeholder-szín
  const bgColor = status === "loaded" ? "transparent" : placeholderColor;

  return (
    <div
      className={`image ${className}`}
      style={{ backgroundColor: bgColor }}
      onClick={onClick}>
      {status === "loading" && <div className='image__placeholder' />}

      <img
        src={API.MEDIA_URL + src}
        alt={alt}
        loading='lazy'
        className={`${status}`}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
        {...props}
      />
    </div>
  );
};

export default Image;
