import React, { useState, useRef, useEffect } from "react";

export interface AccountMenuProps {
  userName?: string;
  avatarLetter?: string;
  roleBadge?: string;
  onLogout?: () => void;
  className?: string;
}

export const AccountMenu: React.FC<AccountMenuProps> = ({
  userName = "User account",
  avatarLetter = "U",
  roleBadge,
  onLogout,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleLogoutClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div ref={containerRef} className={`relative select-none ${className}`}>
      {/* No fill Account Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="flex items-center gap-[8px] w-full px-[8px] py-[6px] rounded-[6px] transition-colors text-left bg-transparent hover:bg-black/5 active:bg-black/10 focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand-1 cursor-pointer group min-w-0"
      >
        <div className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full bg-[#9DB0AC] text-white text-[12px] font-medium shadow-2xs">
          {avatarLetter}
        </div>
        <div className="flex items-center flex-nowrap gap-[6px] min-w-0 flex-1 overflow-hidden">
          <span
            className="font-normal text-text-primary truncate shrink min-w-0"
            style={{ fontSize: "13px", lineHeight: "20px" }}
          >
            {userName}
          </span>
          {roleBadge && (
            <span className="shrink-0 text-[10px] px-[6px] py-[1.5px] rounded-full bg-az-secondary text-brand-1 font-medium whitespace-nowrap leading-none">
              {roleBadge}
            </span>
          )}
        </div>
      </button>

      {/* Popover Menu with only 'Log out' option */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute bottom-[calc(100%+6px)] left-0 w-full min-w-[150px] rounded-[8px] border border-border-default bg-white p-[4px] shadow-lg z-50 animate-in fade-in slide-in-from-bottom-2 duration-150"
        >
          <button
            type="button"
            role="menuitem"
            onClick={handleLogoutClick}
            className="flex items-center gap-[8px] w-full px-[10px] py-[8px] rounded-[4px] text-[13px] font-normal text-status-error hover:bg-status-error-bg/30 active:bg-status-error-bg/50 transition-colors text-left cursor-pointer"
          >
            <svg
              className="h-[14px] w-[14px] shrink-0 text-status-error"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Log out</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountMenu;
