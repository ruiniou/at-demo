import svgPaths from "./svg-nsj0ucij0k";
type TabItemProps = {
  className?: string;
  label?: string;
  selected?: boolean;
  state?: "Default" | "Selected" | "Hovered" | "Disabled";
  style?: "A" | "B";
};

export default function TabItem({ className, label = "Tab Label", selected = false, state = "Default", style = "A" }: TabItemProps) {
  const isDisabledAndB = state === "Disabled" && style === "B";
  return (
    <div className={className || `content-stretch flex h-[32px] items-center min-w-[90px] pl-[8px] pr-[4px] py-[6px] relative w-[160px] ${state === "Hovered" && selected && style === "B" ? "bg-[#f4e8ee] rounded-[4px]" : state === "Selected" && selected && style === "B" ? "bg-[#f4e8ee] gap-[4px] rounded-[4px]" : state === "Hovered" && !selected && style === "B" ? "bg-[#f8f7f7] gap-[4px] rounded-[4px]" : style === "B" && ((state === "Default" && !selected) || state === "Disabled") ? "gap-[4px] rounded-[4px]" : state === "Hovered" && selected && style === "A" ? "bg-[#f4e8ee]" : state === "Selected" && selected && style === "A" ? "bg-[#f4e8ee] gap-[4px]" : state === "Hovered" && !selected && style === "A" ? "bg-[#f8f7f7] gap-[4px]" : "gap-[4px]"}`}>
      {!selected && ["Default", "Hovered"].includes(state) && <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[18px] min-w-px not-italic overflow-hidden relative text-[#3c4242] text-[12px] text-ellipsis whitespace-nowrap">{label}</p>}
      {state === "Hovered" && !selected && (
        <div className="overflow-clip relative rounded-[4px] shrink-0 size-[24px]" data-name="Icon button">
          <div className="absolute inset-[16.67%]" data-name="history-fill">
            <div className="absolute inset-[8.33%_8.34%_8.34%_8.33%]" data-name="路径">
              <svg className="absolute block inset-0 size-full" fill="none" height="13.333" preserveAspectRatio="none" viewBox="0 0 13.333 13.333" width="13.333">
                <path d={svgPaths.p28fa4580} fill="var(--fill-0, #888E8E)" id="è·¯å¾" />
              </svg>
            </div>
          </div>
        </div>
      )}
      {selected && style === "A" && ["Selected", "Hovered"].includes(state) && <div aria-hidden className="absolute border-[#830051] border-l-3 border-solid inset-0 pointer-events-none" />}
      {selected && ["Selected", "Hovered"].includes(state) && <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[18px] min-w-px not-italic overflow-hidden relative text-[#830051] text-[12px] text-ellipsis whitespace-nowrap">{label}</p>}
      {state === "Hovered" && selected && (
        <div className="overflow-clip relative rounded-[4px] shrink-0 size-[24px]" data-name="Icon button">
          <div className="absolute inset-[16.67%]" data-name="history-fill">
            <div className="absolute inset-[8.33%_8.34%_8.34%_8.33%]" data-name="路径">
              <svg className="absolute block inset-0 size-full" fill="none" height="13.333" preserveAspectRatio="none" viewBox="0 0 13.333 13.333" width="13.333">
                <path d={svgPaths.p28fa4580} fill="var(--fill-0, #888E8E)" id="è·¯å¾" />
              </svg>
            </div>
          </div>
        </div>
      )}
      {isDisabledAndB && (
        <>
          <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[18px] min-w-px not-italic overflow-hidden relative text-[#b2b4b4] text-[12px] text-ellipsis whitespace-nowrap">Tab Label</p>
          <div className="overflow-clip relative rounded-[4px] shrink-0 size-[24px]" data-name="Icon button">
            <div className="absolute inset-[16.67%]" data-name="history-fill">
              <div className="absolute inset-[8.33%_8.34%_8.34%_8.33%]" data-name="路径">
                <svg className="absolute block inset-0 size-full" fill="none" height="13.333" preserveAspectRatio="none" viewBox="0 0 13.333 13.333" width="13.333">
                  <path d={svgPaths.p28fa4580} fill="var(--fill-0, #888E8E)" id="è·¯å¾" />
                </svg>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}