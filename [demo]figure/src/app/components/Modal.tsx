import svgPaths from '../../imports/Modal/svg-ti9se8ucwm';

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
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-[8px] drop-shadow-[0px_4px_6px_rgba(0,0,0,0.15)] w-[400px] max-w-[90vw]">
        {/* Header */}
        <div className="flex items-center justify-between px-[24px] pb-[17px] pt-[16px] border-b border-[#d8dada]">
          <div className="flex items-center gap-[8px] flex-1 min-w-0">
            {/* Red warning icon from Figma import */}
            <div className="overflow-clip relative shrink-0 size-[20px]">
              <div className="absolute inset-[8.33%]">
                <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 16.6667 16.6667">
                  <path d={svgPaths.pa354180} fill="#E11D48" />
                </svg>
              </div>
            </div>
            <h2 className="font-['Roboto_Slab',sans-serif] font-semibold text-[16px] leading-[22px] text-[#3c4242] truncate">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="relative rounded-[4px] shrink-0 size-[24px] flex items-center justify-center hover:bg-black/5 transition-colors active:scale-[0.96]"
            aria-label="Close"
          >
            <div className="absolute inset-[16.67%] overflow-clip">
              <div className="absolute inset-[23.49%_23.48%_23.48%_23.48%]">
                <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 8.48531 8.48525">
                  <path d={svgPaths.p601fc00} fill="#888E8E" />
                </svg>
              </div>
            </div>
          </button>
        </div>

        {/* Body */}
        <div className="px-[24px] py-[20px]">
          <p className="font-['Inter',sans-serif] font-normal text-[14px] leading-[24px] text-[#888e8e]">
            {description}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-[12px] px-[24px] pb-[20px] pt-[21px] border-t border-[#d8dada]">
          <button
            onClick={secondaryAction.onClick}
            className="h-[36px] px-[12px] py-[8px] rounded-[4px] font-['Inter',sans-serif] font-medium text-[14px] leading-[24px] text-[#3c4242] hover:bg-black/5 transition-colors active:scale-[0.96]"
          >
            {secondaryAction.label}
          </button>
          <button
            onClick={primaryAction.onClick}
            className="px-[12px] py-[8px] bg-[#cc2c3c] rounded-[4px] font-['Inter',sans-serif] font-medium text-[14px] leading-[24px] text-white hover:bg-[#b52535] transition-colors active:scale-[0.96]"
          >
            {primaryAction.label}
          </button>
        </div>
      </div>
    </div>
  );
}
