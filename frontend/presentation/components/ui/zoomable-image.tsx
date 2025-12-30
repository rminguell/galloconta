"use client";

import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

interface ZoomableImageProps {
  src: string;
  alt?: string;
  className?: string;
}

export default function ZoomableImage({
  src,
  alt,
  className,
}: ZoomableImageProps) {
  return (
    <div className="w-full h-full">
      <Zoom>
        <img
          alt={alt || "Zoomable image"}
          src={src}
          className={`w-full h-full object-cover cursor-zoom-in rounded-lg shadow-lg ${className || ""}`}
        />
      </Zoom>
    </div>
  );
}
