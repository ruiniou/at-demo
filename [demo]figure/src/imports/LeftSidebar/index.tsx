import svgPaths from "./svg-sxu4qwsosr";

export default function LeftSidebar() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start pt-[4px] px-[4px] relative size-full" data-name="Left Sidebar">
      <div aria-hidden className="absolute border-[#ebecec] border-r border-solid inset-0 pointer-events-none" />
      <div className="bg-[#f4e8ee] h-[32px] min-w-[90px] relative rounded-[4px] shrink-0 w-full" data-name="Tab/Item">
        <div className="flex flex-row items-center min-w-[inherit] size-full">
          <div className="content-stretch flex items-center min-w-[inherit] pl-[8px] pr-[4px] py-[6px] relative size-full">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[18px] min-w-px not-italic overflow-hidden relative text-[#830051] text-[12px] text-ellipsis whitespace-nowrap">All</p>
            <div className="bg-[#d8dada] overflow-clip relative rounded-[4.8px] shrink-0 size-[24px]" data-name="Icon button">
              <div className="absolute inset-[16.67%] overflow-clip" data-name="add-line">
                <div className="absolute inset-[20.83%]" data-name="Vector">
                  <svg className="absolute block inset-0 size-full" fill="none" height="9.33333" preserveAspectRatio="none" viewBox="0 0 9.33333 9.33333" width="9.33333">
                    <path d={svgPaths.p285d5f0} fill="var(--fill-0, #888E8E)" id="Vector" />
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
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[18px] min-w-px not-italic overflow-hidden relative text-[#3c4242] text-[12px] text-ellipsis whitespace-nowrap">KM Plot Chart</p>
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
      <div className="absolute bg-[#3c4242] content-stretch drop-shadow-[0px_2px_4px_rgba(0,0,0,0.08)] flex items-center justify-center left-[69px] max-w-[232px] px-[6px] py-[4px] rounded-[4px] top-[34px] w-[101px]" data-name="Tooltip">
        <p className="[word-break:break-word] flex-[1_0_0] font-['PingFang_SC:Regular',sans-serif] leading-[20px] min-w-px not-italic relative text-[#f8f7f7] text-[12px]">Add Component</p>
      </div>
    </div>
  );
}