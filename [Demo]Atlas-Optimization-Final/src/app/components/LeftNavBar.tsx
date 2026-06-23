import { FileCode, User } from 'lucide-react';

interface LeftNavBarProps {
  isTreeListOpen: boolean;
  onToggleTreeList: () => void;
}

export default function LeftNavBar({ isTreeListOpen, onToggleTreeList }: LeftNavBarProps) {
  return (
    <div className="h-full w-[40px] bg-white border-r border-[#d8dada] flex flex-col items-center py-[8px]">
      {/* Toggle Tree List Button */}
      <button
        onClick={onToggleTreeList}
        className={`size-[32px] flex items-center justify-center rounded-[6px] transition-colors active:scale-[0.96] transition-transform ${
          isTreeListOpen ? 'bg-[#830051]' : 'hover:bg-[#f8f7f7]'
        }`}
        aria-label="Toggle tree list"
      >
        <FileCode className={`size-4 ${isTreeListOpen ? 'text-white' : 'text-[#888E8E]'}`} />
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Avatar */}
      <div className="size-[32px] rounded-full bg-[#e5e8e8] flex items-center justify-center">
        <User className="size-4 text-[#888E8E]" />
      </div>
    </div>
  );
}
