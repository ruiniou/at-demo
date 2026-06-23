import { X, AlertCircle } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  primaryAction: {
    label: string;
    onClick: () => void;
  };
  secondaryAction: {
    label: string;
    onClick: () => void;
  };
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  primaryAction,
  secondaryAction,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-[8px] shadow-[0px_4px_6px_rgba(0,0,0,0.15)] w-[400px] max-w-[90vw]">
        {/* Header */}
        <div className="flex items-center justify-between px-[24px] pb-[17px] pt-[16px] border-b border-[#e5e8e8]">
          <div className="flex items-center gap-[8px] flex-1">
            <AlertCircle className="size-5 text-[#F0AB00] shrink-0" />
            <h2 className="font-['PingFang_SC:Semibold',sans-serif] text-[16px] leading-[22px] text-[#3c4242]">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="size-[24px] flex items-center justify-center rounded-[4px] hover:bg-black/5 transition-colors active:scale-[0.96] transition-transform"
            aria-label="Close"
          >
            <X className="size-4 text-[#888E8E]" />
          </button>
        </div>

        {/* Body */}
        <div className="px-[24px] py-[20px]">
          <p className="font-['PingFang_SC:Regular',sans-serif] text-[14px] leading-[20px] text-[#666]">
            {description}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-[12px] px-[24px] pb-[20px] pt-[21px] border-t border-[#e5e8e8]">
          <button
            onClick={secondaryAction.onClick}
            className="px-[12px] py-[8px] h-[36px] bg-white border-[0.6px] border-[#d8dada] rounded-[4px] font-['PingFang_SC:Regular',sans-serif] text-[14px] leading-[20px] text-[#3c4242] hover:bg-[#f8f7f7] transition-colors active:scale-[0.96] transition-transform"
          >
            {secondaryAction.label}
          </button>
          <button
            onClick={primaryAction.onClick}
            className="px-[12px] py-[8px] bg-[#830051] rounded-[4px] font-['PingFang_SC:Regular',sans-serif] text-[14px] leading-[20px] text-white hover:bg-[#6d0043] transition-colors active:scale-[0.96] transition-transform"
          >
            {primaryAction.label}
          </button>
        </div>
      </div>
    </div>
  );
}
