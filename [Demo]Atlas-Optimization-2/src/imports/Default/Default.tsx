import svgPaths from "./svg-jq41wrqlb5";

function HomeButton() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Home button">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Home button">
          <path d={svgPaths.p2ffd9c00} fill="var(--fill-0, #F0AB00)" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
      <p className="[word-break:break-word] font-['PingFang_SC:Medium',sans-serif] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#3c4242] text-[12px] text-ellipsis whitespace-nowrap">AZE2001-301</p>
      <div className="overflow-clip relative shrink-0 size-[14px]" data-name="Event-Status">
        <div className="absolute inset-[12.5%]" data-name="Union">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
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

function Frame() {
  return (
    <div className="flex-[1_0_0] min-w-px relative">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Frame1 />
        <div className="[word-break:break-word] flex flex-col font-['PingFang_SC:Regular',sans-serif] h-[15px] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[#888e8e] text-[10px] text-ellipsis w-full whitespace-nowrap">
          <p className="leading-[20px] overflow-hidden text-ellipsis">CSR Interim Analysis</p>
        </div>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative rounded-[4px]" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center py-[4px] relative size-full">
          <Frame />
          <div className="relative rounded-[4px] shrink-0 size-[24px]" data-name="Icon button">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
              <div className="absolute inset-[16.67%] overflow-clip" data-name="information-line">
                <div className="absolute inset-[8.33%]" data-name="Vector">
                  <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333">
                    <path d={svgPaths.p15215400} fill="var(--fill-0, #888E8E)" id="Vector" />
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

function Container() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Container">
      <div aria-hidden className="absolute border-[#d8dada] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center pb-[0.6px] px-[10px] relative size-full">
          <HomeButton />
          <Button />
          <div className="relative rounded-[4px] shrink-0 size-[24px]" data-name="Icon button">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
              <div className="absolute inset-[16.67%] overflow-clip" data-name="Icon-collapse">
                <div className="absolute inset-[8.33%]" data-name="Union">
                  <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333">
                    <path d={svgPaths.p29a4c000} fill="var(--fill-0, #888E8E)" id="Union" />
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

function SidebarHeader() {
  return (
    <div className="content-stretch flex flex-col h-[48px] items-start relative shrink-0 w-full" data-name="SidebarHeader">
      <Container />
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

function LabelName() {
  return (
    <div className="relative shrink-0" data-name="Label name">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#3c4242] text-[12px] text-ellipsis whitespace-nowrap">Program code A</p>
      </div>
    </div>
  );
}

function Container2() {
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
      <LabelName />
    </div>
  );
}

function LabelName1() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Label name">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#3c4242] text-[12px] text-ellipsis whitespace-nowrap">Table name</p>
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
      <LabelName1 />
    </div>
  );
}

function LabelName2() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Label name">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#3c4242] text-[12px] text-ellipsis whitespace-nowrap">Table name</p>
      </div>
    </div>
  );
}

function Container4() {
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
        <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#3c4242] text-[12px] text-ellipsis whitespace-nowrap">Table name</p>
      </div>
    </div>
  );
}

function Container5() {
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

function TableItem() {
  return <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[#f0ab00] left-1/2 rounded-[16777200px] size-[6px] top-1/2" data-name="TableItem" />;
}

function LabelName4() {
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
      <LabelName4 />
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
            <Container3 />
          </div>
        </div>
      </div>
      <div className="h-[28px] relative shrink-0 w-full" data-name="Table item">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex items-center justify-between pl-[24px] pr-[12px] relative size-full">
            <Container4 />
          </div>
        </div>
      </div>
      <div className="h-[28px] relative shrink-0 w-full" data-name="Table item">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex items-center justify-between pl-[24px] pr-[12px] relative size-full">
            <Container5 />
            <div className="overflow-clip relative shrink-0 size-[20px]" data-name="Code-Status">
              <TableItem />
            </div>
          </div>
        </div>
      </div>
      <div className="h-[28px] relative shrink-0 w-full" data-name="Table item">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex items-center justify-between pl-[24px] pr-[12px] relative size-full">
            <Container6 />
            <div className="overflow-clip relative shrink-0 size-[20px]" data-name="Code-Status">
              <TableItem1 />
            </div>
          </div>
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
            <Container2 />
          </div>
        </div>
      </div>
      <List />
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <Category />
    </div>
  );
}

function UserAccount() {
  return (
    <div className="relative shrink-0 w-full" data-name="User account">
      <div aria-hidden className="absolute border-[#d8dada] border-solid border-t-[0.6px] inset-0 pointer-events-none" />
      <div className="flex flex-row items-end size-full">
        <div className="content-stretch flex gap-[8px] items-end px-[12px] py-[16px] relative size-full">
          <div className="relative shrink-0 size-[28px]" data-name="Vector">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
              <path d={svgPaths.pc390800} fill="var(--fill-0, #9DB0AC)" id="Vector" />
            </svg>
          </div>
          <div className="[word-break:break-word] flex flex-col font-['PingFang_SC:Regular',sans-serif] h-full justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black w-[146px]">
            <p className="leading-[20px]">User account</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TreeList() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Tree list">
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-between pt-[8px] relative size-full">
          <Container1 />
          <UserAccount />
        </div>
      </div>
    </div>
  );
}

function SidebarIconContainer() {
  return (
    <div className="bg-[#f8f7f7] content-stretch flex flex-col h-full items-center relative shrink-0 w-[240px] z-[2]" data-name="Sidebar Icon Container">
      <div aria-hidden className="absolute border-[#d8dada] border-r-[0.6px] border-solid inset-[0_-0.6px_0_0] pointer-events-none" />
      <SidebarHeader />
      <SearchBar />
      <TreeList />
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

function ViewToggleContainer() {
  return (
    <div className="content-stretch flex h-[48px] items-center justify-center relative shrink-0 w-full" data-name="View Toggle Container">
      <div aria-hidden className="absolute border-[#d8dada] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <ViewToggleButton />
      <ViewToggleButton1 />
    </div>
  );
}

function ToolBar() {
  return (
    <div className="content-stretch flex h-full items-center justify-end relative shrink-0 w-[156px]" data-name="Tool bar">
      <div className="overflow-clip relative rounded-[4px] shrink-0 size-[24px]" data-name="Metadata button">
        <div className="absolute inset-[16.67%] overflow-clip" data-name="file-info-line">
          <div className="absolute inset-[8.33%_12.5%]" data-name="Vector">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 13.3333">
              <path d={svgPaths.p9270400} fill="var(--fill-0, #888E8E)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function TopBar() {
  return (
    <div className="absolute bg-white content-stretch flex h-[40px] items-center justify-between left-0 px-[12px] top-0 w-[428px]" data-name="Top Bar">
      <div aria-hidden className="absolute border-[#d8dada] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] h-[18px] leading-[20px] not-italic relative shrink-0 text-[12px] text-black w-[76px]">Shell preview</p>
      <ToolBar />
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[781px] relative shrink-0 w-full" data-name="Container">
      <p className="[word-break:break-word] absolute font-['PingFang_SC:Regular',sans-serif] h-[207px] leading-[45px] left-[74px] not-italic text-[36px] text-black top-[203px] w-[201px]">Shell Preview</p>
      <TopBar />
    </div>
  );
}

function Container7() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <Container8 />
      </div>
      <div aria-hidden className="absolute border-[#e5e8e8] border-r border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function IconButtonWrap() {
  return (
    <div className="content-stretch flex gap-[2px] items-center relative shrink-0" data-name="Icon Button Wrap">
      <div className="overflow-clip relative rounded-[4px] shrink-0 size-[24px]" data-name="Icon button">
        <div className="absolute inset-[16.67%] overflow-clip" data-name="file-copy-line">
          <div className="absolute inset-[8.33%_12.5%]" data-name="Vector">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.9999 13.3333">
              <path d={svgPaths.p20344280} fill="var(--fill-0, #888E8E)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="overflow-clip relative rounded-[4px] shrink-0 size-[24px]" data-name="Icon button">
        <div className="absolute inset-[16.67%]" data-name="History Icon">
          <div className="absolute inset-[8.33%_8.34%_8.34%_8.33%]" data-name="路径">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.333 13.333">
              <path d={svgPaths.p306e4400} fill="var(--fill-0, #888E8E)" id="è·¯å¾" />
            </svg>
          </div>
        </div>
      </div>
      <div className="overflow-clip relative rounded-[4px] shrink-0 size-[24px]" data-name="Icon button">
        <div className="absolute inset-[16.67%] overflow-clip" data-name="More Icon">
          <div className="absolute inset-[43.75%_12.5%]" data-name="Vector">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 2">
              <path d={svgPaths.p2bac9d80} fill="var(--fill-0, #888E8E)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToolBar1() {
  return (
    <div className="content-stretch flex gap-[8px] h-full items-center justify-end relative shrink-0" data-name="Tool bar">
      <div className="bg-white content-stretch flex gap-[4px] h-[24px] items-center px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-name="Secondary-Button">
        <div aria-hidden className="absolute border-[#d8dada] border-[0.6px] border-solid inset-0 pointer-events-none rounded-[4px]" />
        <div className="overflow-clip relative shrink-0 size-[16px]" data-name="save-line">
          <div className="absolute inset-[12.5%]" data-name="Vector">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
              <path d={svgPaths.p2358eff2} fill="var(--fill-0, #3C4242)" id="Vector" />
            </svg>
          </div>
        </div>
        <div className="[word-break:break-word] flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3c4242] text-[12px] whitespace-nowrap">
          <p className="leading-[20px]">Save</p>
        </div>
      </div>
      <IconButtonWrap />
    </div>
  );
}

function TopBar1() {
  return (
    <div className="bg-white h-[40px] relative shrink-0 w-full" data-name="Top Bar">
      <div aria-hidden className="absolute border-[#d8dada] border-b-[0.6px] border-r-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-between px-[16px] relative size-full">
          <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] h-[18px] leading-[20px] not-italic relative shrink-0 text-[12px] text-black w-[76px]">Table name</p>
          <ToolBar1 />
        </div>
      </div>
    </div>
  );
}

function CodePanel() {
  return (
    <div className="content-stretch flex flex-col h-full items-end relative shrink-0 w-[544px]" data-name="Code panel">
      <div aria-hidden className="absolute border-[#d8dada] border-r-[0.6px] border-solid inset-0 pointer-events-none" />
      <TopBar1 />
      <p className="[word-break:break-word] absolute font-['PingFang_SC:Regular',sans-serif] h-[207px] leading-[45px] left-[200px] not-italic text-[36px] text-black top-[200px] w-[201px]">Code</p>
    </div>
  );
}

function AgentChatHeader() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Agent chat header">
      <div aria-hidden className="absolute border-[#d8dada] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-between px-[16px] relative size-full">
          <div className="relative shrink-0 size-[16px]" data-name="Union">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
              <path d={svgPaths.p3c1c2700} fill="url(#paint0_linear_2003_756)" id="Union" />
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_2003_756" x1="6" x2="16" y1="7.45058e-08" y2="16">
                  <stop stopColor="#0A9EED" />
                  <stop offset="0.254811" stopColor="#3B6FFF" />
                  <stop offset="0.64424" stopColor="#D452FF" />
                  <stop offset="1" stopColor="#ECB2FF" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="overflow-clip relative rounded-[4px] shrink-0 size-[24px]" data-name="Icon button">
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
  );
}

function ChatArea() {
  return <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Chat area" />;
}

function Input() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center justify-center min-w-px relative" data-name="Input">
      <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] min-w-px not-italic relative text-[#b2b4b4] text-[14px]">
        <p className="leading-[24px]">Ask me anything...</p>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute bottom-[25.06%] left-[31.25%] right-[23.14%] top-1/4" data-name="Group">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.9473 11.9865">
        <g id="Group">
          <path d={svgPaths.p22529e00} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Div() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Div">
      <Input />
      <div className="bg-[#830051] relative rounded-[4px] shrink-0 size-[24px]" data-name="send">
        <Group />
      </div>
    </div>
  );
}

function Inputbox() {
  return (
    <div className="bg-white h-[40px] relative rounded-[8px] shrink-0 w-full" data-name="Inputbox">
      <div aria-hidden className="absolute border border-[#ebecec] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center px-[10px] py-[8px] relative size-full">
          <Div />
        </div>
      </div>
    </div>
  );
}

function ConfirmationBox() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[7px] items-center p-[8px] relative shrink-0 w-[360px]" data-name="Confirmation Box">
      <div className="content-stretch flex flex-col items-center justify-end px-[2px] relative rounded-[10px] shrink-0 w-[344px]" data-name="Chat Box">
        <Inputbox />
      </div>
    </div>
  );
}

function AgentPanel() {
  return (
    <div className="content-stretch flex flex-col h-full items-start relative shrink-0 w-[360px]" data-name="Agent panel">
      <AgentChatHeader />
      <ChatArea />
      <ConfirmationBox />
    </div>
  );
}

function TablePanel() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px relative w-full" data-name="Table panel">
      <Container7 />
      <CodePanel />
      <AgentPanel />
    </div>
  );
}

function MainContainer() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-center min-w-px relative z-[1]" data-name="Main Container">
      <ViewToggleContainer />
      <TablePanel />
    </div>
  );
}

function EventArea() {
  return (
    <div className="content-stretch flex flex-[1_0_0] isolate items-start min-h-px relative w-full" data-name="Event area">
      <SidebarIconContainer />
      <MainContainer />
    </div>
  );
}

function MainArea() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start min-w-px relative" data-name="Main area">
      <EventArea />
    </div>
  );
}

export default function Default() {
  return (
    <div className="bg-white content-stretch flex items-center relative size-full" data-name="Default">
      <MainArea />
    </div>
  );
}