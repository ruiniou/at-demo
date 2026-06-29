import svgPaths from "./svg-c991so5wnq";
import imgShellPreviewImg from "./53821ecce0b3b02d9a017b14d8be17c86aa5d3a9.png";

function IconButtonWrap() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Icon button wrap">
      <div className="bg-[#f4e8ee] overflow-clip relative rounded-[4px] shrink-0 size-[24px]" data-name="Metadata button">
        <div className="absolute inset-[16.67%] overflow-clip" data-name="file-info-line">
          <div className="absolute inset-[8.33%_12.5%]" data-name="Vector">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 13.3333">
              <path d={svgPaths.p9270400} fill="var(--fill-0, #830051)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToolBar() {
  return (
    <div className="content-stretch flex gap-[8px] h-full items-center justify-end relative shrink-0" data-name="Tool bar">
      <div className="overflow-clip relative rounded-[4px] shrink-0 size-[24px]" data-name="Icon button">
        <div className="absolute inset-[16.67%] overflow-clip" data-name="snowflake-line">
          <div className="absolute inset-[6.95%_7.62%_6.95%_7.63%]" data-name="Vector">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5609 13.776">
              <path d={svgPaths.p39580700} fill="var(--fill-0, #888E8E)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <IconButtonWrap />
    </div>
  );
}

function TopBar() {
  return (
    <div className="bg-white h-[40px] relative shrink-0 w-full z-[2]" data-name="Top Bar">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-between pl-[12px] pr-[16px] relative size-full">
          <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] h-[18px] leading-[20px] not-italic relative shrink-0 text-[#3c4242] text-[12px] w-[76px]">Listing name</p>
          <ToolBar />
        </div>
      </div>
    </div>
  );
}

function ViewToggleButton() {
  return (
    <div className="bg-white h-full relative shrink-0" data-name="View Toggle Button">
      <div aria-hidden className="absolute border-[#830051] border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[4px] items-center justify-center px-[16px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#830051] text-[12px] text-center whitespace-nowrap">Basic info</p>
        </div>
      </div>
    </div>
  );
}

function ViewToggleButton1() {
  return (
    <div className="h-full relative shrink-0" data-name="View Toggle Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[4px] items-center justify-center px-[16px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#3c4242] text-[12px] text-center whitespace-nowrap">Blocks</p>
        </div>
      </div>
    </div>
  );
}

function ViewToggleContainer() {
  return (
    <div className="content-stretch flex h-[40px] items-center justify-center relative shrink-0" data-name="View Toggle Container">
      <ViewToggleButton />
      <ViewToggleButton1 />
    </div>
  );
}

function ToolBar1() {
  return (
    <div className="content-stretch flex h-full items-center justify-end relative shrink-0 w-[156px]" data-name="Tool bar">
      <div className="overflow-clip relative rounded-[4px] shrink-0 size-[24px]" data-name="Metadata button">
        <div className="absolute inset-[16.67%]" data-name="batch-micro">
          <div className="absolute inset-[12.33%_12.5%_9.66%_12.5%]" data-name="Union">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12.4812">
              <g id="Union">
                <path d={svgPaths.p18edf9f0} fill="var(--fill-0, #D8DADA)" />
                <path clipRule="evenodd" d={svgPaths.p1ade6c00} fill="var(--fill-0, #D8DADA)" fillRule="evenodd" />
              </g>
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
          <ViewToggleContainer />
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
        <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#3c4242] text-[12px] whitespace-nowrap">4/4 Confirmed</p>
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
            <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[#d8dada] left-1/2 rounded-[1px] size-[16px] top-1/2" data-name="Rectangle" />
            <div className="absolute inset-[30%_23.43%_27.57%_20%]" data-name="Check">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.05078 6.78809">
                <path d={svgPaths.p19033900} fill="var(--fill-0, white)" id="Check" />
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

function Label() {
  return (
    <div className="relative shrink-0" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#b2b4b4] text-[12px] whitespace-nowrap">Input Dataset(s)</p>
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
          <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[#d8dada] left-1/2 rounded-[1px] size-[16px] top-1/2" data-name="Rectangle" />
          <div className="absolute inset-[30%_23.43%_27.57%_20%]" data-name="Check">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.05078 6.78809">
              <path d={svgPaths.p19033900} fill="var(--fill-0, white)" id="Check" />
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
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[8px] py-[4px] relative size-full">
          <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#b2b4b4] text-[12px] whitespace-nowrap">ADSL</p>
        </div>
      </div>
    </div>
  );
}

function Label1() {
  return (
    <div className="relative shrink-0" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#b2b4b4] text-[12px] whitespace-nowrap">Input Dataset(s)</p>
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
          <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[#d8dada] left-1/2 rounded-[1px] size-[16px] top-1/2" data-name="Rectangle" />
          <div className="absolute inset-[30%_23.43%_27.57%_20%]" data-name="Check">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.05078 6.78809">
              <path d={svgPaths.p19033900} fill="var(--fill-0, white)" id="Check" />
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
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[8px] py-[4px] relative size-full">
          <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#b2b4b4] text-[12px] whitespace-nowrap">ADSL</p>
        </div>
      </div>
    </div>
  );
}

function Label2() {
  return (
    <div className="relative shrink-0" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#b2b4b4] text-[12px] whitespace-nowrap">Input Dataset(s)</p>
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
          <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[#d8dada] left-1/2 rounded-[1px] size-[16px] top-1/2" data-name="Rectangle" />
          <div className="absolute inset-[30%_23.43%_27.57%_20%]" data-name="Check">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.05078 6.78809">
              <path d={svgPaths.p19033900} fill="var(--fill-0, white)" id="Check" />
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
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[8px] py-[4px] relative size-full">
          <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#b2b4b4] text-[12px] whitespace-nowrap">ADSL</p>
        </div>
      </div>
    </div>
  );
}

function Label3() {
  return (
    <div className="relative shrink-0" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#b2b4b4] text-[12px] whitespace-nowrap">Input Dataset(s)</p>
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
          <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[#d8dada] left-1/2 rounded-[1px] size-[16px] top-1/2" data-name="Rectangle" />
          <div className="absolute inset-[30%_23.43%_27.57%_20%]" data-name="Check">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.05078 6.78809">
              <path d={svgPaths.p19033900} fill="var(--fill-0, white)" id="Check" />
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
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[8px] py-[4px] relative size-full">
          <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#b2b4b4] text-[12px] whitespace-nowrap">ADSL</p>
        </div>
      </div>
    </div>
  );
}

function MetadataWrap1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px relative w-full" data-name="Metadata wrap">
      <div className="bg-white relative shrink-0 w-full" data-name="Input field/Metadata">
        <div className="flex flex-col justify-center size-full">
          <div className="content-stretch flex flex-col gap-[3.999px] items-start justify-center px-[12px] py-[8px] relative size-full">
            <Container2 />
            <Input />
          </div>
        </div>
      </div>
      <div className="bg-white relative shrink-0 w-full" data-name="Input field/Metadata">
        <div className="flex flex-col justify-center size-full">
          <div className="content-stretch flex flex-col gap-[3.999px] items-start justify-center px-[12px] py-[8px] relative size-full">
            <Container3 />
            <Input1 />
          </div>
        </div>
      </div>
      <div className="bg-white relative shrink-0 w-full" data-name="Input field/Metadata">
        <div className="flex flex-col justify-center size-full">
          <div className="content-stretch flex flex-col gap-[3.999px] items-start justify-center px-[12px] py-[8px] relative size-full">
            <Container4 />
            <Input2 />
          </div>
        </div>
      </div>
      <div className="bg-white relative shrink-0 w-full" data-name="Input field/Metadata">
        <div className="flex flex-col justify-center size-full">
          <div className="content-stretch flex flex-col gap-[3.999px] items-start justify-center px-[12px] py-[8px] relative size-full">
            <Container5 />
            <Input3 />
          </div>
        </div>
      </div>
    </div>
  );
}

function Metadata() {
  return (
    <div className="bg-white flex-[1_0_0] h-full min-w-px relative rounded-[8px]" data-name="Metadata">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <TopBar1 />
        <Container />
        <MetadataWrap1 />
      </div>
      <div aria-hidden className="absolute border border-[#ebecec] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_1px_0px_rgba(0,0,0,0.04),0px_3px_8px_-2px_rgba(0,0,0,0.02)]" />
    </div>
  );
}

function MetadataWrap() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative" data-name="Metadata Wrap">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pb-[8px] pl-[4px] pr-[8px] pt-[4px] relative size-full">
          <Metadata />
        </div>
      </div>
    </div>
  );
}

function ShellContainer() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[4px] items-center min-h-px relative w-full z-[1]" data-name="Shell container">
      <div className="flex-[1_0_0] h-[768px] min-w-px relative" data-name="Shell preview img">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgShellPreviewImg} />
      </div>
      <MetadataWrap />
    </div>
  );
}

export default function ShellPreview() {
  return (
    <div className="relative size-full" data-name="Shell Preview">
      <div className="content-stretch flex flex-col isolate items-start relative size-full">
        <TopBar />
        <ShellContainer />
      </div>
      <div aria-hidden className="absolute border-[#ebecec] border-b border-solid inset-0 pointer-events-none" />
    </div>
  );
}