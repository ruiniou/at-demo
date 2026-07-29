import svgPaths from "./svg-azr8qwiio2";

function ViewToggleContainer() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-[48px] items-center justify-center min-w-px relative" data-name="View Toggle Container">
      <div className="absolute bg-[#f8f7f7] content-stretch flex h-[20px] items-center right-[10px] rounded-[4px] top-[14px]" data-name="Segmented Control">
        <div className="bg-white content-stretch flex gap-[2px] h-full items-center justify-center px-[6px] relative rounded-[3px] shrink-0" data-name="Segmented Control/Label button">
          <div aria-hidden className="absolute border-[#d8dada] border-[0.6px] border-solid inset-0 pointer-events-none rounded-[3px]" />
          <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3c4242] text-[12px] text-center whitespace-nowrap">
            <p className="leading-[20px]">Shell</p>
          </div>
        </div>
        <div className="content-stretch flex gap-[2px] h-full items-center justify-center px-[6px] relative rounded-[3px] shrink-0" data-name="Segmented Control/Label button">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="split/L&R">
            <div className="absolute inset-[12.5%_8.33%]" data-name="Union">
              <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 13.3333 12" width="13.3333">
                <g id="Union">
                  <path d={svgPaths.p365c5e00} fill="var(--fill-0, black)" />
                  <path d="M7.33333 12H6V0H7.33333V12Z" fill="var(--fill-0, black)" />
                  <path d={svgPaths.p8e72000} fill="var(--fill-0, black)" />
                </g>
              </svg>
            </div>
          </div>
        </div>
        <div className="content-stretch flex gap-[2px] h-full items-center justify-center px-[6px] relative rounded-[3px] shrink-0" data-name="Segmented Control/Label button">
          <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#888e8e] text-[12px] text-center whitespace-nowrap">
            <p className="leading-[20px]">Code</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full" data-name="Heading">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#3c4242] text-[12px] text-ellipsis whitespace-nowrap">AZE2001-301</p>
      <div className="overflow-clip relative shrink-0 size-[14px]" data-name="Icon/Event-Status">
        <div className="absolute inset-[12.5%]" data-name="Union">
          <svg className="absolute block inset-0 size-full" fill="none" height="10.5" preserveAspectRatio="none" viewBox="0 0 10.5 10.5" width="10.5">
            <g id="Union">
              <path d={svgPaths.p24ed2780} fill="var(--fill-0, #F0AB00)" />
              <path clipRule="evenodd" d={svgPaths.p26cea600} fill="var(--fill-0, #F0AB00)" fillRule="evenodd" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function StudyEvent() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[136px]" data-name="Study/Event">
      <Heading />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[15px] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[#888e8e] text-[10px] text-ellipsis w-full whitespace-nowrap">
        <p className="leading-[20px] overflow-hidden text-ellipsis">CSR Interim Analysis</p>
      </div>
    </div>
  );
}

function Expand() {
  return (
    <div className="absolute content-stretch flex gap-[10px] items-center left-0 pl-[8px] top-[6.5px]" data-name="Expand">
      <div className="overflow-clip relative rounded-[4px] shrink-0 size-[24px]" data-name="Icon button">
        <div className="absolute inset-[16.67%] overflow-clip" data-name="Icon-expand">
          <div className="absolute flex inset-[8.33%] items-center justify-center" style={{ containerType: "size" }}>
            <div className="-scale-x-100 flex-none h-[100cqh] w-[100cqw]">
              <div className="relative size-full" data-name="Vector">
                <svg className="absolute block inset-0 size-full" fill="none" height="13.3333" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333" width="13.3333">
                  <path d={svgPaths.p15b0ef80} fill="var(--fill-0, #888E8E)" id="Vector" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <StudyEvent />
    </div>
  );
}

function Top() {
  return (
    <div className="content-stretch flex h-[48px] items-center justify-center relative shrink-0 w-full" data-name="Top">
      <div aria-hidden className="absolute border-[#ebecec] border-b border-solid inset-0 pointer-events-none" />
      <ViewToggleContainer />
      <Expand />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[335.5px]">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#3c4242] text-[12px] whitespace-nowrap">Figure name</p>
    </div>
  );
}

function ToolBar() {
  return (
    <div className="content-stretch flex h-full items-center justify-end relative shrink-0 w-[156px]" data-name="Tool bar">
      <div className="bg-[#f4e8ee] overflow-clip relative rounded-[4px] shrink-0 size-[24px]" data-name="Icon button">
        <div className="absolute inset-[16.67%] overflow-clip" data-name="file-info-line">
          <div className="absolute inset-[8.33%_12.5%]" data-name="Vector">
            <svg className="absolute block inset-0 size-full" fill="none" height="13.3333" preserveAspectRatio="none" viewBox="0 0 12 13.3333" width="12">
              <path d={svgPaths.p9270400} fill="var(--fill-0, #830051)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function TopBar() {
  return (
    <div className="bg-white h-[40px] relative shrink-0 w-full" data-name="Top Bar">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-between pl-[12px] pr-[16px] relative size-full">
          <Frame />
          <ToolBar />
        </div>
      </div>
    </div>
  );
}

function TitleArea() {
  return (
    <div className="[word-break:break-word] absolute h-[62px] leading-[normal] left-0 not-italic text-center top-0 w-[900px]" data-name="Title Area">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold h-[17px] left-[450px] text-[#333] text-[13px] top-[14px] w-[900px]">[Figure Title]</p>
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal h-[15px] left-[450px] text-[#888] text-[11px] top-[32px] w-[900px]">Figure X.X</p>
    </div>
  );
}

function GridLines() {
  return (
    <div className="absolute h-[340px] left-0 top-0 w-[800px]" data-name="Grid Lines">
      <svg className="absolute block inset-0 size-full" fill="none" height="340" preserveAspectRatio="none" viewBox="0 0 800 340" width="800">
        <g clipPath="url(#clip0_4001_367)" id="Grid Lines">
          <path d="M0 0H800" id="grid-h" stroke="var(--stroke-0, #EDEDED)" strokeOpacity="0.4" />
          <path d="M0 0H800" id="grid-h_2" stroke="var(--stroke-0, #EDEDED)" strokeOpacity="0.4" />
          <path d="M0 0H800" id="grid-h_3" stroke="var(--stroke-0, #EDEDED)" strokeOpacity="0.4" />
          <path d="M0 0H800" id="grid-h_4" stroke="var(--stroke-0, #EDEDED)" strokeOpacity="0.4" />
          <path d="M0 0H800" id="grid-h_5" stroke="var(--stroke-0, #EDEDED)" strokeOpacity="0.4" />
        </g>
        <defs>
          <clipPath id="clip0_4001_367">
            <rect fill="white" height="340" width="800" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function KmCurves() {
  return (
    <div className="absolute h-[340px] left-0 top-0 w-[800px]" data-name="KM Curves">
      <svg className="absolute block inset-0 size-full" fill="none" height="340" preserveAspectRatio="none" viewBox="0 0 800 340" width="800">
        <g clipPath="url(#clip0_4001_404)" id="KM Curves">
          <path d={svgPaths.p527f8c0} id="curve-g0" stroke="var(--stroke-0, #9A3374)" strokeWidth="2" />
          <path d={svgPaths.p2d371000} id="curve-g1" stroke="var(--stroke-0, #F3BC33)" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_4001_404">
            <rect fill="white" height="340" width="800" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function CensorMarks() {
  return (
    <div className="absolute h-[340px] left-0 top-0 w-[800px]" data-name="Censor Marks">
      <svg className="absolute block inset-0 size-full" fill="none" height="340" preserveAspectRatio="none" viewBox="0 0 800 340" width="800">
        <g clipPath="url(#clip0_4001_374)" id="Censor Marks">
          <path d="M0 0V10" id="censor-g0" stroke="var(--stroke-0, #9A3374)" />
          <path d="M0 0V10" id="censor-g0_2" stroke="var(--stroke-0, #9A3374)" />
          <path d="M0 0V10" id="censor-g0_3" stroke="var(--stroke-0, #9A3374)" />
          <path d="M0 0V10" id="censor-g0_4" stroke="var(--stroke-0, #9A3374)" />
          <path d="M0 0V10" id="censor-g0_5" stroke="var(--stroke-0, #9A3374)" />
          <path d="M0 0V10" id="censor-g0_6" stroke="var(--stroke-0, #9A3374)" />
          <path d="M0 0V10" id="censor-g0_7" stroke="var(--stroke-0, #9A3374)" />
          <path d="M0 0V10" id="censor-g0_8" stroke="var(--stroke-0, #9A3374)" />
          <path d="M0 0V10" id="censor-g0_9" stroke="var(--stroke-0, #9A3374)" />
          <path d="M0 0V10" id="censor-g0_10" stroke="var(--stroke-0, #9A3374)" />
          <path d="M0 0V10" id="censor-g0_11" stroke="var(--stroke-0, #9A3374)" />
          <path d="M0 0V10" id="censor-g0_12" stroke="var(--stroke-0, #9A3374)" />
          <path d="M0 0V10" id="censor-g0_13" stroke="var(--stroke-0, #9A3374)" />
          <path d="M0 0V10" id="censor-g0_14" stroke="var(--stroke-0, #9A3374)" />
          <path d="M0 0V10" id="censor-g0_15" stroke="var(--stroke-0, #9A3374)" />
          <path d="M0 0V10" id="censor-g1" stroke="var(--stroke-0, #F3BC33)" />
          <path d="M0 0V10" id="censor-g1_2" stroke="var(--stroke-0, #F3BC33)" />
          <path d="M0 0V10" id="censor-g1_3" stroke="var(--stroke-0, #F3BC33)" />
          <path d="M0 0V10" id="censor-g1_4" stroke="var(--stroke-0, #F3BC33)" />
          <path d="M0 0V10" id="censor-g1_5" stroke="var(--stroke-0, #F3BC33)" />
          <path d="M0 0V10" id="censor-g1_6" stroke="var(--stroke-0, #F3BC33)" />
          <path d="M0 0V10" id="censor-g1_7" stroke="var(--stroke-0, #F3BC33)" />
          <path d="M0 0V10" id="censor-g1_8" stroke="var(--stroke-0, #F3BC33)" />
          <path d="M0 0V10" id="censor-g1_9" stroke="var(--stroke-0, #F3BC33)" />
          <path d="M0 0V10" id="censor-g1_10" stroke="var(--stroke-0, #F3BC33)" />
          <path d="M0 0V10" id="censor-g1_11" stroke="var(--stroke-0, #F3BC33)" />
          <path d="M0 0V10" id="censor-g1_12" stroke="var(--stroke-0, #F3BC33)" />
          <path d="M0 0V10" id="censor-g1_13" stroke="var(--stroke-0, #F3BC33)" />
        </g>
        <defs>
          <clipPath id="clip0_4001_374">
            <rect fill="white" height="340" width="800" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function YAxis() {
  return <div className="absolute bg-[#ccc] h-[340px] left-0 top-0 w-px" data-name="Y Axis" />;
}

function XAxis() {
  return <div className="absolute bg-[#ccc] h-px left-0 top-[340px] w-[800px]" data-name="X Axis" />;
}

function Legend() {
  return (
    <div className="absolute h-[48px] left-[680px] top-[12px] w-[110px]" data-name="Legend">
      <div className="absolute bg-[#9a3374] h-[2px] left-0 top-[9px] w-[16px]" data-name="leg-line-g0" />
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[22px] not-italic text-[#333] text-[10px] top-[4px] whitespace-nowrap">Group A</p>
      <div className="absolute bg-[#f3bc33] h-[2px] left-0 top-[29px] w-[16px]" data-name="leg-line-g1" />
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[22px] not-italic text-[#333] text-[10px] top-[24px] whitespace-nowrap">Group B</p>
    </div>
  );
}

function PlotArea() {
  return (
    <div className="absolute h-[340px] left-[60px] top-[70px] w-[800px]" data-name="Plot Area">
      <GridLines />
      <KmCurves />
      <CensorMarks />
      <YAxis />
      <XAxis />
      <div className="absolute bg-[#ccc] h-px left-[-5px] top-[340px] w-[5px]" data-name="y-tick" />
      <p className="-translate-x-full [word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal h-[13px] leading-[normal] left-[-6px] not-italic text-[#666] text-[9px] text-right top-[334px] w-[52px]">0%</p>
      <div className="absolute bg-[#ccc] h-px left-[-5px] top-[272px] w-[5px]" data-name="y-tick" />
      <p className="-translate-x-full [word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal h-[13px] leading-[normal] left-[-6px] not-italic text-[#666] text-[9px] text-right top-[266px] w-[52px]">20%</p>
      <div className="absolute bg-[#ccc] h-px left-[-5px] top-[204px] w-[5px]" data-name="y-tick" />
      <p className="-translate-x-full [word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal h-[13px] leading-[normal] left-[-6px] not-italic text-[#666] text-[9px] text-right top-[198px] w-[52px]">40%</p>
      <div className="absolute bg-[#ccc] h-px left-[-5px] top-[136px] w-[5px]" data-name="y-tick" />
      <p className="-translate-x-full [word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal h-[13px] leading-[normal] left-[-6px] not-italic text-[#666] text-[9px] text-right top-[130px] w-[52px]">60%</p>
      <div className="absolute bg-[#ccc] h-px left-[-5px] top-[68px] w-[5px]" data-name="y-tick" />
      <p className="-translate-x-full [word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal h-[13px] leading-[normal] left-[-6px] not-italic text-[#666] text-[9px] text-right top-[62px] w-[52px]">80%</p>
      <div className="absolute bg-[#ccc] h-px left-[-5px] top-0 w-[5px]" data-name="y-tick" />
      <p className="-translate-x-full [word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal h-[13px] leading-[normal] left-[-6px] not-italic text-[#666] text-[9px] text-right top-[-6px] w-[52px]">100%</p>
      <div className="absolute bg-[#ccc] h-[4px] left-0 top-[340px] w-px" data-name="x-tick" />
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[-10px] not-italic text-[#666] text-[9px] top-[348px] whitespace-nowrap">0</p>
      <div className="absolute bg-[#ccc] h-[4px] left-[133.33px] top-[340px] w-px" data-name="x-tick" />
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[123.33px] not-italic text-[#666] text-[9px] top-[348px] whitespace-nowrap">17</p>
      <div className="absolute bg-[#ccc] h-[4px] left-[266.67px] top-[340px] w-px" data-name="x-tick" />
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[256.67px] not-italic text-[#666] text-[9px] top-[348px] whitespace-nowrap">33</p>
      <div className="absolute bg-[#ccc] h-[4px] left-[400px] top-[340px] w-px" data-name="x-tick" />
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[390px] not-italic text-[#666] text-[9px] top-[348px] whitespace-nowrap">50</p>
      <div className="absolute bg-[#ccc] h-[4px] left-[533.33px] top-[340px] w-px" data-name="x-tick" />
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[523.33px] not-italic text-[#666] text-[9px] top-[348px] whitespace-nowrap">66</p>
      <div className="absolute bg-[#ccc] h-[4px] left-[666.67px] top-[340px] w-px" data-name="x-tick" />
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[656.67px] not-italic text-[#666] text-[9px] top-[348px] whitespace-nowrap">83</p>
      <div className="absolute bg-[#ccc] h-[4px] left-[800px] top-[340px] w-px" data-name="x-tick" />
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[790px] not-italic text-[#666] text-[9px] top-[348px] whitespace-nowrap">99</p>
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[360px] not-italic text-[#333] text-[11px] top-[368px] whitespace-nowrap">Time (Months)</p>
      <div className="absolute flex h-[100px] items-center justify-center left-[-67px] top-[230px] w-[13px]">
        <div className="flex-none rotate-90">
          <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative text-[#333] text-[11px] whitespace-nowrap">Survival Probability</p>
        </div>
      </div>
      <Legend />
    </div>
  );
}

function RiskTable() {
  return (
    <div className="absolute h-[88px] left-0 top-[476px] w-[900px]" data-name="Risk Table">
      <div className="absolute bg-[#ccc] h-px left-[60px] top-0 w-[800px]" data-name="rt-sep" />
      <p className="-translate-x-full [word-break:break-word] absolute font-['Inter:Bold',sans-serif] font-bold h-[13px] leading-[normal] left-[56px] not-italic text-[#333] text-[9px] text-right top-[8px] w-[56px]">Number at risk</p>
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal h-[12px] leading-[normal] left-[60px] not-italic text-[#666] text-[8px] text-center top-[8px] w-[20px]">0</p>
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal h-[12px] leading-[normal] left-[193.33px] not-italic text-[#666] text-[8px] text-center top-[8px] w-[20px]">17</p>
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal h-[12px] leading-[normal] left-[326.67px] not-italic text-[#666] text-[8px] text-center top-[8px] w-[20px]">33</p>
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal h-[12px] leading-[normal] left-[460px] not-italic text-[#666] text-[8px] text-center top-[8px] w-[20px]">50</p>
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal h-[12px] leading-[normal] left-[593.33px] not-italic text-[#666] text-[8px] text-center top-[8px] w-[20px]">66</p>
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal h-[12px] leading-[normal] left-[726.67px] not-italic text-[#666] text-[8px] text-center top-[8px] w-[20px]">83</p>
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal h-[12px] leading-[normal] left-[860px] not-italic text-[#666] text-[8px] text-center top-[8px] w-[20px]">99</p>
      <p className="-translate-x-full [word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal h-[13px] leading-[normal] left-[56px] not-italic text-[#9a3374] text-[9px] text-right top-[38px] w-[56px]">Group A</p>
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal h-[13px] leading-[normal] left-[60px] not-italic text-[#9a3374] text-[9px] text-center top-[38px] w-[20px]">50</p>
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal h-[13px] leading-[normal] left-[193.33px] not-italic text-[#9a3374] text-[9px] text-center top-[38px] w-[20px]">39</p>
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal h-[13px] leading-[normal] left-[326.67px] not-italic text-[#9a3374] text-[9px] text-center top-[38px] w-[20px]">32</p>
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal h-[13px] leading-[normal] left-[460px] not-italic text-[#9a3374] text-[9px] text-center top-[38px] w-[20px]">21</p>
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal h-[13px] leading-[normal] left-[593.33px] not-italic text-[#9a3374] text-[9px] text-center top-[38px] w-[20px]">16</p>
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal h-[13px] leading-[normal] left-[726.67px] not-italic text-[#9a3374] text-[9px] text-center top-[38px] w-[20px]">11</p>
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal h-[13px] leading-[normal] left-[860px] not-italic text-[#9a3374] text-[9px] text-center top-[38px] w-[20px]">10</p>
      <p className="-translate-x-full [word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal h-[13px] leading-[normal] left-[56px] not-italic text-[#f3bc33] text-[9px] text-right top-[66px] w-[56px]">Group B</p>
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal h-[13px] leading-[normal] left-[60px] not-italic text-[#f3bc33] text-[9px] text-center top-[66px] w-[20px]">45</p>
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal h-[13px] leading-[normal] left-[193.33px] not-italic text-[#f3bc33] text-[9px] text-center top-[66px] w-[20px]">30</p>
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal h-[13px] leading-[normal] left-[326.67px] not-italic text-[#f3bc33] text-[9px] text-center top-[66px] w-[20px]">28</p>
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal h-[13px] leading-[normal] left-[460px] not-italic text-[#f3bc33] text-[9px] text-center top-[66px] w-[20px]">24</p>
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal h-[13px] leading-[normal] left-[593.33px] not-italic text-[#f3bc33] text-[9px] text-center top-[66px] w-[20px]">20</p>
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal h-[13px] leading-[normal] left-[726.67px] not-italic text-[#f3bc33] text-[9px] text-center top-[66px] w-[20px]">17</p>
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal h-[13px] leading-[normal] left-[860px] not-italic text-[#f3bc33] text-[9px] text-center top-[66px] w-[20px]">14</p>
    </div>
  );
}

function KmPlot() {
  return (
    <div className="bg-white h-[564px] overflow-clip relative shrink-0 w-full" data-name="KM Plot">
      <TitleArea />
      <PlotArea />
      <RiskTable />
    </div>
  );
}

function ViewToggleButton() {
  return (
    <div className="h-full relative shrink-0" data-name="View Toggle Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[16px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic relative shrink-0 text-[#3c4242] text-[14px] text-center whitespace-nowrap">Basic info</p>
        </div>
      </div>
    </div>
  );
}

function ViewToggleButtonActive() {
  return (
    <div className="h-full relative shrink-0" data-name="View Toggle Button Active">
      <div aria-hidden className="absolute border-[#830051] border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[16px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic relative shrink-0 text-[#830051] text-[14px] text-center whitespace-nowrap">Components</p>
        </div>
      </div>
    </div>
  );
}

function ViewToggleContainer1() {
  return (
    <div className="content-stretch flex h-[40px] items-center justify-center relative shrink-0" data-name="View Toggle Container">
      <ViewToggleButton />
      <ViewToggleButtonActive />
    </div>
  );
}

function ToolBar1() {
  return (
    <div className="content-stretch flex h-full items-center justify-end relative shrink-0" data-name="Tool bar">
      <div className="overflow-clip relative rounded-[4px] shrink-0 size-[24px]" data-name="Icon button">
        <div className="absolute inset-[16.67%] overflow-clip" data-name="Tool call/edit-2-line">
          <div className="absolute inset-[12.16%_12.5%_12.96%_12.5%]" data-name="Vector">
            <svg className="absolute block inset-0 size-full" fill="none" height="11.9804" preserveAspectRatio="none" viewBox="0 0 12 11.9804" width="12">
              <path d={svgPaths.p243c4800} fill="var(--fill-0, #888E8E)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function TopBar1() {
  return (
    <div className="bg-white h-[40px] relative shrink-0 w-full" data-name="Top Bar">
      <div aria-hidden className="absolute border-[#d8dada] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-between pr-[8px] relative size-full">
          <ViewToggleContainer1 />
          <ToolBar1 />
        </div>
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="relative shrink-0" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#3c4242] text-[12px] whitespace-nowrap">0/8 Confirmed</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] items-center relative size-full">
        <Paragraph />
        <div className="relative shrink-0 size-[16px]" data-name="Checkbox-Square">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
            <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[16px] top-1/2" data-name="Outer">
              <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
                <path d={svgPaths.p8e46280} fill="var(--fill-0, #888E8E)" id="Outer" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="bg-[#f8f7f7] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex items-center justify-end px-[12px] py-[8px] relative size-full">
          <Container1 />
        </div>
      </div>
    </div>
  );
}

function LeftSidebar() {
  return (
    <div className="content-stretch flex flex-col h-full items-start relative shrink-0 w-[140px] z-[2]" data-name="Left Sidebar">
      <div aria-hidden className="absolute border-[#ebecec] border-r border-solid inset-0 pointer-events-none" />
      <div className="bg-[#f4e8ee] min-w-[90px] relative shrink-0 w-full" data-name="KM Plot Chart">
        <div aria-hidden className="absolute border-[#830051] border-l-3 border-solid inset-0 pointer-events-none" />
        <div className="flex flex-row items-center min-w-[inherit] size-full">
          <div className="content-stretch flex items-center min-w-[inherit] pl-[8px] pr-[12px] py-[8px] relative size-full">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[18px] min-w-px not-italic overflow-hidden relative text-[#830051] text-[12px] text-ellipsis whitespace-nowrap">KM Plot Chart</p>
          </div>
        </div>
      </div>
      <div className="content-stretch flex items-center min-w-[90px] pl-[8px] pr-[12px] py-[8px] relative shrink-0 w-[141px]" data-name="Number at Risk Table">
        <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[18px] min-w-px not-italic overflow-hidden relative text-[#3c4242] text-[12px] text-ellipsis whitespace-nowrap">Number at Risk Table</p>
      </div>
    </div>
  );
}

function Block1Heading() {
  return (
    <div className="content-stretch flex items-start pb-[8px] relative shrink-0 w-full" data-name="Block 1 Heading">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#3c4242] text-[13px] whitespace-nowrap">KM Plot Chart</p>
    </div>
  );
}

function Label() {
  return (
    <div className="relative shrink-0" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#3c4242] text-[12px] whitespace-nowrap">
          <span className="leading-[20px] text-[#cc2c3c]">*</span>
          <span className="leading-[20px]">{` Component Label`}</span>
        </p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Label />
      <div className="relative shrink-0 size-[16px]" data-name="Checkbox-Square">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[16px] top-1/2" data-name="Outer">
            <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
              <path d={svgPaths.p8e46280} fill="var(--fill-0, #888E8E)" id="Outer" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-white h-[32px] relative rounded-[2px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center px-[8px] py-[4px] relative size-full">
          <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[20px] min-w-px not-italic relative text-[#3c4242] text-[12px]">KM Plot Chart</p>
        </div>
      </div>
      <div aria-hidden className="absolute border-[#888e8e] border-[0.6px] border-solid inset-0 pointer-events-none rounded-[2px]" />
    </div>
  );
}

function Label1() {
  return (
    <div className="relative shrink-0" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#3c4242] text-[12px] whitespace-nowrap">
          <span className="leading-[20px] text-[#cc2c3c]">*</span>
          <span className="leading-[20px]">{` Component Type`}</span>
        </p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Label1 />
      <div className="relative shrink-0 size-[16px]" data-name="Checkbox-Square">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[16px] top-1/2" data-name="Outer">
            <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
              <path d={svgPaths.p8e46280} fill="var(--fill-0, #888E8E)" id="Outer" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input1() {
  return (
    <div className="bg-white h-[32px] relative rounded-[2px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center px-[8px] py-[4px] relative size-full">
          <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[20px] min-w-px not-italic relative text-[#3c4242] text-[12px]">Chart</p>
        </div>
      </div>
      <div aria-hidden className="absolute border-[#888e8e] border-[0.6px] border-solid inset-0 pointer-events-none rounded-[2px]" />
    </div>
  );
}

function Label2() {
  return (
    <div className="relative shrink-0" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#3c4242] text-[12px] whitespace-nowrap">
          <span className="leading-[20px] text-[#cc2c3c]">*</span>
          <span className="leading-[20px]">{` Source Dataset(s)`}</span>
        </p>
        <div className="content-stretch flex h-[20px] items-center justify-center px-[4px] relative rounded-[4px] shrink-0" data-name="Badge/Status">
          <div aria-hidden className="absolute border border-[#ebecec] border-solid inset-0 pointer-events-none rounded-[4px]" />
          <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#888e8e] text-[13px] whitespace-nowrap">
            <p className="leading-[20px]">AI Infer</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Label2 />
      <div className="relative shrink-0 size-[16px]" data-name="Checkbox-Square">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[16px] top-1/2" data-name="Outer">
            <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
              <path d={svgPaths.p8e46280} fill="var(--fill-0, #888E8E)" id="Outer" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input2() {
  return (
    <div className="bg-white h-[32px] relative rounded-[2px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center px-[8px] py-[4px] relative size-full">
          <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[20px] min-w-px not-italic relative text-[#3c4242] text-[12px]">ADTTTE</p>
        </div>
      </div>
      <div aria-hidden className="absolute border-[#888e8e] border-[0.6px] border-solid inset-0 pointer-events-none rounded-[2px]" />
    </div>
  );
}

function Label3() {
  return (
    <div className="relative shrink-0" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#3c4242] text-[12px] whitespace-nowrap">
          <span className="leading-[20px] text-[#cc2c3c]">*</span>
          <span className="leading-[20px]">{` Source Variable(s)`}</span>
        </p>
        <div className="content-stretch flex h-[20px] items-center justify-center px-[4px] relative rounded-[4px] shrink-0" data-name="Badge/Status">
          <div aria-hidden className="absolute border border-[#ebecec] border-solid inset-0 pointer-events-none rounded-[4px]" />
          <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#888e8e] text-[13px] whitespace-nowrap">
            <p className="leading-[20px]">AI Infer</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Label3 />
      <div className="relative shrink-0 size-[16px]" data-name="Checkbox-Square">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[16px] top-1/2" data-name="Outer">
            <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
              <path d={svgPaths.p8e46280} fill="var(--fill-0, #888E8E)" id="Outer" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input3() {
  return (
    <div className="bg-white h-[32px] relative rounded-[2px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center px-[8px] py-[4px] relative size-full">
          <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[20px] min-w-px not-italic relative text-[#3c4242] text-[12px]">AVAL, CNSR, PARAMCD</p>
        </div>
      </div>
      <div aria-hidden className="absolute border-[#888e8e] border-[0.6px] border-solid inset-0 pointer-events-none rounded-[2px]" />
    </div>
  );
}

function Block() {
  return (
    <div className="relative shrink-0 w-full" data-name="Block 1">
      <div className="content-stretch flex flex-col items-start p-[12px] relative size-full">
        <Block1Heading />
        <div className="bg-white relative shrink-0 w-full" data-name="Component Label">
          <div className="flex flex-col justify-center size-full">
            <div className="content-stretch flex flex-col gap-[3.999px] items-start justify-center px-[12px] py-[8px] relative size-full">
              <Container2 />
              <Input />
            </div>
          </div>
        </div>
        <div className="bg-white relative shrink-0 w-full" data-name="Component Type">
          <div className="flex flex-col justify-center size-full">
            <div className="content-stretch flex flex-col gap-[3.999px] items-start justify-center px-[12px] py-[8px] relative size-full">
              <Container3 />
              <Input1 />
            </div>
          </div>
        </div>
        <div className="bg-white relative shrink-0 w-full" data-name="Source Dataset(s)">
          <div className="flex flex-col justify-center size-full">
            <div className="content-stretch flex flex-col gap-[3.999px] items-start justify-center px-[12px] py-[8px] relative size-full">
              <Container4 />
              <Input2 />
            </div>
          </div>
        </div>
        <div className="bg-white relative shrink-0 w-full" data-name="Source Variable(s)">
          <div className="flex flex-col justify-center size-full">
            <div className="content-stretch flex flex-col gap-[3.999px] items-start justify-center px-[12px] py-[8px] relative size-full">
              <Container5 />
              <Input3 />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Block2Heading() {
  return (
    <div className="content-stretch flex items-start pb-[8px] relative shrink-0 w-full" data-name="Block 2 Heading">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#3c4242] text-[13px] whitespace-nowrap">Number at Risk Table</p>
    </div>
  );
}

function Label4() {
  return (
    <div className="relative shrink-0" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#3c4242] text-[12px] whitespace-nowrap">
          <span className="leading-[20px] text-[#cc2c3c]">*</span>
          <span className="leading-[20px]">{` Component Label`}</span>
        </p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Label4 />
      <div className="relative shrink-0 size-[16px]" data-name="Checkbox-Square">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[16px] top-1/2" data-name="Outer">
            <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
              <path d={svgPaths.p8e46280} fill="var(--fill-0, #888E8E)" id="Outer" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input4() {
  return (
    <div className="bg-white h-[32px] relative rounded-[2px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center px-[8px] py-[4px] relative size-full">
          <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[20px] min-w-px not-italic relative text-[#3c4242] text-[12px]">Number at Risk Table</p>
        </div>
      </div>
      <div aria-hidden className="absolute border-[#888e8e] border-[0.6px] border-solid inset-0 pointer-events-none rounded-[2px]" />
    </div>
  );
}

function Label5() {
  return (
    <div className="relative shrink-0" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#3c4242] text-[12px] whitespace-nowrap">
          <span className="leading-[20px] text-[#cc2c3c]">*</span>
          <span className="leading-[20px]">{` Component Type`}</span>
        </p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Label5 />
      <div className="relative shrink-0 size-[16px]" data-name="Checkbox-Square">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[16px] top-1/2" data-name="Outer">
            <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
              <path d={svgPaths.p8e46280} fill="var(--fill-0, #888E8E)" id="Outer" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input5() {
  return (
    <div className="bg-white h-[32px] relative rounded-[2px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center px-[8px] py-[4px] relative size-full">
          <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[20px] min-w-px not-italic relative text-[#3c4242] text-[12px]">Table</p>
        </div>
      </div>
      <div aria-hidden className="absolute border-[#888e8e] border-[0.6px] border-solid inset-0 pointer-events-none rounded-[2px]" />
    </div>
  );
}

function Label6() {
  return (
    <div className="relative shrink-0" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#3c4242] text-[12px] whitespace-nowrap">
          <span className="leading-[20px] text-[#cc2c3c]">*</span>
          <span className="leading-[20px]">{` Source Dataset(s)`}</span>
        </p>
        <div className="content-stretch flex h-[20px] items-center justify-center px-[4px] relative rounded-[4px] shrink-0" data-name="Badge/Status">
          <div aria-hidden className="absolute border border-[#ebecec] border-solid inset-0 pointer-events-none rounded-[4px]" />
          <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#888e8e] text-[13px] whitespace-nowrap">
            <p className="leading-[20px]">AI Infer</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Label6 />
      <div className="relative shrink-0 size-[16px]" data-name="Checkbox-Square">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[16px] top-1/2" data-name="Outer">
            <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
              <path d={svgPaths.p8e46280} fill="var(--fill-0, #888E8E)" id="Outer" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input6() {
  return (
    <div className="bg-white h-[32px] relative rounded-[2px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center px-[8px] py-[4px] relative size-full">
          <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[20px] min-w-px not-italic relative text-[#3c4242] text-[12px]">ADTTTE</p>
        </div>
      </div>
      <div aria-hidden className="absolute border-[#888e8e] border-[0.6px] border-solid inset-0 pointer-events-none rounded-[2px]" />
    </div>
  );
}

function Label7() {
  return (
    <div className="relative shrink-0" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#3c4242] text-[12px] whitespace-nowrap">
          <span className="leading-[20px] text-[#cc2c3c]">*</span>
          <span className="leading-[20px]">{` Source Variable(s)`}</span>
        </p>
        <div className="bg-[#f6cce2] content-stretch flex h-[20px] items-center justify-center px-[4px] relative rounded-[4px] shrink-0" data-name="Badge/Status">
          <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#cc2c3c] text-[13px] whitespace-nowrap">
            <p className="leading-[20px]">Conflict</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Label7 />
      <div className="relative shrink-0 size-[16px]" data-name="Checkbox-Square">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[16px] top-1/2" data-name="Outer">
            <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
              <path d={svgPaths.p8e46280} fill="var(--fill-0, #888E8E)" id="Outer" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input7() {
  return (
    <div className="bg-white h-[32px] relative rounded-[2px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center px-[8px] py-[4px] relative size-full">
          <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[20px] min-w-px not-italic relative text-[#3c4242] text-[12px]">AVAL, TRTA</p>
        </div>
      </div>
      <div aria-hidden className="absolute border-[#888e8e] border-[0.6px] border-solid inset-0 pointer-events-none rounded-[2px]" />
    </div>
  );
}

function Block1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Block 2">
      <div className="content-stretch flex flex-col items-start p-[12px] relative size-full">
        <Block2Heading />
        <div className="bg-white relative shrink-0 w-full" data-name="Component Label">
          <div className="flex flex-col justify-center size-full">
            <div className="content-stretch flex flex-col gap-[3.999px] items-start justify-center px-[12px] py-[8px] relative size-full">
              <Container6 />
              <Input4 />
            </div>
          </div>
        </div>
        <div className="bg-white relative shrink-0 w-full" data-name="Component Type">
          <div className="flex flex-col justify-center size-full">
            <div className="content-stretch flex flex-col gap-[3.999px] items-start justify-center px-[12px] py-[8px] relative size-full">
              <Container7 />
              <Input5 />
            </div>
          </div>
        </div>
        <div className="bg-white relative shrink-0 w-full" data-name="Source Dataset(s)">
          <div className="flex flex-col justify-center size-full">
            <div className="content-stretch flex flex-col gap-[3.999px] items-start justify-center px-[12px] py-[8px] relative size-full">
              <Container8 />
              <Input6 />
            </div>
          </div>
        </div>
        <div className="bg-white relative shrink-0 w-full" data-name="Source Variable(s)">
          <div className="flex flex-col justify-center size-full">
            <div className="content-stretch flex flex-col gap-[3.999px] items-start justify-center px-[12px] py-[8px] relative size-full">
              <Container9 />
              <Input7 />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentArea() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start min-w-px overflow-clip relative z-[1]" data-name="Content Area">
      <Block />
      <div className="bg-[#ebecec] h-px relative shrink-0 w-full" data-name="Divider" />
      <Block1 />
    </div>
  );
}

function Body() {
  return (
    <div className="content-stretch flex flex-[1_0_0] isolate items-start min-h-px overflow-clip relative w-full" data-name="Body">
      <LeftSidebar />
      <ContentArea />
    </div>
  );
}

function Metadata() {
  return (
    <div className="bg-white flex-[1_0_0] h-full min-w-px relative rounded-[8px]" data-name="Metadata">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <TopBar1 />
        <Container />
        <Body />
      </div>
      <div aria-hidden className="absolute border border-[#ebecec] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_1px_0px_rgba(0,0,0,0.04),0px_3px_8px_-2px_rgba(0,0,0,0.02)]" />
    </div>
  );
}

function MetadataWrap() {
  return (
    <div className="absolute content-stretch flex h-[777px] items-center left-[1012px] pb-[8px] pl-[4px] pr-[8px] pt-[4px] top-[40px] w-[420px]" data-name="Metadata Wrap">
      <Metadata />
    </div>
  );
}

function ShellPreview() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative" data-name="Shell Preview">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <TopBar />
        <KmPlot />
        <MetadataWrap />
      </div>
      <div aria-hidden className="absolute border-[#ebecec] border-r border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function TablePanel() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px overflow-clip relative w-full" data-name="Table panel">
      <ShellPreview />
    </div>
  );
}

function MainContainer() {
  return (
    <div className="bg-white content-stretch drop-shadow-[0px_2px_5px_rgba(0,0,0,0.04)] flex flex-[1_0_0] flex-col h-full items-center min-w-px relative rounded-[12px]" data-name="Main Container">
      <div aria-hidden className="absolute border border-[#ebecec] border-solid inset-[-1px] pointer-events-none rounded-[13px]" />
      <Top />
      <TablePanel />
    </div>
  );
}

export default function MetadataComponents() {
  return (
    <div className="bg-[#f8f7f7] content-stretch flex items-center p-[4px] relative size-full" data-name="Metadata/Components">
      <MainContainer />
    </div>
  );
}