import { X, Send } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface ChatMessage {
  role: 'assistant' | 'user';
  text: string;
}

interface AICopilotProps {
  onClose: () => void;
  isLocked?: boolean;
  prefillMessage?: string | null;
  onSend?: () => void;
}

export default function AICopilot({ onClose, isLocked, prefillMessage, onSend }: AICopilotProps) {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: 'How can I help you with this code?' },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // When a prefill arrives, populate the input and focus it
  useEffect(() => {
    if (prefillMessage) {
      setInputValue(prefillMessage);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [prefillMessage]);

  // Scroll chat to bottom whenever messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text || isLocked) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInputValue('');
    onSend?.();
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: 'Applying metadata changes to the code...' },
      ]);
    }, 600);
  };

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
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-[12px] rounded-[8px] ${
                msg.role === 'user'
                  ? 'bg-[#f4e8ee] ml-[24px]'
                  : 'bg-[#f8f7f7] mr-[24px]'
              }`}
            >
              <p className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] text-[#3c4242] break-words">
                {msg.text}
              </p>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-[16px] border-t border-[#d8dada]">
        <div className="flex items-center gap-[8px]">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
            placeholder="Ask a question..."
            disabled={isLocked}
            className={`flex-1 px-[12px] py-[8px] border rounded-[6px] font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] focus:outline-none ${
              isLocked
                ? 'bg-[#f8f7f7] border-[#ebecec] text-[#b2b4b4] placeholder:text-[#b2b4b4] cursor-not-allowed'
                : 'bg-[#f8f7f7] border-[#ebecec] text-[#3c4242] placeholder:text-[#999] focus:border-[#830051]'
            }`}
          />
          <button
            onClick={handleSend}
            disabled={isLocked || !inputValue.trim()}
            className={`size-[32px] flex items-center justify-center rounded-[6px] transition-colors ${
              isLocked || !inputValue.trim()
                ? 'bg-[#d8dada] cursor-not-allowed'
                : 'bg-[#830051] hover:bg-[#6d0043] active:scale-[0.96] transition-transform'
            }`}
          >
            <Send className={`size-4 ${isLocked || !inputValue.trim() ? 'text-[#888E8E]' : 'text-white'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
