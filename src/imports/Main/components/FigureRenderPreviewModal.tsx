import React, { useState, useRef, useEffect } from 'react';
import closeIconUrl from '../../../icons/close-line.svg';
import eyeLineIconUrl from '../../../icons/eye-line.svg';

export type RenderVersion = {
  versionLabel: string;
  imageUrl: string;
  createdAt: Date;
};

interface FigureRenderPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  versions: RenderVersion[];
  activeVersionLabel: string;
  onSelectVersion: (version: RenderVersion) => void;
  panelLayout?: 'horizontal' | 'vertical';
  panelView?: 'shell' | 'code' | 'both';
  copilotOpen?: boolean;
  copilotWidth?: number;
}

export function FigureRenderPreviewModal({
  isOpen,
  onClose,
  versions = [],
  activeVersionLabel,
  onSelectVersion,
  panelLayout = 'horizontal',
  panelView = 'shell',
  copilotOpen = true,
  copilotWidth = 360,
}: FigureRenderPreviewModalProps) {
  if (!isOpen) return null;

  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [size, setSize] = useState({ width: 540, height: 410 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [imgLoadError, setImgLoadError] = useState(false);

  const dragStartRef = useRef<{ mouseX: number; mouseY: number; posX: number; posY: number }>({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 });
  const resizeStartRef = useRef<{ mouseX: number; mouseY: number; startW: number; startH: number }>({ mouseX: 0, mouseY: 0, startW: 0, startH: 0 });

  const activeVersion = versions.find(v => v.versionLabel === activeVersionLabel) || versions[versions.length - 1] || null;
  const latestVersion = versions[versions.length - 1] || null;

  // Reset image error state when active version changes
  useEffect(() => {
    setImgLoadError(false);
  }, [activeVersionLabel]);

  // Initial position calculation: Anchored to the rightmost edge (over AI Copilot area) to avoid covering Shell Preview on the left
  useEffect(() => {
    if (position === null) {
      const windowW = window.innerWidth;
      const windowH = window.innerHeight;
      
      // Position anchored to the right edge with 16px margin (landing over Copilot on the right)
      let targetX = windowW - size.width - 16;
      let targetY = 96;

      // Anti-collision boundaries: ensure it stays within visible screen area
      const minX = 16;
      const maxX = Math.max(minX, windowW - size.width - 16);
      const minY = 60;
      const maxY = Math.max(minY, windowH - size.height - 16);

      const safeX = Math.min(Math.max(targetX, minX), maxX);
      const safeY = Math.min(Math.max(targetY, minY), maxY);

      setPosition({ x: safeX, y: safeY });
    }
  }, []);

  // Dragging logic
  const handleMouseDownHeader = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    const currentX = position?.x ?? 200;
    const currentY = position?.y ?? 100;
    dragStartRef.current = { mouseX: e.clientX, mouseY: e.clientY, posX: currentX, posY: currentY };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - dragStartRef.current.mouseX;
        const dy = e.clientY - dragStartRef.current.mouseY;
        const newX = Math.max(10, Math.min(window.innerWidth - size.width - 10, dragStartRef.current.posX + dx));
        const newY = Math.max(10, Math.min(window.innerHeight - size.height - 10, dragStartRef.current.posY + dy));
        setPosition({ x: newX, y: newY });
      } else if (isResizing) {
        const dx = e.clientX - resizeStartRef.current.mouseX;
        const dy = e.clientY - resizeStartRef.current.mouseY;
        const newW = Math.max(420, resizeStartRef.current.startW + dx);
        const newH = Math.max(320, resizeStartRef.current.startH + dy);
        setSize({ width: newW, height: newH });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, size.width, size.height]);

  const handleMouseDownResize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    resizeStartRef.current = { mouseX: e.clientX, mouseY: e.clientY, startW: size.width, startH: size.height };
  };

  const getBadgeLabel = (version: RenderVersion) => {
    return version.versionLabel === latestVersion?.versionLabel ? 'Latest' : version.versionLabel;
  };

  const sortedVersions = [...versions].reverse();
  const showCarousel = versions.length > 1;

  return (
    <div
      className="fixed z-50 flex flex-col bg-white rounded-[8px] border border-[#D8DADA] shadow-[0px_8px_24px_rgba(0,0,0,0.12),0px_2px_6px_rgba(0,0,0,0.06)] overflow-hidden select-none"
      style={{
        left: `${position?.x ?? 200}px`,
        top: `${position?.y ?? 100}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
      }}
    >
      {/* Window Header */}
      <div
        onMouseDown={handleMouseDownHeader}
        className="flex items-center justify-between px-[12px] h-[36px] bg-[#FAFBFB] border-b border-[#EBECEC] cursor-move shrink-0"
      >
        <div className="flex items-center gap-[8px]">
          <span className="text-[13px] font-medium text-text-primary" style={{ fontFamily: 'Inter, sans-serif' }}>
            {activeVersion?.versionLabel || 'V1.0'}
          </span>
          {activeVersion?.versionLabel === latestVersion?.versionLabel && (
            <div className="border border-[#EBECEC] rounded-[4px] h-[18px] px-[4px] flex items-center justify-center bg-white">
              <span className="text-[11px] font-normal text-text-secondary leading-none" style={{ fontFamily: 'Inter, sans-serif' }}>
                Latest
              </span>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-[20px] h-[20px] flex items-center justify-center rounded-[4px] hover:bg-black/5 active:scale-[0.96] transition-colors"
          aria-label="Close preview"
        >
          <img src={closeIconUrl} alt="close" className="w-[14px] h-[14px]" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 min-h-0 min-w-0 bg-white overflow-hidden relative">
        {/* Left: Large Image View */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0 p-[12px] bg-[#F8F9F9] relative">
          <div className="flex-1 flex items-center justify-center min-h-0 min-w-0 overflow-hidden relative rounded-[4px] bg-white border border-[#EBECEC] p-[8px]">
            {imgLoadError ? (
              <div className="flex flex-col items-center justify-center gap-[8px] text-center">
                <span className="text-[13px] text-[#E53935] font-medium">Image load failed</span>
                <button
                  onClick={() => setImgLoadError(false)}
                  className="text-[12px] text-brand-1 hover:underline font-medium"
                >
                  Retry
                </button>
              </div>
            ) : (
              <img
                src={activeVersion?.imageUrl}
                alt={activeVersion?.versionLabel}
                onError={() => setImgLoadError(true)}
                className="max-w-full max-h-full object-contain pointer-events-none"
              />
            )}
          </div>

          {/* Footer Disclaimer Text */}
          <div className="mt-[8px] shrink-0 text-center">
            <p className="text-[10px] leading-[14px] text-[#888E8E] whitespace-nowrap overflow-hidden text-ellipsis font-normal">
              Preview may differ from the final code execution results
            </p>
          </div>
        </div>

        {/* Right: Version Carousel (Only when > 1 version) */}
        {showCarousel && (
          <div className="w-[130px] shrink-0 border-l border-[#EBECEC] bg-white flex flex-col p-[8px] gap-[8px] overflow-y-auto">
            {sortedVersions.map((v) => {
              const isSelected = v.versionLabel === activeVersion?.versionLabel;
              const isLatest = v.versionLabel === latestVersion?.versionLabel;
              return (
                <div
                  key={v.versionLabel}
                  onClick={() => onSelectVersion(v)}
                  className={`flex flex-col rounded-[4px] overflow-hidden border cursor-pointer transition-all ${
                    isSelected ? 'border-[1.5px] border-[#830051] bg-[#FAFBFB]' : 'border-[#EBECEC] hover:border-[#888E8E] bg-white'
                  }`}
                >
                  <div className="h-[76px] w-full relative bg-[#F8F9F9] overflow-hidden border-b border-[#EBECEC] group">
                    <img src={v.imageUrl} alt={v.versionLabel} className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.03]" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-[4px] right-[4px] w-[20px] h-[20px] rounded-[4px] bg-black/60 flex items-center justify-center">
                        <img src={eyeLineIconUrl} alt="eye" className="w-[12px] h-[12px] [filter:brightness(0)_invert(1)]" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-[6px] py-[4px]">
                    <span className="text-[11px] font-medium text-text-primary">{v.versionLabel}</span>
                    {isLatest && (
                      <span className="text-[10px] font-medium text-brand-1 bg-[#830051]/10 px-[3px] py-px rounded-[2px]">
                        Latest
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Right Resize Handle */}
        <div
          onMouseDown={handleMouseDownResize}
          className="absolute bottom-0 right-0 w-[12px] h-[12px] cursor-se-resize flex items-center justify-center z-10"
        >
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 1L1 7M7 4.5L4.5 7" stroke="#888E8E" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}
