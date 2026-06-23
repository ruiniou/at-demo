import { FileText } from 'lucide-react';

interface ShellPreviewProps {
  selectedItem: string | null;
  onBlockClick: () => void;
  onMetadataClick: () => void;
  metadataOpen: boolean;
}

export default function ShellPreview({ selectedItem, onBlockClick, onMetadataClick, metadataOpen }: ShellPreviewProps) {
  return (
    <div className="h-full bg-white border-r border-[#e5e8e8] flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="bg-white h-[40px] relative shrink-0 w-full border-b border-[#d8dada]">
        <div className="flex items-center justify-between px-[12px] h-full">
          <p className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] text-black">
            Shell preview
          </p>
          <div className="flex items-center">
            <button
              onClick={onMetadataClick}
              className={`size-[24px] flex items-center justify-center rounded-[4px] transition-colors active:scale-[0.96] transition-transform ${
                metadataOpen ? 'bg-[#f4e8ee]' : 'hover:bg-black/5'
              }`}
              aria-label="Toggle metadata"
            >
              <FileText className={`size-4 ${metadataOpen ? 'text-[#830051]' : 'text-[#888E8E]'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-[16px] overflow-x-auto">
          {/* Sample Blocks */}
          <div className="flex flex-col gap-[8px]">
            <div
              onClick={onBlockClick}
              className="p-[12px] bg-[#f8f7f7] rounded-[6px] border border-[#ebecec] cursor-pointer hover:border-[#830051] transition-colors"
            >
              <p className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] text-[#3c4242]">
                Block 1
              </p>
            </div>
            <div
              onClick={onBlockClick}
              className="p-[12px] bg-[#f8f7f7] rounded-[6px] border border-[#ebecec] cursor-pointer hover:border-[#830051] transition-colors"
            >
              <p className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] text-[#3c4242]">
                Block 2
              </p>
            </div>
            <div
              onClick={onBlockClick}
              className="p-[12px] bg-[#f8f7f7] rounded-[6px] border border-[#ebecec] cursor-pointer hover:border-[#830051] transition-colors"
            >
              <p className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] text-[#3c4242]">
                Block 3
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
