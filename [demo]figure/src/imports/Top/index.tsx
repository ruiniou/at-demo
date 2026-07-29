import svgPaths from "./svg-l5tojm376k";

function Expand() {
  return (
    <div className="content-stretch flex items-center pl-[8px] relative shrink-0" data-name="Expand">
      <div className="overflow-clip relative rounded-[4px] shrink-0 size-[24px]" data-name="Icon button">
        <div className="absolute inset-[16.67%] overflow-clip" data-name="Icon-expand">
          <div className="absolute flex inset-[8.33%] items-center justify-center" style={{ containerType: "size" }}>
            <div className="-scale-x-100 flex-none h-[100cqh] w-[100cqw]">
              <div className="relative size-full" data-name="Vector">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333">
                  <path d={svgPaths.p15b0ef80} fill="var(--fill-0, #888E8E)" id="Vector" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TableLine() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="table-line">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="table-line">
          <path d={svgPaths.p5a25b80} fill="var(--fill-0, #830051)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ViewToggleButton() {
  return (
    <div className="bg-white h-full relative shrink-0" data-name="View Toggle Button">
      <div aria-hidden className="absolute border-[#830051] border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[4px] items-center justify-center px-[16px] py-[8px] relative size-full">
          <TableLine />
          <p className="[word-break:break-word] font-['PingFang_SC:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#830051] text-[12px] text-center whitespace-nowrap">Table View</p>
        </div>
      </div>
    </div>
  );
}

function FoldersLine() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="folders-line">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="folders-line">
          <path d={svgPaths.p115bee00} fill="var(--fill-0, #3C4242)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ViewToggleButton1() {
  return (
    <div className="h-full relative shrink-0" data-name="View Toggle Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[4px] items-center justify-center px-[16px] py-[8px] relative size-full">
          <FoldersLine />
          <p className="[word-break:break-word] font-['PingFang_SC:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#3c4242] text-[12px] text-center whitespace-nowrap">Group View</p>
        </div>
      </div>
    </div>
  );
}

function MainTab() {
  return (
    <div className="content-stretch flex h-full items-center relative shrink-0" data-name="Main tab">
      <ViewToggleButton />
      <ViewToggleButton1 />
    </div>
  );
}

function ViewToggleContainer() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-[48px] items-center justify-center min-w-px relative" data-name="View Toggle Container">
      <MainTab />
      <div className="absolute bg-[#f8f7f7] content-stretch flex items-center right-[12px] rounded-[4px] top-[14px]" data-name="Secondary Tab Switch">
        <div className="content-stretch flex gap-[2px] h-[20px] items-center justify-center px-[6px] relative rounded-[3px] shrink-0" data-name="Tab switch/Tab">
          <div className="[word-break:break-word] flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#888e8e] text-[12px] text-center whitespace-nowrap">
            <p className="leading-[20px]">Shell</p>
          </div>
        </div>
        <div className="bg-white content-stretch flex gap-[2px] h-[20px] items-center justify-center px-[6px] relative rounded-[3px] shrink-0" data-name="Tab switch/Tab">
          <div aria-hidden className="absolute border-[#d8dada] border-[0.6px] border-solid inset-0 pointer-events-none rounded-[3px]" />
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Windows">
            <div className="absolute inset-[12.5%_8.33%]" data-name="Union">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.334 12">
                <path d={svgPaths.p2f3c1c00} fill="var(--fill-0, #3C4242)" id="Union" />
              </svg>
            </div>
          </div>
        </div>
        <div className="content-stretch flex gap-[2px] h-[20px] items-center justify-center px-[6px] relative rounded-[3px] shrink-0" data-name="Tab switch/Tab">
          <div className="[word-break:break-word] flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#888e8e] text-[12px] text-center whitespace-nowrap">
            <p className="leading-[20px]">Code</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Top() {
  return (
    <div className="content-stretch flex items-center justify-center relative size-full" data-name="Top">
      <div aria-hidden className="absolute border-[#d8dada] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <Expand />
      <ViewToggleContainer />
    </div>
  );
}