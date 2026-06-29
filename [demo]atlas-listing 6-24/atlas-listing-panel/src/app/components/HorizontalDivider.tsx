import { useState, useRef, useEffect } from 'react';

interface HorizontalDividerProps {
  onDrag: (delta: number) => void;
}

export default function HorizontalDivider({ onDrag }: HorizontalDividerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const startYRef = useRef(0);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientY - startYRef.current;
      startYRef.current = e.clientY;
      onDrag(delta);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onDrag]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    startYRef.current = e.clientY;
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
  };

  return (
    <div
      className="relative shrink-0 h-[1px] bg-[#e5e8e8] cursor-row-resize w-full"
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover handle area */}
      <div className="absolute inset-x-0 -top-[3px] -bottom-[3px]" />

      {/* Visual indicator on hover/drag */}
      {(isHovered || isDragging) && (
        <div className="absolute inset-x-0 top-[-1px] h-[3px] bg-[#830051] pointer-events-none" />
      )}
    </div>
  );
}
