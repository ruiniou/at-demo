import svgPaths from "./svg-ti9se8ucwm";

function Heading() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Heading">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <div className="overflow-clip relative shrink-0 size-[20px]" data-name="error-warning-line">
          <div className="absolute inset-[8.33%]" data-name="Vector">
            <svg className="absolute block inset-0 size-full" fill="none" height="16.6667" preserveAspectRatio="none" viewBox="0 0 16.6667 16.6667" width="16.6667">
              <path d={svgPaths.pa354180} fill="var(--fill-0, #E11D48)" id="Vector" />
            </svg>
          </div>
        </div>
        <p className="[word-break:break-word] flex-[1_0_0] font-['Roboto_Slab:SemiBold',sans-serif] font-semibold leading-[22px] min-w-px relative text-[#3c4242] text-[16px]">Delete this component?</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[65px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden className="absolute border-[#d8dada] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pb-[17px] pt-[16px] px-[24px] relative size-full">
          <Heading />
          <div className="relative rounded-[4px] shrink-0 size-[24px]" data-name="Icon button">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
              <div className="absolute inset-[16.67%] overflow-clip" data-name="close-line">
                <div className="absolute inset-[23.49%_23.48%_23.48%_23.48%]" data-name="Vector">
                  <svg className="absolute block inset-0 size-full" fill="none" height="8.48525" preserveAspectRatio="none" viewBox="0 0 8.48531 8.48525" width="8.48531">
                    <path d={svgPaths.p601fc00} fill="var(--fill-0, #888E8E)" id="Vector" />
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

function Container1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start px-[24px] py-[20px] relative size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#888e8e] text-[14px] w-full">This action cannot be undone. To temporarily retire it, use Deprecate instead.</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div aria-hidden className="absolute border-[#d8dada] border-solid border-t inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex gap-[12px] items-center justify-end pb-[20px] pt-[21px] px-[24px] relative size-full">
          <div className="h-[36px] relative rounded-[4px] shrink-0" data-name="Button/No-fill">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center px-[12px] py-[8px] relative size-full">
              <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#3c4242] text-[0px] whitespace-nowrap">
                <p className="leading-[24px] text-[14px]">Cancel</p>
              </div>
            </div>
          </div>
          <div className="bg-[#cc2c3c] relative rounded-[4px] shrink-0" data-name="Button/Primary">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center px-[12px] py-[8px] relative size-full">
              <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">
                <p className="leading-[24px]">Delete</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Modal() {
  return (
    <div className="bg-white content-stretch drop-shadow-[0px_4px_6px_rgba(0,0,0,0.15)] flex flex-col items-start relative rounded-[8px] size-full" data-name="Modal">
      <Container />
      <Container1 />
      <Container2 />
    </div>
  );
}