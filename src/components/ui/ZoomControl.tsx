import React, { useState, useRef, useEffect } from 'react';
import addLineIconUrl from '../../icons/add-line.svg';
import subtractLineIconUrl from '../../icons/subtract-line.svg';
import checkLineIconUrl from '../../icons/check-line.svg';

export interface ZoomOption {
  label: string;
  value: string;
}

export interface ZoomControlProps {
  options?: ZoomOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

const DEFAULT_ZOOM_OPTIONS: ZoomOption[] = [
  { label: '75%', value: '75' },
  { label: '100%', value: '100' },
  { label: '150%', value: '150' },
  { label: '200%', value: '200' },
];

/**
 * Shell Preview 缩放复合控件 (ZoomControl)
 * - 缩小按钮 [-]：采用本地 subtract-line.svg 图标
 * - 百分比按钮：默认态为无填充 (No fill)，Hover 态才呈现浅灰底色；点击展开下拉选项菜单
 * - 放大按钮 [+]：采用本地 add-line.svg 图标
 */
export function ZoomControl({
  options = DEFAULT_ZOOM_OPTIONS,
  value,
  onChange,
  className = '',
  disabled = false,
}: ZoomControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const currentIndex = options.findIndex((opt) => opt.value === value);
  const currentOption = currentIndex >= 0 ? options[currentIndex] : options.find((o) => o.value === '100') || options[0];
  const displayLabel = currentOption ? currentOption.label : `${value}%`;

  const canZoomOut = !disabled && currentIndex > 0;
  const canZoomIn = !disabled && currentIndex >= 0 && currentIndex < options.length - 1;

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (canZoomOut) {
      onChange(options[currentIndex - 1].value);
    }
  };

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (canZoomIn) {
      onChange(options[currentIndex + 1].value);
    }
  };

  const handleToggleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center h-[26px] rounded-[6px] border border-graphite-15 bg-white p-[2px] shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] select-none ${className}`}
    >
      {/* 缩小按钮 (-)：使用本地 subtract-line.svg */}
      <button
        type="button"
        disabled={!canZoomOut}
        onClick={handleZoomOut}
        title="Zoom out"
        aria-label="Zoom out"
        className={`flex h-[20px] w-[20px] items-center justify-center rounded-[4px] transition-colors duration-150 ${
          canZoomOut
            ? 'hover:bg-black/5 active:scale-95 cursor-pointer opacity-75 hover:opacity-100'
            : 'cursor-not-allowed opacity-25'
        }`}
      >
        <img
          src={subtractLineIconUrl}
          alt=""
          className="h-[16px] w-[16px] shrink-0 select-none pointer-events-none"
          aria-hidden="true"
        />
      </button>

      {/* 中间百分比按钮 (默认态无填充 No fill，Hover态呈现浅灰底色，点击展开下拉菜单) */}
      <button
        type="button"
        disabled={disabled}
        onClick={handleToggleOpen}
        title="Select zoom level"
        aria-label="Select zoom level"
        aria-expanded={isOpen}
        className={`flex h-[20px] min-w-[46px] items-center justify-center px-[8px] mx-[2px] rounded-[4px] bg-transparent hover:bg-graphite-10/80 active:bg-graphite-15 transition-all duration-150 cursor-pointer ${
          isOpen ? 'bg-graphite-10 ring-1 ring-brand-1/40' : ''
        }`}
      >
        <span
          className="text-[12px] font-normal leading-[16px] text-text-primary text-center whitespace-nowrap"
          style={{ fontFamily: "'PingFang SC', sans-serif" }}
        >
          {displayLabel}
        </span>
      </button>

      {/* 放大按钮 (+)：使用本地 add-line.svg */}
      <button
        type="button"
        disabled={!canZoomIn}
        onClick={handleZoomIn}
        title="Zoom in"
        aria-label="Zoom in"
        className={`flex h-[20px] w-[20px] items-center justify-center rounded-[4px] transition-colors duration-150 ${
          canZoomIn
            ? 'hover:bg-black/5 active:scale-95 cursor-pointer opacity-75 hover:opacity-100'
            : 'cursor-not-allowed opacity-25'
        }`}
      >
        <img
          src={addLineIconUrl}
          alt=""
          className="h-[16px] w-[16px] shrink-0 select-none pointer-events-none"
          aria-hidden="true"
        />
      </button>

      {/* 展开的下拉选项列表 */}
      {isOpen && !disabled && (
        <div className="absolute left-1/2 -translate-x-1/2 top-[100%] z-[100] mt-[4px] min-w-[88px] flex flex-col gap-[2px] rounded-md border border-form-border bg-white p-[4px] shadow-[0px_2px_8px_rgba(0,0,0,0.12)] animate-in fade-in zoom-in-95 duration-100">
          <div className="flex flex-col gap-[2px]">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`flex h-[28px] w-full items-center justify-between px-[8px] rounded-[calc(var(--radius-xs)*2)] text-left text-[12px] transition-colors duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-az-secondary text-brand-1 font-medium'
                      : 'text-text-primary hover:bg-black/5'
                  }`}
                  style={{ fontFamily: "'PingFang SC', sans-serif" }}
                >
                  <span>{opt.label}</span>
                  {isSelected && (
                    <img
                      src={checkLineIconUrl}
                      alt=""
                      className="h-[14px] w-[14px] shrink-0"
                      style={{
                        filter:
                          'brightness(0) saturate(100%) invert(13%) sepia(85%) saturate(2902%) hue-rotate(309deg) brightness(77%) contrast(111%)',
                      }}
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
