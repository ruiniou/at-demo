import svgPaths from "./svg-4kwbu29fzj";

function Home5Line() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="home-5-line">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="home-5-line">
          <path d={svgPaths.p6b98a80} fill="var(--fill-0, #3C4242)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function CodeAiLine() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="code-ai-line">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="code-ai-line">
          <path d={svgPaths.p261ca8f0} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function SidebarIconContainer() {
  return (
    <div className="bg-[#830051] content-stretch flex items-center justify-center relative rounded-[4px] shrink-0 size-[32px]" data-name="Sidebar Icon Container">
      <CodeAiLine />
    </div>
  );
}

function SidebarVerticalContainer2() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-center justify-center relative shrink-0" data-name="Sidebar Vertical Container">
      <Home5Line />
      <SidebarIconContainer />
    </div>
  );
}

function SidebarVerticalContainer1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[32px] items-center min-h-px relative w-full" data-name="Sidebar Vertical Container">
      <div className="relative shrink-0 size-[24px]" data-name="Union">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <path d={svgPaths.p35783d00} fill="var(--fill-0, #F0AB00)" id="Union" />
        </svg>
      </div>
      <SidebarVerticalContainer2 />
    </div>
  );
}

function UserAccount() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="User account">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="User account">
          <path d={svgPaths.p1199c300} fill="var(--fill-0, #9DB0AC)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function SidebarVerticalContainer() {
  return (
    <div className="bg-white h-full relative shrink-0 w-[48px]" data-name="Sidebar Vertical Container">
      <div aria-hidden="true" className="absolute border-[#e5e8e8] border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-between py-[16px] relative size-full">
          <SidebarVerticalContainer1 />
          <UserAccount />
        </div>
      </div>
    </div>
  );
}

function Slash() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Slash">
      <p className="[word-break:break-word] font-['PingFang_SC:Medium',sans-serif] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#888e8e] text-[12px] text-ellipsis whitespace-nowrap">/</p>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#f8f7f7] content-stretch flex items-start px-[2px] py-[4px] relative rounded-[8px] shrink-0" data-name="Button">
      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#3c4242] text-[12px] text-ellipsis whitespace-nowrap">CSR Interim Analysis</p>
    </div>
  );
}

function MenuTop() {
  return (
    <div className="relative shrink-0 w-full" data-name="Menu top">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[8px] relative size-full">
          <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#888e8e] text-[12px] whitespace-nowrap">Other Events in Study</p>
        </div>
      </div>
    </div>
  );
}

function LabelName() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Label name">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <p className="[word-break:break-word] flex-[1_0_0] font-['PingFang_SC:Regular',sans-serif] leading-[20px] min-w-px not-italic overflow-hidden relative text-[#3c4242] text-[12px] text-ellipsis whitespace-nowrap">Option</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[4px] h-[20px] items-center min-w-px relative" data-name="Container">
      <div className="relative shrink-0 size-[16px]" data-name="Table">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
          <div className="absolute inset-[8.33%]" data-name="Union">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.334 13.334">
              <path d={svgPaths.p3116e600} fill="var(--fill-0, #888E8E)" id="Union" />
            </svg>
          </div>
        </div>
      </div>
      <LabelName />
    </div>
  );
}

function LabelName1() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Label name">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <p className="[word-break:break-word] flex-[1_0_0] font-['PingFang_SC:Regular',sans-serif] leading-[20px] min-w-px not-italic overflow-hidden relative text-[#3c4242] text-[12px] text-ellipsis whitespace-nowrap">Option</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[4px] h-[20px] items-center min-w-px relative" data-name="Container">
      <div className="relative shrink-0 size-[16px]" data-name="Table">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
          <div className="absolute inset-[8.33%]" data-name="Union">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.334 13.334">
              <path d={svgPaths.p3116e600} fill="var(--fill-0, #888E8E)" id="Union" />
            </svg>
          </div>
        </div>
      </div>
      <LabelName1 />
    </div>
  );
}

function LabelName2() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Label name">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <p className="[word-break:break-word] flex-[1_0_0] font-['PingFang_SC:Regular',sans-serif] leading-[20px] min-w-px not-italic overflow-hidden relative text-[#3c4242] text-[12px] text-ellipsis whitespace-nowrap">Option</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[4px] h-[20px] items-center min-w-px relative" data-name="Container">
      <div className="relative shrink-0 size-[16px]" data-name="Table">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
          <div className="absolute inset-[8.33%]" data-name="Union">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.334 13.334">
              <path d={svgPaths.p3116e600} fill="var(--fill-0, #888E8E)" id="Union" />
            </svg>
          </div>
        </div>
      </div>
      <LabelName2 />
    </div>
  );
}

function LabelName3() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Label name">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <p className="[word-break:break-word] flex-[1_0_0] font-['PingFang_SC:Regular',sans-serif] leading-[20px] min-w-px not-italic overflow-hidden relative text-[#3c4242] text-[12px] text-ellipsis whitespace-nowrap">Option</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[4px] h-[20px] items-center min-w-px relative" data-name="Container">
      <div className="relative shrink-0 size-[16px]" data-name="Table">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
          <div className="absolute inset-[8.33%]" data-name="Union">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.334 13.334">
              <path d={svgPaths.p3116e600} fill="var(--fill-0, #888E8E)" id="Union" />
            </svg>
          </div>
        </div>
      </div>
      <LabelName3 />
    </div>
  );
}

function OptionList() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Option list">
      <div className="h-[28px] relative shrink-0 w-full" data-name="Menu Item">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex items-center px-[8px] relative size-full">
            <Container />
          </div>
        </div>
      </div>
      <div className="h-[28px] relative shrink-0 w-full" data-name="Menu Item">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex items-center px-[8px] relative size-full">
            <Container1 />
          </div>
        </div>
      </div>
      <div className="h-[28px] relative shrink-0 w-full" data-name="Menu Item">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex items-center px-[8px] relative size-full">
            <Container2 />
          </div>
        </div>
      </div>
      <div className="h-[28px] relative shrink-0 w-full" data-name="Menu Item">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex items-center px-[8px] relative size-full">
            <Container3 />
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Status Icon">
        <div className="absolute inset-[8.33%]" data-name="Vector (Stroke)">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333">
            <path d={svgPaths.p403bf40} fill="var(--fill-0, #888E8E)" id="Vector (Stroke)" />
          </svg>
        </div>
      </div>
      <div className="content-stretch flex gap-[2px] items-center relative shrink-0" data-name="Bread Crumb">
        <div className="content-stretch flex items-start overflow-clip px-[2px] py-[4px] relative rounded-[8px] shrink-0" data-name="Bread Crumb Button">
          <p className="[word-break:break-word] font-['PingFang_SC:Medium',sans-serif] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#3c4242] text-[12px] text-ellipsis whitespace-nowrap">AZE2001-301</p>
        </div>
        <Slash />
        <div className="content-stretch flex items-start relative shrink-0" data-name="Bread Crumb Button">
          <Button />
          <div className="absolute bg-white content-stretch drop-shadow-[0px_2px_4px_rgba(0,0,0,0.08)] flex flex-col gap-[4px] items-start left-0 py-[6px] rounded-[8px] top-[30px] w-[176px]" data-name="Menu">
            <div aria-hidden="true" className="absolute border border-[#ebecec] border-solid inset-0 pointer-events-none rounded-[8px]" />
            <MenuTop />
            <OptionList />
          </div>
        </div>
      </div>
    </div>
  );
}

function StudyInfoContainer() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Study Info Container">
      <Frame />
      <div className="overflow-clip relative rounded-[4px] shrink-0 size-[24px]" data-name="Icon button">
        <div className="absolute inset-[16.67%] overflow-clip" data-name="information-line">
          <div className="absolute inset-[8.33%]" data-name="Vector">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333">
              <path d={svgPaths.p15215400} fill="var(--fill-0, #888E8E)" id="Vector" />
            </svg>
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
      <div aria-hidden="true" className="absolute border-[#830051] border-b-2 border-solid inset-0 pointer-events-none" />
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

function ViewToggleContainer() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex h-[40px] items-center justify-center left-[calc(50%+0.5px)] top-0" data-name="View Toggle Container">
      <ViewToggleButton />
      <ViewToggleButton1 />
    </div>
  );
}

function TopNav1() {
  return (
    <div className="h-[40px] relative shrink-0 w-full z-[2]" data-name="Top nav">
      <div aria-hidden="true" className="absolute border-[#d8dada] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[206px] items-center px-[12px] relative size-full">
          <StudyInfoContainer />
          <ViewToggleContainer />
        </div>
      </div>
    </div>
  );
}

function SearchLine() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="search-line">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="search-line">
          <path d={svgPaths.p3fd40200} fill="var(--fill-0, #999999)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="Label">
      <SearchLine />
      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#999] text-[12px] whitespace-nowrap">Search</p>
    </div>
  );
}

function SearchBar1() {
  return (
    <div className="bg-[#ebecec] flex-[1_0_0] min-w-px relative rounded-[4px]" data-name="Search bar">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-between p-[4px] relative size-full">
          <Label />
          <div className="overflow-clip relative rounded-[4px] shrink-0 size-[20px]" data-name="Icon button">
            <div className="absolute inset-[16.67%] overflow-clip" data-name="filter-line">
              <div className="absolute inset-[16.67%_12.5%_8.33%_12.5%]" data-name="Vector">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
                  <path d={svgPaths.p24768500} fill="var(--fill-0, #888E8E)" id="Vector" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchBar() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Search bar">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[4px] items-center px-[8px] py-[4px] relative size-full">
          <SearchBar1 />
        </div>
      </div>
    </div>
  );
}

function LabelName4() {
  return (
    <div className="relative shrink-0" data-name="Label name">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#3c4242] text-[12px] text-ellipsis whitespace-nowrap">Program code A</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[4px] h-[20px] items-center min-w-px relative" data-name="Container">
      <div className="relative shrink-0 size-[16px]" data-name="arrow-down-s-line">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
          <div className="absolute inset-[34.26%_23.48%_33.33%_23.48%]" data-name="Vector">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.48527 5.18548">
              <path d={svgPaths.p3cfa0180} fill="var(--fill-0, #888E8E)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <LabelName4 />
    </div>
  );
}

function LabelName5() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Label name">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#3c4242] text-[12px] text-ellipsis whitespace-nowrap">Table name</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[4px] h-[20px] items-center min-w-px relative" data-name="Container">
      <div className="relative shrink-0 size-[16px]" data-name="Table">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
          <div className="absolute inset-[8.33%]" data-name="Union">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.334 13.334">
              <path d={svgPaths.p3116e600} fill="var(--fill-0, #888E8E)" id="Union" />
            </svg>
          </div>
        </div>
      </div>
      <LabelName5 />
    </div>
  );
}

function LabelName6() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Label name">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#3c4242] text-[12px] text-ellipsis text-left whitespace-nowrap">Table name</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[4px] h-[20px] items-center min-w-px relative" data-name="Container">
      <div className="relative shrink-0 size-[16px]" data-name="Table">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
          <div className="absolute inset-[8.33%]" data-name="Union">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.334 13.334">
              <path d={svgPaths.p3116e600} fill="var(--fill-0, #888E8E)" id="Union" />
            </svg>
          </div>
        </div>
      </div>
      <LabelName6 />
    </div>
  );
}

function LabelName7() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Label name">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#3c4242] text-[12px] text-ellipsis whitespace-nowrap">Table name</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[4px] h-[20px] items-center min-w-px relative" data-name="Container">
      <div className="relative shrink-0 size-[16px]" data-name="Table">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
          <div className="absolute inset-[8.33%]" data-name="Union">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.334 13.334">
              <path d={svgPaths.p3116e600} fill="var(--fill-0, #888E8E)" id="Union" />
            </svg>
          </div>
        </div>
      </div>
      <LabelName7 />
    </div>
  );
}

function TableItem() {
  return <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[#f0ab00] left-1/2 rounded-[16777200px] size-[6px] top-1/2" data-name="TableItem" />;
}

function LabelName8() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Label name">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#3c4242] text-[12px] text-ellipsis whitespace-nowrap">Table name</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[4px] h-[20px] items-center min-w-px relative" data-name="Container">
      <div className="relative shrink-0 size-[16px]" data-name="Table">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
          <div className="absolute inset-[8.33%]" data-name="Union">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.334 13.334">
              <path d={svgPaths.p3116e600} fill="var(--fill-0, #888E8E)" id="Union" />
            </svg>
          </div>
        </div>
      </div>
      <LabelName8 />
    </div>
  );
}

function TableItem1() {
  return <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[#cc2c3c] left-1/2 rounded-[16777200px] size-[6px] top-1/2" data-name="TableItem" />;
}

function List() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="List">
      <div className="h-[28px] relative shrink-0 w-full" data-name="Table item">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex items-center justify-between pl-[24px] pr-[12px] relative size-full">
            <Container6 />
          </div>
        </div>
      </div>
      <button className="bg-[#f8f7f7] content-stretch cursor-pointer flex h-[28px] items-center justify-between pl-[24px] pr-[12px] relative shrink-0 w-[180px]" data-name="Table item">
        <Container7 />
        <div className="bg-[#ebecec] overflow-clip relative rounded-[4px] shrink-0 size-[20px]" role="button" tabIndex="0" data-name="Action button">
          <div className="absolute inset-[16.67%] overflow-clip" data-name="Table item/Unlock">
            <div className="absolute inset-[4.17%_8.33%]" data-name="Union">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.1111 12.2222">
                <path clipRule="evenodd" d={svgPaths.p348e9100} fill="var(--fill-0, #888E8E)" fillRule="evenodd" id="Union" />
              </svg>
            </div>
          </div>
        </div>
      </button>
      <div className="content-stretch flex h-[28px] items-center justify-between pl-[24px] pr-[12px] relative shrink-0 w-[180px]" data-name="Table item">
        <Container8 />
        <div className="overflow-clip relative shrink-0 size-[20px]" data-name="Status-dot">
          <TableItem />
        </div>
      </div>
      <div className="content-stretch flex h-[28px] items-center justify-between pl-[24px] pr-[12px] relative shrink-0 w-[180px]" data-name="Table item">
        <Container9 />
        <div className="overflow-clip relative shrink-0 size-[20px]" data-name="Status-dot">
          <TableItem1 />
        </div>
      </div>
    </div>
  );
}

function Category() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-full" data-name="Category">
      <div className="h-[28px] relative shrink-0 w-full" data-name="Table item">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[38.742px] items-center px-[12px] relative size-full">
            <Container5 />
          </div>
        </div>
      </div>
      <List />
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <Category />
    </div>
  );
}

function LabelName9() {
  return (
    <div className="relative shrink-0" data-name="Label name">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#b2b4b4] text-[12px] text-ellipsis whitespace-nowrap">Program code</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[4px] h-[20px] items-center min-w-px relative" data-name="Container">
      <div className="relative shrink-0 size-[16px]" data-name="arrow-down-s-line">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
          <div className="absolute inset-[34.26%_23.48%_33.33%_23.48%]" data-name="Vector">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.48527 5.18548">
              <path d={svgPaths.p3cfa0180} fill="var(--fill-0, #B2B4B4)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <LabelName9 />
    </div>
  );
}

function LabelName10() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Label name">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#b2b4b4] text-[12px] text-ellipsis whitespace-nowrap">Table name</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[4px] h-[20px] items-center min-w-px relative" data-name="Container">
      <div className="relative shrink-0 size-[16px]" data-name="Table">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
          <div className="absolute inset-[8.33%]" data-name="Union">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.334 13.334">
              <path d={svgPaths.p3116e600} fill="var(--fill-0, #B2B4B4)" id="Union" />
            </svg>
          </div>
        </div>
      </div>
      <LabelName10 />
    </div>
  );
}

function LabelName11() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Label name">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#b2b4b4] text-[12px] text-ellipsis whitespace-nowrap">Table name</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[4px] h-[20px] items-center min-w-px relative" data-name="Container">
      <div className="relative shrink-0 size-[16px]" data-name="Table">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
          <div className="absolute inset-[8.33%]" data-name="Union">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.334 13.334">
              <path d={svgPaths.p3116e600} fill="var(--fill-0, #B2B4B4)" id="Union" />
            </svg>
          </div>
        </div>
      </div>
      <LabelName11 />
    </div>
  );
}

function LabelName12() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Label name">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#b2b4b4] text-[12px] text-ellipsis whitespace-nowrap">Table name</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[4px] h-[20px] items-center min-w-px relative" data-name="Container">
      <div className="relative shrink-0 size-[16px]" data-name="Table">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
          <div className="absolute inset-[8.33%]" data-name="Union">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.334 13.334">
              <path d={svgPaths.p3116e600} fill="var(--fill-0, #B2B4B4)" id="Union" />
            </svg>
          </div>
        </div>
      </div>
      <LabelName12 />
    </div>
  );
}

function LabelName13() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Label name">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#b2b4b4] text-[12px] text-ellipsis whitespace-nowrap">Table name</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[4px] h-[20px] items-center min-w-px relative" data-name="Container">
      <div className="relative shrink-0 size-[16px]" data-name="Table">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
          <div className="absolute inset-[8.33%]" data-name="Union">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.334 13.334">
              <path d={svgPaths.p3116e600} fill="var(--fill-0, #B2B4B4)" id="Union" />
            </svg>
          </div>
        </div>
      </div>
      <LabelName13 />
    </div>
  );
}

function List1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="List">
      <div className="content-stretch flex h-[28px] items-center justify-between pl-[24px] pr-[12px] relative shrink-0 w-[180px]" data-name="Table item">
        <Container12 />
        <div className="overflow-clip relative rounded-[4px] shrink-0 size-[20px]" data-name="Action button">
          <div className="absolute inset-[16.67%] overflow-clip" data-name="Table item/Lock">
            <div className="absolute inset-[4.17%_8.33%]" data-name="Union">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.1111 12.2222">
                <path clipRule="evenodd" d={svgPaths.p28893d00} fill="var(--fill-0, #888E8E)" fillRule="evenodd" id="Union" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="content-stretch flex h-[28px] items-center justify-between pl-[24px] pr-[12px] relative shrink-0 w-[180px]" data-name="Table item">
        <Container13 />
        <div className="overflow-clip relative rounded-[4px] shrink-0 size-[20px]" data-name="Action button">
          <div className="absolute inset-[16.67%] overflow-clip" data-name="Table item/Lock">
            <div className="absolute inset-[4.17%_8.33%]" data-name="Union">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.1111 12.2222">
                <path clipRule="evenodd" d={svgPaths.p28893d00} fill="var(--fill-0, #888E8E)" fillRule="evenodd" id="Union" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="content-stretch flex h-[28px] items-center justify-between pl-[24px] pr-[12px] relative shrink-0 w-[180px]" data-name="Table item">
        <Container14 />
        <div className="overflow-clip relative rounded-[4px] shrink-0 size-[20px]" data-name="Action button">
          <div className="absolute inset-[16.67%] overflow-clip" data-name="Table item/Lock">
            <div className="absolute inset-[4.17%_8.33%]" data-name="Union">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.1111 12.2222">
                <path clipRule="evenodd" d={svgPaths.p28893d00} fill="var(--fill-0, #888E8E)" fillRule="evenodd" id="Union" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="content-stretch flex h-[28px] items-center justify-between pl-[24px] pr-[12px] relative shrink-0 w-[180px]" data-name="Table item">
        <Container15 />
        <div className="overflow-clip relative rounded-[4px] shrink-0 size-[20px]" data-name="Action button">
          <div className="absolute inset-[16.67%] overflow-clip" data-name="Table item/Lock">
            <div className="absolute inset-[4.17%_8.33%]" data-name="Union">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.1111 12.2222">
                <path clipRule="evenodd" d={svgPaths.p28893d00} fill="var(--fill-0, #888E8E)" fillRule="evenodd" id="Union" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Category1() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0" data-name="Category">
      <div className="content-stretch flex h-[28px] items-center justify-between px-[12px] relative shrink-0 w-[180px]" data-name="Table item">
        <Container11 />
        <div className="overflow-clip relative rounded-[4px] shrink-0 size-[20px]" data-name="Action button">
          <div className="absolute inset-[16.67%] overflow-clip" data-name="Table item/Lock">
            <div className="absolute inset-[4.17%_8.33%]" data-name="Union">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.1111 12.2222">
                <path clipRule="evenodd" d={svgPaths.p28893d00} fill="var(--fill-0, #888E8E)" fillRule="evenodd" id="Union" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <List1 />
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <Category1 />
    </div>
  );
}

function TreeList() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Tree list">
      <div className="content-stretch flex flex-col gap-[12px] items-start py-[8px] relative size-full">
        <Container4 />
        <Container10 />
      </div>
    </div>
  );
}

function SidebarIconContainer1() {
  return (
    <div className="content-stretch flex flex-col h-full items-center relative shrink-0 w-[180px]" data-name="Sidebar Icon Container">
      <div aria-hidden="true" className="absolute border-[#d8dada] border-r-[0.6px] border-solid inset-[0_-0.6px_0_0] pointer-events-none" />
      <SearchBar />
      <TreeList />
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[781px] relative shrink-0 w-full" data-name="Container">
      <p className="[word-break:break-word] absolute font-['PingFang_SC:Regular',sans-serif] h-[207px] leading-[45px] left-[74px] not-italic text-[36px] text-black top-[203px] w-[201px]">Shell Preview</p>
    </div>
  );
}

function Container16() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <Container17 />
      </div>
      <div aria-hidden="true" className="absolute border-[#e5e8e8] border-r border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function SecondaryButton() {
  return (
    <div className="bg-[#f4e8ee] content-stretch flex gap-[4px] h-[20px] items-center justify-center px-[6px] relative rounded-[2px] shrink-0" data-name="Secondary-button">
      <div className="overflow-clip relative shrink-0 size-[14px]" data-name="Save Icon">
        <div className="absolute inset-[12.5%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
            <path d={svgPaths.p2b029080} fill="var(--fill-0, #830051)" id="Vector" />
          </svg>
        </div>
      </div>
      <div className="[word-break:break-word] flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#830051] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[18px]">Save</p>
      </div>
    </div>
  );
}

function ToolBar() {
  return (
    <div className="content-stretch flex gap-[8px] h-full items-center justify-end relative shrink-0 w-[156px]" data-name="Tool bar">
      <SecondaryButton />
      <div className="relative shrink-0 size-[16px]" data-name="History Icon">
        <div className="absolute inset-[8.33%_8.34%_8.34%_8.33%]" data-name="路径">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.333 13.333">
            <path d={svgPaths.p28fa4580} fill="var(--fill-0, #3C4242)" id="è·¯å¾" />
          </svg>
        </div>
      </div>
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="More Icon">
        <div className="absolute inset-[43.75%_12.5%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 2">
            <path d={svgPaths.p2bac9d80} fill="var(--fill-0, #3C4242)" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function TopBar() {
  return (
    <div className="bg-white h-[32px] relative shrink-0 w-full" data-name="Top Bar">
      <div aria-hidden="true" className="absolute border-[#d8dada] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex items-center justify-end pl-[20px] pr-[16px] relative size-full">
          <ToolBar />
        </div>
      </div>
    </div>
  );
}

function CodePanel() {
  return (
    <div className="content-stretch flex flex-col h-full items-end relative shrink-0 w-[544px]" data-name="Code panel">
      <div aria-hidden="true" className="absolute border-[#d8dada] border-r-[0.6px] border-solid inset-0 pointer-events-none" />
      <TopBar />
      <p className="[word-break:break-word] absolute font-['PingFang_SC:Regular',sans-serif] h-[207px] leading-[45px] left-[200px] not-italic text-[36px] text-black top-[200px] w-[201px]">Code</p>
    </div>
  );
}

function AgentChatHeader() {
  return (
    <div className="bg-[#f8f8f8] h-[32px] relative shrink-0 w-full" data-name="Agent chat header">
      <div aria-hidden="true" className="absolute border-[#d8dada] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex items-baseline justify-between px-[16px] py-[8px] relative size-full">
          <div className="relative shrink-0 size-[16px]" data-name="Union">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
              <path d={svgPaths.p3c1c2700} fill="url(#paint0_linear_32_638)" id="Union" />
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_32_638" x1="6" x2="16" y1="7.45058e-08" y2="16">
                  <stop stopColor="#0A9EED" />
                  <stop offset="0.254811" stopColor="#3B6FFF" />
                  <stop offset="0.64424" stopColor="#D452FF" />
                  <stop offset="1" stopColor="#ECB2FF" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Close Icon">
            <div className="absolute inset-[23.49%_23.48%_23.48%_23.48%]" data-name="Vector">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.48531 8.48525">
                <path d={svgPaths.pd28a400} fill="var(--fill-0, #9DB0AC)" id="Vector" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatArea() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px overflow-clip relative w-[360px]" data-name="Chat area">
      <p className="[word-break:break-word] absolute font-['PingFang_SC:Regular',sans-serif] h-[207px] leading-[45px] left-[137px] not-italic text-[36px] text-black top-[216px] w-[201px]">{`AI `}</p>
    </div>
  );
}

function AgentPanel() {
  return (
    <div className="bg-white content-stretch flex flex-col h-full items-start relative shrink-0" data-name="Agent panel">
      <AgentChatHeader />
      <ChatArea />
    </div>
  );
}

function TablePanel() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px relative w-[1212px]" data-name="Table panel">
      <Container16 />
      <CodePanel />
      <AgentPanel />
    </div>
  );
}

function MainContainer() {
  return (
    <div className="content-stretch flex flex-col h-full items-center relative shrink-0" data-name="Main Container">
      <TablePanel />
    </div>
  );
}

function EventArea() {
  return (
    <div className="content-stretch flex h-[833px] items-start relative shrink-0 w-full z-[1]" data-name="Event area">
      <SidebarIconContainer1 />
      <MainContainer />
    </div>
  );
}

function MainArea() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-w-px relative" data-name="Main area">
      <TopNav1 />
      <EventArea />
    </div>
  );
}

function Heading() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Heading">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <div className="overflow-clip relative shrink-0 size-[20px]" data-name="AI thinking status/error-warning-line">
          <div className="absolute inset-[8.33%]" data-name="Vector">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6667 16.6667">
              <path d={svgPaths.pa354180} fill="var(--fill-0, #F0AB00)" id="Vector" />
            </svg>
          </div>
        </div>
        <p className="[word-break:break-word] font-['PingFang_SC:Semibold',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#3c4242] text-[16px] w-[192px]">Locked by Program code</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="h-[65px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e8e8] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pb-[17px] pt-[16px] px-[24px] relative size-full">
          <Heading />
          <div className="relative rounded-[4px] shrink-0 size-[24px]" data-name="Icon button">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
              <div className="absolute inset-[16.67%] overflow-clip" data-name="close-line">
                <div className="absolute inset-[23.49%_23.48%_23.48%_23.48%]" data-name="Vector">
                  <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.48531 8.48525">
                    <path d={svgPaths.pd28a400} fill="var(--fill-0, #888E8E)" id="Vector" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start px-[24px] py-[20px] relative size-full">
        <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#666] text-[14px] w-full">This table is locked because its parent program code is locked.</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e8e8] border-solid border-t inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex gap-[12px] items-center justify-end pb-[20px] pt-[21px] px-[24px] relative size-full">
          <div className="bg-white h-[36px] relative rounded-[4px] shrink-0" data-name="Secondary-Button">
            <div aria-hidden="true" className="absolute border-[#d8dada] border-[0.6px] border-solid inset-0 pointer-events-none rounded-[4px]" />
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center px-[12px] py-[8px] relative size-full">
              <div className="[word-break:break-word] flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3c4242] text-[14px] whitespace-nowrap">
                <p className="leading-[20px]">Cancel</p>
              </div>
            </div>
          </div>
          <div className="bg-[#830051] relative rounded-[4px] shrink-0" data-name="Primary-Button">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center px-[12px] py-[8px] relative size-full">
              <div className="[word-break:break-word] flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">
                <p className="leading-[20px]">Unlock Program Code</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TopNav() {
  return (
    <div className="bg-white content-stretch flex items-center relative size-full" data-name="Top nav">
      <SidebarVerticalContainer />
      <MainArea />
      <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-white content-stretch drop-shadow-[0px_4px_6px_rgba(0,0,0,0.15)] flex flex-col items-start left-1/2 rounded-[8px] top-[calc(50%+0.5px)] w-[400px]" data-name="Modal">
        <Container18 />
        <Container19 />
        <Container20 />
      </div>
    </div>
  );
}