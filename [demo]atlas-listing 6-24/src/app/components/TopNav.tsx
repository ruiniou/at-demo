import { useState, useRef } from 'react';
import { Info, Table, FolderOpen } from 'lucide-react';

interface TopNavProps {
  currentEvent: string;
  events: string[];
  onEventChange: (event: string) => void;
  treeListOpen?: boolean;
  currentFileName?: string;
}

export default function TopNav({ currentEvent, events, onEventChange, treeListOpen = true, currentFileName = '' }: TopNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoverTimer, setHoverTimer] = useState<NodeJS.Timeout | null>(null);
  const [activeView, setActiveView] = useState<'table' | 'group'>('table');
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = () => {
    const timer = setTimeout(() => {
      setIsMenuOpen(true);
    }, 80);
    setHoverTimer(timer);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      setHoverTimer(null);
    }

    // Check if mouse is moving towards the menu (safe hover zone)
    const menuEl = menuRef.current;
    if (menuEl && isMenuOpen) {
      const menuRect = menuEl.getBoundingClientRect();
      const mouseY = e.clientY;
      const mouseX = e.clientX;

      // If mouse is within safe zone (menu area), don't close
      if (
        mouseY >= menuRect.top - 10 &&
        mouseY <= menuRect.bottom + 10 &&
        mouseX >= menuRect.left - 10 &&
        mouseX <= menuRect.right + 10
      ) {
        return;
      }
    }

    setIsMenuOpen(false);
  };

  const handleMenuMouseLeave = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="h-[40px] w-full bg-white border-b border-[#d8dada] relative z-10">
      <div className="flex items-center justify-between px-[12px] h-full">
        {/* Left: Breadcrumb */}
        <div className="flex items-center gap-[8px]">
          {/* Status Icon */}
          <div className="size-[16px]">
            <svg className="size-full" fill="none" viewBox="0 0 13.333 13.333">
              <circle cx="6.667" cy="6.667" r="6.167" stroke="#888E8E" strokeWidth="1" fill="none" />
            </svg>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-[2px]">
            <button className="px-[2px] py-[4px] rounded-[4px] hover:bg-[#f8f7f7] transition-colors active:scale-[0.96] transition-transform">
              <p className="font-['PingFang_SC:Medium',sans-serif] text-[12px] leading-[20px] text-[#3c4242]">
                AZE2001-301
              </p>
            </button>

            <p className="font-['PingFang_SC:Medium',sans-serif] text-[12px] leading-[20px] text-[#888e8e]">/</p>

            {/* Event Dropdown */}
            <div className="relative flex items-center gap-[2px]">
              <button
                ref={buttonRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="px-[6px] py-[4px] rounded-[4px] hover:bg-[#f8f7f7] transition-colors active:scale-[0.96] transition-transform"
              >
                <p className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] text-[#3c4242]">
                  {currentEvent}
                </p>
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div
                  ref={menuRef}
                  onMouseLeave={handleMenuMouseLeave}
                  className="absolute left-0 top-[30px] w-[176px] bg-white rounded-[8px] border border-[#ebecec] shadow-[0px_2px_4px_rgba(0,0,0,0.08)] py-[6px]"
                >
                  {/* Menu Header */}
                  <div className="px-[8px] py-[4px]">
                    <p className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] text-[#888e8e]">
                      Other Events in Study
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="flex flex-col">
                    {events.map((event, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          onEventChange(event);
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center px-[8px] h-[28px] hover:bg-[#f8f7f7] transition-colors active:scale-[0.96] transition-transform"
                      >
                        <p className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] text-[#3c4242] flex-1 text-left overflow-hidden text-ellipsis whitespace-nowrap">
                          {event}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Current File Name (when tree list is closed) */}
              {!treeListOpen && currentFileName && (
                <>
                  <p className="font-['PingFang_SC:Medium',sans-serif] text-[12px] leading-[20px] text-[#888e8e]">/</p>
                  <p className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] text-[#3c4242] px-[2px]">
                    {currentFileName}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Info Button */}
          <button className="size-[24px] flex items-center justify-center rounded-[4px] hover:bg-black/5 transition-colors active:scale-[0.96] transition-transform">
            <Info className="size-4 text-[#888E8E]" />
          </button>
        </div>

        {/* Center: View Toggle */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center h-full">
          <div className="flex items-center h-full">
            <button
              onClick={() => setActiveView('table')}
              className={`flex items-center gap-[4px] px-[16px] py-[8px] h-full border-b-2 transition-colors active:scale-[0.96] transition-transform ${
                activeView === 'table'
                  ? 'border-[#830051]'
                  : 'border-transparent'
              }`}
            >
              <Table className={`size-4 ${activeView === 'table' ? 'text-[#830051]' : 'text-[#3C4242]'}`} />
              <p className={`font-['PingFang_SC:Medium',sans-serif] text-[12px] leading-[normal] whitespace-nowrap ${
                activeView === 'table' ? 'text-[#830051]' : 'text-[#3c4242]'
              }`}>
                Table View
              </p>
            </button>
            <button
              onClick={() => setActiveView('group')}
              className={`flex items-center gap-[4px] px-[16px] py-[8px] h-full border-b-2 transition-colors active:scale-[0.96] transition-transform ${
                activeView === 'group'
                  ? 'border-[#830051]'
                  : 'border-transparent'
              }`}
            >
              <FolderOpen className={`size-4 ${activeView === 'group' ? 'text-[#830051]' : 'text-[#3C4242]'}`} />
              <p className={`font-['PingFang_SC:Medium',sans-serif] text-[12px] leading-[normal] whitespace-nowrap ${
                activeView === 'group' ? 'text-[#830051]' : 'text-[#3c4242]'
              }`}>
                Group View
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
