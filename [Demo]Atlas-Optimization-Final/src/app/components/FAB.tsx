import { Sparkles } from 'lucide-react';

interface FABProps {
  onClick: () => void;
}

export default function FAB({ onClick }: FABProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-[24px] right-[24px] size-[56px] bg-[#830051] rounded-full shadow-[0px_4px_8px_rgba(131,0,81,0.3)] hover:bg-[#6d0043] transition-colors active:scale-[0.96] transition-transform flex items-center justify-center z-50"
      aria-label="Open AI Copilot"
    >
      <Sparkles className="size-6 text-white" />
    </button>
  );
}
