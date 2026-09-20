import { Popover } from "../ui/Popover";
import { MenuItem } from "../ui/MenuItem";
import { Avatar } from "../ui/Avatar";
import React, { useState, useRef } from "react";

export interface AccountMenuProps {
  userName?: string;
  avatarLetter?: string;
  onLogout?: () => void;
  className?: string;
}

export const AccountMenu: React.FC<AccountMenuProps> = ({
  userName = "User account",
  avatarLetter = "U",
  onLogout,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleLogoutClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className={`relative select-none ${className}`}>
      {/* No fill Account Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="flex items-center gap-[8px] w-full px-[8px] py-[6px] rounded-[6px] transition-colors text-left bg-transparent hover:bg-black/5 active:bg-black/10 focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand-1 cursor-pointer group min-w-0"
      >
        <Avatar name={userName} initials={avatarLetter} level="page" />
        <div className="flex items-center flex-nowrap gap-[6px] min-w-0 flex-1 overflow-hidden">
          <span
            className="font-normal text-text-primary truncate shrink min-w-0"
            style={{ fontSize: "13px", lineHeight: "20px" }}
          >
            {userName}
          </span>
        </div>
      </button>

      {/* Popover Menu with only 'Log out' option */}
      <Popover open={isOpen} onOpenChange={setIsOpen} anchorRef={triggerRef} role="menu" label="Account actions" placement="top" offset={6} className="rounded-[8px] shadow-lg">
          <MenuItem danger onClick={handleLogoutClick} className="px-[10px] py-[8px] text-[13px]" icon={<svg
              className="h-[14px] w-[14px] shrink-0"
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
            </svg>}>
            Log out
          </MenuItem>
      </Popover>
    </div>
  );
};

export default AccountMenu;
