import React, { useEffect } from "react";
import { createPortal } from "react-dom";

export interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title?: string;
}

export function ImagePreviewModal({
  isOpen,
  onClose,
  imageUrl,
  title,
}: ImagePreviewModalProps) {
  // ESC key to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center p-[24px] animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-label={title || "Image Preview"}
    >
      {/* Modal Backdrop with 50% opacity */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      {/* Top action bar with contrast gradient */}
      <div className="absolute top-0 inset-x-0 h-[64px] px-[24px] bg-gradient-to-b from-black/50 via-black/20 to-transparent flex items-center justify-between z-10 pointer-events-none">
        <span className="text-[14px] font-medium tracking-wide text-white drop-shadow truncate max-w-[80vw] select-none">
          {title || "Image Preview"}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="pointer-events-auto size-[36px] rounded-full bg-white/20 hover:bg-white/35 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer select-none ml-auto shadow-sm"
          aria-label="Close preview"
          title="Close (Esc)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 10.586L16.95 5.636L18.364 7.05L13.414 12L18.364 16.95L16.95 18.364L12 13.414L7.05 18.364L5.636 16.95L10.586 12L5.636 7.05L7.05 5.636L12 10.586Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>

      {/* Main Image Container */}
      <div
        className="relative max-w-[92vw] max-h-[86vh] flex items-center justify-center select-none"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={title || "Full size preview"}
          className="max-w-[92vw] max-h-[86vh] object-contain rounded-[6px] shadow-2xl block"
        />
      </div>
    </div>,
    document.body
  );
}

export default ImagePreviewModal;
