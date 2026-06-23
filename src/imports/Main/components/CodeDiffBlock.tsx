import React, { useState } from "react";

function ArrowDownIcon({ className = "w-[24px] h-[24px]", color = "currentColor" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.0001 13.1714L16.9499 8.22168L18.3641 9.63589L12.0001 15.9999L5.63623 9.63589L7.05044 8.22168L12.0001 13.1714Z" fill={color}/>
    </svg>
  );
}

function CopyIcon({ className = "w-[24px] h-[24px]", color = "currentColor" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.9998 6V3C6.9998 2.44772 7.44752 2 7.9998 2H19.9998C20.5521 2 20.9998 2.44772 20.9998 3V17C20.9998 17.5523 20.5521 18 19.9998 18H16.9998V20.9991C16.9998 21.5519 16.5499 22 15.993 22H4.00666C3.45059 22 3 21.5554 3 20.9991L3.0026 7.00087C3.0027 6.44811 3.45264 6 4.00942 6H6.9998ZM5.00242 8L5.00019 20H14.9998V8H5.00242ZM8.9998 6H16.9998V16H18.9998V4H8.9998V6Z" fill={color}/>
    </svg>
  );
}

function IconButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-[24px] h-[24px] rounded-[4px] flex items-center justify-center hover:bg-[#EBECEC] transition-colors shrink-0"
    >
      {children}
    </button>
  );
}

export default function CodeDiffBlock() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [headerHovered, setHeaderHovered] = useState(false);

  return (
    <div className="border-[0.6px] border-[#D8DADA] rounded-[8px] w-full overflow-hidden">
      <div
        onMouseEnter={() => setHeaderHovered(true)}
        onMouseLeave={() => setHeaderHovered(false)}
        className={`flex items-center justify-between px-[10px] py-[8px] cursor-pointer transition-colors ${
          headerHovered ? 'bg-[#F8F7F7]' : 'bg-transparent'
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-[12px]">
          <div className="flex items-center gap-[6px]">
            <div className="w-[16px] h-[16px] flex items-center justify-center">
              <ArrowDownIcon
                className={`w-full h-full transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`}
                color="#888E8E"
              />
            </div>
            <p className="t-body-compact text-[#3C4242]">Lines 3-7</p>
          </div>
          <div className="flex gap-[4px] text-[12px] font-medium leading-[18px]">
            <span className="text-[#1E7E34]">+1</span>
            <span className="text-[#CC2C3C]">-9</span>
          </div>
        </div>

        <IconButton onClick={(e) => { e?.stopPropagation(); }}>
          <CopyIcon className="w-[16px] h-[16px]" color="#888E8E" />
        </IconButton>
      </div>

      {isExpanded && (
        <div className="border-t-[0.6px] border-[#D8DADA] bg-[#FFFFFF] overflow-x-auto">
          <div className="bg-[#FDECEA] border-l-[3px] border-[#830051] pl-[7px] py-[4px] min-w-max">
            {[1, 2, 3].map((num) => (
              <div key={`del-${num}`} className="flex items-start pl-0 pr-[10px] h-[20px] t-code">
                <div className="w-[16px] shrink-0 text-[#888E8E] select-none flex items-center justify-center">-</div>
                <div className="w-[6px] shrink-0" />
                <div className="w-[24px] shrink-0 text-[#888E8E] select-none text-left">{num}</div>
                <div className="flex-1 min-w-0">
                  <span className="text-[#005CC5]">value</span> = <span className="text-[#032F62]">'Value {num} with a very long code line to test horizontal scrolling logic in diff block'</span>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-[#E6F4EA] border-l-[3px] border-[#1E7E34] pl-[7px] py-[4px] min-w-max">
            {[1, 2, 4].map((num) => (
              <div key={`add-${num}`} className="flex items-start pl-0 pr-[10px] h-[20px] t-code">
                <div className="w-[16px] shrink-0 text-[#888E8E] select-none flex items-center justify-center">+</div>
                <div className="w-[6px] shrink-0" />
                <div className="w-[24px] shrink-0 text-[#888E8E] select-none text-left">{num}</div>
                <div className="flex-1 min-w-0">
                   <span className="text-[#005CC5]">value</span> = <span className="text-[#032F62]">'New Value {num} with updated configuration properties to trigger horizontal overflow'</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
