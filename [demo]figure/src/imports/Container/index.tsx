import svgPaths from "./svg-rbvdgpxw0d";

function Paragraph() {
  return (
    <div className="relative shrink-0" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic relative shrink-0 text-[#3c4242] text-[14px] whitespace-nowrap">Add Component</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden className="absolute border-[#ebecec] border-b-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-[0.5px] px-[12px] relative size-full">
          <Paragraph />
        </div>
      </div>
    </div>
  );
}

function LabelRow() {
  return (
    <div className="[word-break:break-word] content-stretch flex gap-[2px] items-center not-italic overflow-clip relative shrink-0 text-[12px] whitespace-nowrap" data-name="label-row">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[18px] relative shrink-0 text-[#3c4242]">Name</p>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#830051]">*</p>
    </div>
  );
}

function InputBox() {
  return (
    <div className="bg-white h-[36px] relative rounded-[4px] shrink-0 w-full" data-name="input-box">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[12px] relative size-full">
          <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[16px] min-w-px not-italic relative text-[#888e8e] text-[12px]">Input name...</p>
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#ebecec] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function LabelRow1() {
  return (
    <div className="[word-break:break-word] content-stretch flex gap-[2px] items-center not-italic overflow-clip relative shrink-0 text-[12px] whitespace-nowrap" data-name="label-row">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[18px] relative shrink-0 text-[#3c4242]">Type</p>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#830051]">*</p>
    </div>
  );
}

function DropdownBox() {
  return (
    <div className="bg-white h-[36px] relative rounded-[4px] shrink-0 w-full" data-name="dropdown-box">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between pl-[12px] pr-[10px] relative size-full">
          <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[16px] min-w-px not-italic relative text-[#888e8e] text-[12px]">Select a component type</p>
          <div className="overflow-clip relative shrink-0 size-[20px]" data-name="arrow-down-s-line">
            <div className="absolute inset-[34.26%_23.48%_33.33%_23.48%]" data-name="Vector">
              <svg className="absolute block inset-0 size-full" fill="none" height="6.48185" preserveAspectRatio="none" viewBox="0 0 10.6066 6.48185" width="10.6066">
                <path d={svgPaths.p27669b40} fill="var(--fill-0, #888E8E)" id="Vector" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#ebecec] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function LabelRow2() {
  return (
    <div className="content-stretch flex gap-[2px] items-center overflow-clip relative shrink-0" data-name="label-row">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[#3c4242] text-[12px] whitespace-nowrap">Custom instructions</p>
    </div>
  );
}

function InputBox1() {
  return (
    <div className="bg-white h-[90px] relative rounded-[4px] shrink-0 w-full" data-name="input-box">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pl-[12px] pr-[20px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#888e8e] text-[12px] w-full">Describe the component...</p>
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#ebecec] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Container2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start p-[12px] relative size-full">
        <div className="relative shrink-0 w-full" data-name="Form/Input Field">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[6px] items-start relative size-full">
            <LabelRow />
            <InputBox />
          </div>
        </div>
        <div className="relative shrink-0 w-full" data-name="Form/Dropdown Field">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[6px] items-start relative size-full">
            <LabelRow1 />
            <DropdownBox />
          </div>
        </div>
        <div className="relative shrink-0 w-full" data-name="Form/Input Field Paragraph">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[6px] items-start relative size-full">
            <LabelRow2 />
            <InputBox1 />
          </div>
        </div>
        <div className="bg-[#830051] relative rounded-[4px] shrink-0 w-full" data-name="Button/Primary">
          <div className="flex flex-row items-center justify-center size-full">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[4px] relative size-full">
              <div className="overflow-clip relative shrink-0 size-[14px]" data-name="shining-fill">
                <div className="absolute inset-[4.17%]" data-name="Vector">
                  <svg className="absolute block inset-0 size-full" fill="none" height="12.8333" preserveAspectRatio="none" viewBox="0 0 12.8333 12.8333" width="12.8333">
                    <path d={svgPaths.p2ddb1e80} fill="var(--fill-0, white)" id="Vector" />
                  </svg>
                </div>
              </div>
              <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">
                <p className="leading-[18px]">Generate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Container() {
  return (
    <div className="bg-white content-stretch drop-shadow-[0px_4px_6px_rgba(0,0,0,0.15)] flex flex-col items-start p-px relative rounded-[8px] size-full" data-name="Container">
      <div aria-hidden className="absolute border border-[#d8dada] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Container1 />
      <Container2 />
    </div>
  );
}