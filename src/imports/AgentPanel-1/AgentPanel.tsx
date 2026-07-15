import svgPaths from "./svg-rm69qajng8";

function AgentChatHeader() {
  return (
    <div className="bg-[#f8f8f8] h-[32px] relative shrink-0 w-full" data-name="Agent chat header">
      <div aria-hidden="true" className="absolute border-[#e5e8e8] border-b border-l border-solid border-t inset-0 pointer-events-none" />
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex items-baseline justify-between px-[16px] py-[8px] relative size-full">
          <div className="relative shrink-0 size-[16px]" data-name="Union">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
              <path d={svgPaths.p3c1c2700} fill="url(#paint0_linear_27_971)" id="Union" />
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_27_971" x1="6" x2="16" y1="7.45058e-08" y2="16">
                  <stop stopColor="#0A9EED" />
                  <stop offset="0.254811" stopColor="#3B6FFF" />
                  <stop offset="0.64424" stopColor="#D452FF" />
                  <stop offset="1" stopColor="#ECB2FF" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="close-line">
            <div className="absolute inset-[23.49%_23.48%_23.48%_23.48%]" data-name="Vector">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.48531 8.48525">
                <path d={svgPaths.pd28a400} fill="var(--fill-0, var(--color-text-secondary))" id="Vector" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Tag() {
  return (
    <div className="bg-az-secondary content-stretch flex gap-[4px] h-[20px] items-center justify-center max-w-[240px] pl-[2px] pr-[6px] relative rounded-[4px] shrink-0" data-name="Tag">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="code-line">
        <div className="absolute inset-[20.54%_4.17%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.6667 9.42809">
            <path d={svgPaths.p4accf00} fill="var(--fill-0, var(--color-brand-1))" id="Vector" />
          </svg>
        </div>
      </div>
      <div className="flex flex-[1_0_0] flex-col t-caption justify-center min-w-px relative text-brand-1">
        <p className="leading-[20px]">Table.1(290-321)</p>
      </div>
    </div>
  );
}

function AiThinking() {
  return (
    <div className="content-stretch flex gap-[6px] h-[24px] items-center relative shrink-0 w-full" data-name="AI Thinking">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Tool call/edit-2-line">
        <div className="absolute inset-[12.16%_12.5%_12.96%_12.5%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 11.9804">
            <path d={svgPaths.p243c4800} fill="var(--fill-0, var(--color-text-secondary))" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="t-body-compact relative shrink-0 text-text-primary whitespace-nowrap">Tool name</p>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col t-caption justify-center relative shrink-0 text-text-primary whitespace-nowrap">
        <p className="leading-[20px]">Lines 3-7</p>
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
            <path d={svgPaths.p3cfa0180} fill="var(--fill-0, var(--color-text-secondary))" id="Vector" />
          </svg>
        </div>
      </div>
      <Container1 />
    </div>
  );
}

function Changes() {
  return (
    <div className="content-stretch flex t-small-medium gap-[4px] items-center justify-end relative shrink-0 whitespace-nowrap" data-name="Changes">
      <div className="flex flex-col justify-center relative shrink-0 text-code-success">
        <p className="leading-[18px]">+1</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-status-error">
        <p className="leading-[18px]">-9</p>
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
                  <path d={svgPaths.p20344280} fill="var(--fill-0, var(--color-text-secondary))" id="Vector" />
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
      <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-text-secondary text-[13px] whitespace-nowrap">
        <p className="leading-[20px]">-</p>
      </div>
    </div>
  );
}

function Code() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-w-px relative self-stretch" data-name="Code">
      <div className="flex flex-col font-['Menlo:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-code-success text-[0px] whitespace-nowrap">
        <p className="text-[13px]">
          <span className="leading-[1.25] text-text-secondary">1</span>
          <span className="leading-[1.25] text-text-primary">{` = `}</span>
          <span className="leading-[1.25] text-brand-1">{`'AZD999(*ESC*)n1 mg/kg'`}</span>
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
      <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-text-secondary text-[13px] whitespace-nowrap">
        <p className="leading-[20px]">-</p>
      </div>
    </div>
  );
}

function Code1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-w-px relative self-stretch" data-name="Code">
      <div className="flex flex-col font-['Menlo:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-code-success text-[0px] whitespace-nowrap">
        <p className="text-[13px]">
          <span className="leading-[1.25] text-text-secondary">2</span>
          <span className="leading-[1.25] text-text-primary">{` = `}</span>
          <span className="leading-[1.25] text-brand-1">{`'AZD999(*ESC*)n2 mg/kg'`}</span>
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
      <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-text-secondary text-[13px] whitespace-nowrap">
        <p className="leading-[20px]">-</p>
      </div>
    </div>
  );
}

function Code2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-w-px relative self-stretch" data-name="Code">
      <div className="flex flex-col font-['Menlo:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-code-success text-[0px] whitespace-nowrap">
        <p className="text-[13px]">
          <span className="leading-[1.25] text-text-secondary">3</span>
          <span className="leading-[1.25] text-text-primary">{` = `}</span>
          <span className="leading-[1.25] text-brand-1">{`'AZD999(*ESC*)nTotal'`}</span>
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
      <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-text-secondary text-[13px] whitespace-nowrap">
        <p className="leading-[20px]">-</p>
      </div>
    </div>
  );
}

function Code3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-w-px relative self-stretch" data-name="Code">
      <div className="flex flex-col font-['Menlo:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-code-success text-[0px] whitespace-nowrap">
        <p className="text-[13px]">
          <span className="leading-[1.25] text-text-secondary">4</span>
          <span className="leading-[1.25] text-text-primary">{` = `}</span>
          <span className="leading-[1.25] text-brand-1">{`'Investigator choice of therapy'`}</span>
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
      <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-text-secondary text-[13px] whitespace-nowrap">
        <p className="leading-[20px]">-</p>
      </div>
    </div>
  );
}

function Code4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-w-px relative self-stretch" data-name="Code">
      <div className="flex flex-col font-['Menlo:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-code-success text-[0px] whitespace-nowrap">
        <p className="text-[13px]">
          <span className="leading-[1.25] text-text-secondary">5</span>
          <span className="leading-[1.25] text-text-primary">{` = `}</span>
          <span className="leading-[1.25] text-brand-1">{`'Total'`}</span>
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
      <div aria-hidden="true" className="absolute border-brand-1 border-l-3 border-solid inset-0 pointer-events-none" />
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
      <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-text-secondary text-[13px] whitespace-nowrap">
        <p className="leading-[20px]">+</p>
      </div>
    </div>
  );
}

function Code5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-w-px relative self-stretch" data-name="Code">
      <div className="flex flex-col font-['Menlo:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-code-success text-[0px] whitespace-nowrap">
        <p className="text-[13px]">
          <span className="leading-[1.25] text-text-secondary">1</span>
          <span className="leading-[1.25] text-text-primary">{` = `}</span>
          <span className="leading-[1.25] text-brand-1">{`'AZD999(*ESC*)n1 mg/kg'`}</span>
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
      <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-text-secondary text-[13px] whitespace-nowrap">
        <p className="leading-[20px]">+</p>
      </div>
    </div>
  );
}

function Code6() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-w-px relative self-stretch" data-name="Code">
      <div className="flex flex-col font-['Menlo:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-code-success text-[0px] whitespace-nowrap">
        <p className="text-[13px]">
          <span className="leading-[1.25] text-text-secondary">2</span>
          <span className="leading-[1.25] text-text-primary">{` = `}</span>
          <span className="leading-[1.25] text-brand-1">{`'AZD999(*ESC*)n2 mg/kg'`}</span>
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
      <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-text-secondary text-[13px] whitespace-nowrap">
        <p className="leading-[20px]">+</p>
      </div>
    </div>
  );
}

function Code7() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-w-px relative self-stretch" data-name="Code">
      <div className="flex flex-col font-['Menlo:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-code-success text-[0px] whitespace-nowrap">
        <p className="text-[13px]">
          <span className="leading-[1.25] text-text-secondary">4</span>
          <span className="leading-[1.25] text-text-primary">{` = `}</span>
          <span className="leading-[1.25] text-brand-1">{`'Investigator choice of therapy'`}</span>
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
      <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-text-secondary text-[13px] whitespace-nowrap">
        <p className="leading-[20px]">+</p>
      </div>
    </div>
  );
}

function Code8() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-w-px relative self-stretch" data-name="Code">
      <div className="flex flex-col font-['Menlo:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-code-success text-[0px] whitespace-nowrap">
        <p className="text-[13px]">
          <span className="leading-[1.25] text-text-secondary">5</span>
          <span className="leading-[1.25] text-text-primary">{` = `}</span>
          <span className="leading-[1.25] text-brand-1">{`'Total'`}</span>
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
      <div aria-hidden="true" className="absolute border-[#1e7e34] border-l-3 border-solid inset-0 pointer-events-none" />
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
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-auto relative size-full">
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
      <div aria-hidden="true" className="absolute border-[#d8dada] border-solid border-t-[0.6px] inset-0 pointer-events-none" />
    </div>
  );
}

function Details() {
  return (
    <div className="relative shrink-0 w-full" data-name="Details">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <SlotSummary />
        <SlotCodeContentArea />
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
      <div aria-hidden="true" className="absolute border-[#d8dada] border-[0.6px] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function AiOutput() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="AI output">
      <div className="content-stretch flex flex-col gap-[8px] items-start px-[12px] py-[10px] relative rounded-[4px] shrink-0 w-[340px]" data-name="Tool call">
        <div aria-hidden="true" className="absolute border border-[#ebecec] border-solid inset-0 pointer-events-none rounded-[4px]" />
        <AiThinking />
      </div>
      <div className="content-stretch flex flex-col items-start max-w-[600px] relative shrink-0 w-full" data-name="Code Diff">
        <CodeDiffComponentRoot />
      </div>
    </div>
  );
}

function AiThinking1() {
  return (
    <div className="content-stretch flex gap-[6px] h-[30px] items-center relative shrink-0 w-full" data-name="AI Thinking">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="AI thinking status/error-warning-line">
        <div className="absolute inset-[8.33%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333">
            <path d={svgPaths.p23ce7480} fill="var(--fill-0, #CC2C3C)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="t-body-compact relative shrink-0 text-status-error whitespace-nowrap">{`Error: Error reason summary `}</p>
    </div>
  );
}

function AiThinking2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="AI Thinking">
      <p className="flex-[1_0_0] t-small leading-[20px] min-w-px relative text-status-error">Error reason details here.</p>
    </div>
  );
}

function ErrorMessage() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-w-px relative" data-name="Error message">
      <AiThinking1 />
      <AiThinking2 />
    </div>
  );
}

function OneRound() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start p-[10px] relative shrink-0 w-[360px]" data-name="One round">
      <div className="bg-[#fafafa] content-stretch flex flex-col gap-[4px] items-start justify-end px-[10px] py-[8px] relative rounded-[8px] shrink-0 w-[340px]" data-name="User Prompt">
        <Tag />
        <p className="t-body min-w-full relative shrink-0 text-text-secondary w-[min-content]">User prompt.</p>
      </div>
      <AiOutput />
      <div className="bg-az-secondary content-stretch flex gap-[8px] items-start px-[10px] py-[8px] relative rounded-[4px] shrink-0 w-[340px]" data-name="Error">
        <div aria-hidden="true" className="absolute border-[#cc2c3c] border-[0.6px] border-solid inset-0 pointer-events-none rounded-[4px]" />
        <ErrorMessage />
        <div className="bg-white content-stretch flex gap-[4px] items-center px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-name="Secondary-Button">
          <div aria-hidden="true" className="absolute border-[#d8dada] border-[0.6px] border-solid inset-0 pointer-events-none rounded-[4px]" />
            <div className="flex flex-col t-small justify-center relative shrink-0 text-text-primary whitespace-nowrap">
            <p className="leading-[20px]">Retry</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatArea() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px overflow-clip relative" data-name="Chat area">
      <OneRound />
    </div>
  );
}

function Input1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center justify-center min-w-px relative" data-name="Input">
      <div className="flex flex-[1_0_0] flex-col t-body justify-center min-w-px relative text-[#b2b4b4]">
        <p className="leading-[24px]">Ask me anything…</p>
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
      <Input1 />
      <div className="bg-brand-1 relative rounded-[4px] shrink-0 size-[24px]" data-name="send">
        <Group />
      </div>
    </div>
  );
}

function Inputbox() {
  return (
    <div className="bg-white drop-shadow-[0px_0px_3px_rgba(0,0,0,0.1)] h-[40px] relative rounded-[8px] shrink-0 w-full" data-name="Inputbox">
      <div className="flex flex-col items-end justify-center size-full">
        <div className="content-stretch flex flex-col items-end justify-center px-[10px] py-[8px] relative size-full">
          <Div />
        </div>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 w-full" data-name="Input">
      <Inputbox />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute inset-[8.33%]" data-name="Group">
      <div className="absolute inset-[-5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.6667 14.6667">
          <g id="Group">
            <path d={svgPaths.p3d62dd80} id="Vector" stroke="var(--stroke-0, #888E8E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
            <path d={svgPaths.p32ff7e00} id="Vector_2" stroke="var(--stroke-0, #888E8E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Svg() {
  return (
    <div className="overflow-clip relative shrink-0 size-[16px]" data-name="SVG">
      <Group1 />
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col t-body justify-center relative shrink-0 text-text-primary whitespace-nowrap">
        <p className="leading-[18px]">Questions</p>
      </div>
    </div>
  );
}

function LeftIconLabel() {
  return (
    <div className="relative shrink-0" data-name="Left: icon + label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] items-center relative size-full">
        <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="iconify-icon">
          <Svg />
        </div>
        <Container21 />
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex flex-col items-center min-w-[32px] px-[3.36px] relative shrink-0" data-name="Container">
      <div className="flex flex-col t-caption justify-center relative shrink-0 text-text-secondary text-center whitespace-nowrap">
        <p className="leading-[20px]">1 / 3</p>
      </div>
    </div>
  );
}

function RightNavArrowsWithPageNumberBetween() {
  return (
    <div className="relative shrink-0" data-name="Right: nav arrows with page number between">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <div className="overflow-clip relative shrink-0 size-[20px]" data-name="arrow-left-s-line">
          <div className="absolute inset-[23.49%_34.26%_23.48%_33.33%]" data-name="Vector">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.48183 10.6066">
              <path d={svgPaths.p37d3e600} fill="var(--fill-0, #D8DADA)" id="Vector" />
            </svg>
          </div>
        </div>
        <Container22 />
        <div className="overflow-clip relative shrink-0 size-[20px]" data-name="arrow-right-s-line">
          <div className="absolute inset-[23.49%_33.33%_23.48%_34.26%]" data-name="Vector">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.48182 10.6066">
              <path d={svgPaths.p1b88b80} fill="var(--fill-0, var(--color-text-secondary))" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="relative shrink-0 w-full" data-name="Header">
      <div aria-hidden="true" className="absolute border-[#d8dada] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-[8.6px] pt-[8px] px-[10px] relative size-full">
          <LeftIconLabel />
          <RightNavArrowsWithPageNumberBetween />
        </div>
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[8px] relative shrink-0 w-full" data-name="Heading 3">
      <div className="flex flex-col t-heading justify-center relative shrink-0 text-text-primary w-full">
        <p className="leading-[22px]">Question heading?</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative" data-name="Container">
      <div className="flex flex-col t-caption justify-center relative shrink-0 text-text-primary whitespace-nowrap">
        <p className="leading-[20px]">Planning / Task Breakdown</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative" data-name="Container">
      <div className="flex flex-col t-caption justify-center relative shrink-0 text-text-primary whitespace-nowrap">
        <p className="leading-[20px]">Planning / Task Breakdown</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative" data-name="Container">
      <div className="flex flex-col t-caption justify-center relative shrink-0 text-text-primary whitespace-nowrap">
        <p className="leading-[20px]">Planning / Task Breakdown</p>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col t-caption justify-center relative shrink-0 text-[#b2b4b4] whitespace-nowrap">
        <p className="leading-[20px]">Or, describe your needs…</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="bg-[#f8f7f7] relative rounded-[4px] shrink-0 w-full" data-name="Option">
        <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex gap-[8px] items-center p-[8px] relative size-full">
            <div className="relative shrink-0 size-[16px]" data-name="Radio Button">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                <circle cx="8" cy="8" fill="var(--fill-0, white)" id="Outer" r="7" stroke="var(--stroke-0, var(--color-brand-1))" strokeWidth="2" />
              </svg>
              <div className="absolute inset-[30%]" data-name="Center">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.4 6.4">
                  <circle cx="3.2" cy="3.2" fill="var(--fill-0, var(--color-brand-1))" id="Center" r="3.2" />
                </svg>
              </div>
            </div>
            <Container24 />
          </div>
        </div>
      </div>
      <div className="relative rounded-[4px] shrink-0 w-full" data-name="Option">
        <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex gap-[8px] items-center p-[8px] relative size-full">
            <div className="relative shrink-0 size-[16px]" data-name="Radio Button">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                <circle cx="8" cy="8" fill="var(--fill-0, white)" id="Outer" r="7.2" stroke="var(--stroke-0, #D8DADA)" strokeWidth="1.6" />
              </svg>
            </div>
            <Container25 />
          </div>
        </div>
      </div>
      <div className="relative rounded-[4px] shrink-0 w-full" data-name="Option">
        <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex gap-[8px] items-center p-[8px] relative size-full">
            <div className="relative shrink-0 size-[16px]" data-name="Radio Button">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                <circle cx="8" cy="8" fill="var(--fill-0, white)" id="Outer" r="7.2" stroke="var(--stroke-0, #D8DADA)" strokeWidth="1.6" />
              </svg>
            </div>
            <Container26 />
          </div>
        </div>
      </div>
      <div className="relative rounded-[4px] shrink-0 w-full" data-name="Option">
        <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex gap-[8px] items-center p-[8px] relative size-full">
            <div className="relative shrink-0 size-[16px]" data-name="Radio Button">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                <circle cx="8" cy="8" fill="var(--fill-0, white)" id="Outer" r="7.2" stroke="var(--stroke-0, #D8DADA)" strokeWidth="1.6" />
              </svg>
            </div>
            <Container27 />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuestionBody() {
  return (
    <div className="relative shrink-0 w-full" data-name="Question body">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[4px] pt-[12px] px-[10px] relative size-full">
        <Heading />
        <Container23 />
      </div>
    </div>
  );
}

function ActionButtons() {
  return (
    <div className="relative shrink-0 w-full" data-name="Action buttons">
      <div className="flex flex-row justify-end size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-start justify-end px-[10px] py-[8px] relative size-full">
          <div className="bg-white content-stretch flex gap-[4px] items-center px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-name="Secondary-Button">
            <div aria-hidden="true" className="absolute border-[#d8dada] border-[0.6px] border-solid inset-0 pointer-events-none rounded-[4px]" />
              <div className="flex flex-col t-small justify-center relative shrink-0 text-text-primary whitespace-nowrap">
              <p className="leading-[20px]">Skip</p>
            </div>
          </div>
          <div className="bg-[#e6ccdc] content-stretch flex gap-[4px] items-center px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-name="Primary-Button">
            <div className="flex flex-col t-small justify-center relative shrink-0 text-white whitespace-nowrap">
              <p className="leading-[20px]">Continue</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfirmationBox() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[7px] items-center p-[8px] relative shrink-0 w-[360px]" data-name="Confirmation Box">
      <div className="content-stretch flex flex-col items-center justify-end px-[2px] relative rounded-[10px] shrink-0 w-[344px]" data-name="Chat Box">
        <Input />
      </div>
      <div className="absolute bg-white bottom-[52px] left-[10px] rounded-[8px] w-[340px]" data-name="Ask User">
        <div className="content-stretch flex flex-col items-start overflow-clip p-[0.6px] relative rounded-[inherit] size-full">
          <Header />
          <QuestionBody />
          <ActionButtons />
        </div>
        <div aria-hidden="true" className="absolute border-[#d8dada] border-[0.6px] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[1px_2px_8px_0px_rgba(0,0,0,0.08)]" />
      </div>
    </div>
  );
}

export default function AgentPanel() {
  return (
    <div className="content-stretch flex flex-col items-start relative size-full" data-name="Agent panel">
      <AgentChatHeader />
      <ChatArea />
      <ConfirmationBox />
    </div>
  );
}