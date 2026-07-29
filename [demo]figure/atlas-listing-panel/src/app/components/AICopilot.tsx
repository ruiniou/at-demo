import { X, Send } from 'lucide-react';

interface AICopilotProps {
  onClose: () => void;
  isLocked?: boolean;
}

export default function AICopilot({ onClose, isLocked }: AICopilotProps) {
  return (
    <div className="h-full w-full bg-white border-l border-[#d8dada] flex flex-col">
      {/* Top Bar */}
      <div className="bg-white h-[40px] relative shrink-0 w-full border-b border-[#d8dada]">
        <div className="flex items-center justify-between px-[16px] h-full">
          <p className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] text-black">
            AI Copilot
          </p>
          <button
            onClick={onClose}
            className="size-[24px] flex items-center justify-center rounded-[4px] hover:bg-black/5 transition-colors active:scale-[0.96] transition-transform"
            aria-label="Close AI Copilot"
          >
            <X className="size-4 text-[#888E8E]" />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-auto p-[16px]">
        <div className="flex flex-col gap-[12px]">
          <div className="bg-[#f8f7f7] p-[12px] rounded-[8px]">
            <p className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] text-[#3c4242] break-words">
              How can I help you with this code?
            </p>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-[16px] border-t border-[#d8dada]">
        <div className="flex items-center gap-[8px]">
          <input
            type="text"
            placeholder="Ask a question..."
            disabled={isLocked}
            className={`flex-1 px-[12px] py-[8px] border rounded-[6px] font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] focus:outline-none ${
              isLocked
                ? 'bg-[#f8f7f7] border-[#ebecec] text-[#b2b4b4] placeholder:text-[#b2b4b4] cursor-not-allowed'
                : 'bg-[#f8f7f7] border-[#ebecec] text-[#3c4242] placeholder:text-[#999] focus:border-[#830051]'
            }`}
          />
          <button
            disabled={isLocked}
            className={`size-[32px] flex items-center justify-center rounded-[6px] transition-colors ${
              isLocked
                ? 'bg-[#d8dada] cursor-not-allowed'
                : 'bg-[#830051] hover:bg-[#6d0043] active:scale-[0.96] transition-transform'
            }`}
          >
            <Send className={`size-4 ${isLocked ? 'text-[#888E8E]' : 'text-white'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
