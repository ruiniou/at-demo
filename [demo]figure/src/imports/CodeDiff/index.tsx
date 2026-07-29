import svgPaths from "./svg-m0fvrziatt";

function Container1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3c4242] text-[14px] whitespace-nowrap">
        <p className="leading-[18px]">Lines 3-7</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="Container">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="arrow-down-s-line">
        <div className="absolute inset-[34.26%_23.48%_33.33%_23.48%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.48527 5.18548">
            <path d={svgPaths.p3cfa0180} fill="var(--fill-0, #888E8E)" id="Vector" />
          </svg>
        </div>
      </div>
      <Container1 />
    </div>
  );
}

function Changes() {
  return (
    <div className="[word-break:break-word] content-stretch flex font-['PingFang_SC:Regular',sans-serif] gap-[4px] items-center justify-end leading-[0] not-italic relative shrink-0 text-[12px] whitespace-nowrap" data-name="Changes">
      <div className="flex flex-col justify-center relative shrink-0 text-[#1e7e34]">
        <p className="leading-[20px]">+1</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[#cc2c3c]">
        <p className="leading-[20px]">-9</p>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
      <Container />
      <Changes />
    </div>
  );
}

function SlotSummary() {
  return (
    <div className="relative shrink-0 w-full" data-name="Slot → Summary">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-between px-[10px] py-[8px] relative size-full">
          <Frame />
          <div className="overflow-clip relative rounded-[4px] shrink-0 size-[24px]" data-name="Icon button">
            <div className="absolute inset-[16.67%] overflow-clip" data-name="file-copy-line">
              <div className="absolute inset-[8.33%_12.5%]" data-name="Vector">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.9999 13.3333">
                  <path d={svgPaths.p20344280} fill="var(--fill-0, #888E8E)" id="Vector" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative self-stretch shrink-0 w-[16px]" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888e8e] text-[13px] whitespace-nowrap">
        <p className="leading-[20px]">-</p>
      </div>
    </div>
  );
}

function Code() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-w-px relative self-stretch" data-name="Code">
      <div className="[word-break:break-word] flex flex-col font-['Menlo:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1e7e34] text-[0px] whitespace-nowrap">
        <p className="text-[13px]">
          <span className="leading-[1.25] text-[#888e8e]">1</span>
          <span className="leading-[1.25] text-[#830051]">{` = 'AZD999(*ESC*)n1 mg/kg'`}</span>
        </p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start px-[10px] relative size-full">
        <Container4 />
        <Code />
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0 w-[16px]" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888e8e] text-[13px] whitespace-nowrap">
        <p className="leading-[20px]">-</p>
      </div>
    </div>
  );
}

function Code1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-w-px relative self-stretch" data-name="Code">
      <div className="[word-break:break-word] flex flex-col font-['Menlo:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1e7e34] text-[0px] whitespace-nowrap">
        <p className="text-[13px]">
          <span className="leading-[1.25] text-[#888e8e]">2</span>
          <span className="leading-[1.25] text-[#830051]">{` = 'AZD999(*ESC*)n2 mg/kg'`}</span>
        </p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start px-[10px] relative size-full">
        <Container6 />
        <Code1 />
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0 w-[16px]" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888e8e] text-[13px] whitespace-nowrap">
        <p className="leading-[20px]">-</p>
      </div>
    </div>
  );
}

function Code2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-w-px relative self-stretch" data-name="Code">
      <div className="[word-break:break-word] flex flex-col font-['Menlo:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1e7e34] text-[0px] whitespace-nowrap">
        <p className="text-[13px]">
          <span className="leading-[1.25] text-[#888e8e]">3</span>
          <span className="leading-[1.25] text-[#830051]">{` = 'AZD999(*ESC*)nTotal'`}</span>
        </p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start px-[10px] relative size-full">
        <Container8 />
        <Code2 />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0 w-[16px]" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888e8e] text-[13px] whitespace-nowrap">
        <p className="leading-[20px]">-</p>
      </div>
    </div>
  );
}

function Code3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-w-px relative self-stretch" data-name="Code">
      <div className="[word-break:break-word] flex flex-col font-['Menlo:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1e7e34] text-[0px] whitespace-nowrap">
        <p className="text-[13px]">
          <span className="leading-[1.25] text-[#888e8e]">4</span>
          <span className="leading-[1.25] text-[#830051]">{` = 'Investigator choice of therapy'`}</span>
        </p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start px-[10px] relative size-full">
        <Container10 />
        <Code3 />
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0 w-[16px]" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888e8e] text-[13px] whitespace-nowrap">
        <p className="leading-[20px]">-</p>
      </div>
    </div>
  );
}

function Code4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-w-px relative self-stretch" data-name="Code">
      <div className="[word-break:break-word] flex flex-col font-['Menlo:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1e7e34] text-[0px] whitespace-nowrap">
        <p className="text-[13px]">
          <span className="leading-[1.25] text-[#888e8e]">5</span>
          <span className="leading-[1.25] text-[#830051]">{` = 'Total'`}</span>
        </p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start px-[10px] relative size-full">
        <Container12 />
        <Code4 />
      </div>
    </div>
  );
}

function DeletionSection() {
  return (
    <div className="bg-[#fdecea] content-stretch flex flex-col items-start pl-[3px] py-[4px] relative shrink-0 w-full" data-name="Deletion Section">
      <div aria-hidden className="absolute border-[#830051] border-l-3 border-solid inset-0 pointer-events-none" />
      <Container3 />
      <Container5 />
      <Container7 />
      <Container9 />
      <Container11 />
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0 w-[16px]" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888e8e] text-[13px] whitespace-nowrap">
        <p className="leading-[20px]">+</p>
      </div>
    </div>
  );
}

function Code5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-w-px relative self-stretch" data-name="Code">
      <div className="[word-break:break-word] flex flex-col font-['Menlo:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1e7e34] text-[0px] whitespace-nowrap">
        <p className="text-[13px]">
          <span className="leading-[1.25] text-[#888e8e]">1</span>
          <span className="leading-[1.25] text-[#830051]">{` = 'AZD999(*ESC*)n1 mg/kg'`}</span>
        </p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start px-[10px] relative size-full">
        <Container14 />
        <Code5 />
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0 w-[16px]" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888e8e] text-[13px] whitespace-nowrap">
        <p className="leading-[20px]">+</p>
      </div>
    </div>
  );
}

function Code6() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-w-px relative self-stretch" data-name="Code">
      <div className="[word-break:break-word] flex flex-col font-['Menlo:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1e7e34] text-[0px] whitespace-nowrap">
        <p className="text-[13px]">
          <span className="leading-[1.25] text-[#888e8e]">2</span>
          <span className="leading-[1.25] text-[#830051]">{` = 'AZD999(*ESC*)n2 mg/kg'`}</span>
        </p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start px-[10px] relative size-full">
        <Container16 />
        <Code6 />
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0 w-[16px]" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888e8e] text-[13px] whitespace-nowrap">
        <p className="leading-[20px]">+</p>
      </div>
    </div>
  );
}

function Code7() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-w-px relative self-stretch" data-name="Code">
      <div className="[word-break:break-word] flex flex-col font-['Menlo:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1e7e34] text-[0px] whitespace-nowrap">
        <p className="text-[13px]">
          <span className="leading-[1.25] text-[#888e8e]">4</span>
          <span className="leading-[1.25] text-[#830051]">{` = 'Investigator choice of therapy'`}</span>
        </p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start px-[10px] relative size-full">
        <Container18 />
        <Code7 />
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0 w-[16px]" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888e8e] text-[13px] whitespace-nowrap">
        <p className="leading-[20px]">+</p>
      </div>
    </div>
  );
}

function Code8() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-w-px relative self-stretch" data-name="Code">
      <div className="[word-break:break-word] flex flex-col font-['Menlo:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1e7e34] text-[0px] whitespace-nowrap">
        <p className="text-[13px]">
          <span className="leading-[1.25] text-[#888e8e]">5</span>
          <span className="leading-[1.25] text-[#830051]">{` = 'Total'`}</span>
        </p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start px-[10px] relative size-full">
        <Container20 />
        <Code8 />
      </div>
    </div>
  );
}

function AdditionSection() {
  return (
    <div className="bg-[#e6f4ea] content-stretch flex flex-col items-start pl-[3px] py-[4px] relative shrink-0 w-full" data-name="Addition Section">
      <div aria-hidden className="absolute border-[#1e7e34] border-l-3 border-solid inset-0 pointer-events-none" />
      <Container13 />
      <Container15 />
      <Container17 />
      <Container19 />
    </div>
  );
}

function Container2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-auto relative rounded-[inherit] size-full">
        <DeletionSection />
        <AdditionSection />
      </div>
    </div>
  );
}

function SlotCodeContentArea() {
  return (
    <div className="relative shrink-0 w-full" data-name="Slot → Code Content Area">
      <div className="content-stretch flex flex-col items-start overflow-clip pt-[0.6px] relative rounded-[inherit] size-full">
        <Container2 />
      </div>
      <div aria-hidden className="absolute border-[#d8dada] border-solid border-t-[0.6px] inset-0 pointer-events-none" />
    </div>
  );
}

function ScrollArea() {
  return (
    <div className="content-stretch flex h-full items-start justify-center py-[2px] relative w-[10px]" data-name="Scroll area">
      <div className="bg-[#d8dada] h-[44px] relative rounded-[8px] shrink-0 w-[4px]" data-name="Scrollbar" />
    </div>
  );
}

function Details() {
  return (
    <div className="relative shrink-0 w-full" data-name="Details">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <SlotSummary />
        <SlotCodeContentArea />
        <div className="flex h-[10px] items-center justify-center relative shrink-0 w-full" style={{ containerType: "size" }}>
          <div className="-rotate-90 flex-none h-[100cqw]">
            <ScrollArea />
          </div>
        </div>
      </div>
    </div>
  );
}

function CodeDiffComponentRoot() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Code Diff Component Root">
      <div className="content-stretch flex flex-col items-start overflow-clip p-[0.6px] relative rounded-[inherit] size-full">
        <Details />
      </div>
      <div aria-hidden className="absolute border-[#d8dada] border-[0.6px] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

export default function CodeDiff() {
  return (
    <div className="content-stretch flex flex-col items-start relative size-full" data-name="Code Diff">
      <CodeDiffComponentRoot />
    </div>
  );
}