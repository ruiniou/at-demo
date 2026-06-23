import { useState, useRef, useEffect } from 'react';

interface DividerProps {
  onDrag: (delta: number) => void;
}

export default function Divider({ onDrag }: DividerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const startXRef = useRef(0);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - startXRef.current;
      startXRef.current = e.clientX;
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
    startXRef.current = e.clientX;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  return (
    <div
      className="relative shrink-0 w-[1px] bg-[#e5e8e8] cursor-col-resize group"
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover handle area */}
      <div className="absolute inset-y-0 -left-[3px] -right-[3px]" />

      {/* Visual indicator on hover/drag */}
      {(isHovered || isDragging) && (
        <div className="absolute inset-y-0 left-[-1px] w-[3px] bg-[#830051] pointer-events-none" />
      )}
    </div>
  );
}
