import "../assets/css/image.css";
import { ImgHTMLAttributes, useState } from "react";

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderColor?: string;
  className?: string;
}

const Image = ({
  src,
  alt,
  placeholderColor = "#e0e0e0",
  className,
  ...props
}: ImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className='image' style={{ backgroundColor: placeholderColor }}>
      {!isLoaded && <div className='image__placeholder' />}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoaded ? "loaded" : ""}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsLoaded(true)} // Optional: Add fallback error handling
        {...props}
      />
    </div>
  );
};

export default Image;
