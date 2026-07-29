import svgPaths from "./svg-ltplucdk7r";
type PageBreakDividerProps = {
  className?: string;
  state?: "Default" | "Hovered";
  type?: "Page Break" | "Freeze";
};

export default function PageBreakDivider({ className, state = "Hovered", type = "Page Break" }: PageBreakDividerProps) {
  const isDefault = state === "Default";
  const isFreezeAndDefault = type === "Freeze" && state === "Default";
  const isFreezeAndHovered = type === "Freeze" && state === "Hovered";
  const isPageBreakAndHovered = type === "Page Break" && state === "Hovered";
  return (
    <div className={className || `content-stretch flex flex-col items-center justify-center pt-[30px] relative ${isFreezeAndHovered ? "h-[230px] w-0" : ""}`}>
      {state === "Hovered" && (
        <div className={`absolute bg-[#3c4242] content-stretch drop-shadow-[0px_2px_4px_rgba(0,0,0,0.08)] flex gap-[2px] items-center justify-center max-w-[232px] pl-[4px] pr-[6px] py-[4px] rounded-[4px] ${isFreezeAndHovered ? "-translate-x-1/2 bottom-[202px] left-[calc(50%+0.5px)]" : "left-[-59px] top-0"}`} data-name="Tooltip">
          {isPageBreakAndHovered && (
            <>
              <div className="overflow-clip relative shrink-0 size-[16px]" data-name="add-line">
                <div className="absolute inset-[20.83%]" data-name="Vector">
                  <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.33333 9.33333">
                    <path d={svgPaths.p285d5f0} fill="var(--fill-0, white)" id="Vector" />
                  </svg>
                </div>
              </div>
              <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#f8f7f7] text-[12px] whitespace-nowrap">Add Page Break</p>
            </>
          )}
          {isFreezeAndHovered && (
            <>
              <div className="overflow-clip relative shrink-0 size-[16px]" data-name="snowflake-line">
                <div className="absolute inset-[6.95%_7.62%_6.95%_7.63%]" data-name="Vector">
                  <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5609 13.776">
                    <path d={svgPaths.p39580700} fill="var(--fill-0, white)" id="Vector" />
                  </svg>
                </div>
              </div>
              <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#f8f7f7] text-[12px] whitespace-nowrap">Repeat Every Page</p>
            </>
          )}
        </div>
      )}
      {isDefault && (
        <div className={`-translate-x-1/2 absolute bottom-[202px] content-stretch flex gap-[2px] items-center justify-center overflow-clip pl-[6px] pr-[4px] py-[2px] rounded-[4px] ${isFreezeAndDefault ? "bg-[#f4e8ee] left-1/2" : "bg-[#fceecc] left-[calc(50%+0.5px)]"}`} data-name="Label Pill">
          <div className="[word-break:break-word] flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3c4242] text-[12px] whitespace-nowrap">
            <p className="leading-[20px]">{isFreezeAndDefault ? "C6 Fronzen" : type === "Page Break" && state === "Default" ? "P1" : ""}</p>
          </div>
          <div className="overflow-clip relative rounded-[4px] shrink-0 size-[20px]" data-name="Icon button">
            <div className="absolute inset-[16.67%] overflow-clip" data-name="close-line">
              <div className="absolute inset-[23.49%_23.48%_23.48%_23.48%]" data-name="Vector">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.07109 7.07104">
                  <path d={svgPaths.p3991a900} fill="var(--fill-0, #888E8E)" id="Vector" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
      {(isPageBreakAndHovered || isDefault) && (
        <div className="h-[200px] relative shrink-0 w-0" data-name="Divider Line">
          <div className="absolute inset-[0_-1px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 200">
              <path d="M1 0V200" id="Divider Line" stroke={isFreezeAndDefault ? "var(--stroke-0, #830051)" : "var(--stroke-0, #F0AB00)"} strokeDasharray={isPageBreakAndHovered ? "4 4" : undefined} strokeOpacity={isPageBreakAndHovered ? "0.8" : undefined} strokeWidth="2" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}