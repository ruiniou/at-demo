import svgPaths from "./svg-bwq7ygxmga";

function MoreOptionsDropdown() {
  return (
    <div className="absolute bg-white left-[108px] rounded-[8px] top-[68px]" data-name="More Options Dropdown">
      <div className="content-stretch flex flex-col items-start overflow-clip p-[4px] relative rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[6px] items-center px-[4px] py-[6px] relative rounded-[2px] shrink-0" data-name="Label/Option">
          <div className="relative shrink-0 size-[16px]" data-name="forbid-line">
            <div className="absolute inset-[8.33%_8.34%_8.34%_8.33%]" data-name="路径">
              <svg className="absolute block inset-0 size-full" fill="none" height="13.333" preserveAspectRatio="none" viewBox="0 0 13.333 13.333" width="13.333">
                <path d={svgPaths.p164d6700} fill="var(--fill-0, #888E8E)" id="è·¯å¾" />
              </svg>
            </div>
          </div>
          <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#3c4242] text-[12px] whitespace-nowrap">Mark as Deprecated</p>
        </div>
        <div className="relative rounded-[2px] shrink-0 w-full" data-name="Label/Option">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex gap-[6px] items-center px-[4px] py-[6px] relative size-full">
              <div className="overflow-clip relative shrink-0 size-[16px]" data-name="delete-bin-line">
                <div className="absolute inset-[8.33%]" data-name="Vector">
                  <svg className="absolute block inset-0 size-full" fill="none" height="13.3333" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333" width="13.3333">
                    <path d={svgPaths.p3fc12880} fill="var(--fill-0, #CC2C3C)" id="Vector" />
                  </svg>
                </div>
              </div>
              <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#cc2c3c] text-[12px] whitespace-nowrap">Delete Component</p>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#ebecec] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_2px_6px_0px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

export default function LeftSidebar() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start pt-[4px] px-[4px] relative size-full" data-name="Left Sidebar">
      <div aria-hidden className="absolute border-[#ebecec] border-r border-solid inset-0 pointer-events-none" />
      <div className="h-[32px] min-w-[90px] relative rounded-[4px] shrink-0 w-full" data-name="Tab/Item">
        <div className="flex flex-row items-center min-w-[inherit] size-full">
          <div className="content-stretch flex gap-[4px] items-center min-w-[inherit] pl-[8px] pr-[4px] py-[6px] relative size-full">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[18px] min-w-px not-italic overflow-hidden relative text-[#3c4242] text-[12px] text-ellipsis whitespace-nowrap">All</p>
          </div>
        </div>
      </div>
      <div className="bg-[#f8f7f7] h-[32px] min-w-[90px] relative rounded-[4px] shrink-0 w-full" data-name="Tab/Item">
        <div className="flex flex-row items-center min-w-[inherit] size-full">
          <div className="content-stretch flex gap-[4px] items-center min-w-[inherit] pl-[8px] pr-[4px] py-[6px] relative size-full">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[18px] min-w-px not-italic overflow-hidden relative text-[#3c4242] text-[12px] text-ellipsis whitespace-nowrap">KM Plot Chart</p>
            <div className="bg-[#f8f7f7] overflow-clip relative rounded-[4.8px] shrink-0 size-[24px]" data-name="Icon button">
              <div className="absolute inset-[16.67%] overflow-clip" data-name="more-line">
                <div className="absolute inset-[43.75%_12.5%]" data-name="Vector">
                  <svg className="absolute block inset-0 size-full" fill="none" height="2" preserveAspectRatio="none" viewBox="0 0 12 2" width="12">
                    <path d={svgPaths.p2bac9d80} fill="var(--fill-0, #888E8E)" id="Vector" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[32px] min-w-[90px] relative rounded-[4px] shrink-0 w-full" data-name="Tab/Item">
        <div className="flex flex-row items-center min-w-[inherit] size-full">
          <div className="content-stretch flex gap-[4px] items-center min-w-[inherit] pl-[8px] pr-[4px] py-[6px] relative size-full">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[18px] min-w-px not-italic overflow-hidden relative text-[#3c4242] text-[12px] text-ellipsis whitespace-nowrap">Number at Risk Table</p>
          </div>
        </div>
      </div>
      <MoreOptionsDropdown />
    </div>
  );
}