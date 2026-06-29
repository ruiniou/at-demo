import { Sparkles } from 'lucide-react';

interface FABProps {
  onClick: () => void;
  isLocked?: boolean;
}

export default function FAB({ onClick, isLocked }: FABProps) {
  return (
    <button
      onClick={isLocked ? undefined : onClick}
      disabled={isLocked}
      className={`fixed bottom-[24px] right-[24px] size-[56px] rounded-full flex items-center justify-center z-50 transition-colors ${
        isLocked
          ? 'bg-[#d8dada] shadow-none cursor-not-allowed'
          : 'bg-[#830051] shadow-[0px_4px_8px_rgba(131,0,81,0.3)] hover:bg-[#6d0043] active:scale-[0.96] transition-transform cursor-pointer'
      }`}
      aria-label="Open AI Copilot"
      aria-disabled={isLocked}
    >
      <Sparkles className={`size-6 ${isLocked ? 'text-[#888E8E]' : 'text-white'}`} />
    </button>
  );
}
