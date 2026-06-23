import svgPaths from "./svg-1dgvh63ado";

function Switch() {
  return (
    <div className="content-stretch flex gap-[2px] items-center overflow-clip p-[4px] relative rounded-[4px] shrink-0" data-name="Switch">
      <div className="[word-break:break-word] flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3c4242] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[20px]">All</p>
      </div>
    </div>
  );
}

function Switch1() {
  return (
    <div className="bg-[#ebecec] content-stretch flex gap-[2px] items-center overflow-clip px-[4px] py-[2px] relative rounded-[4px] shrink-0" data-name="Switch">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Table">
        <div className="absolute inset-[12.5%_8.33%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 12">
            <path d={svgPaths.p2304c200} fill="var(--fill-0, #888E8E)" id="Vector" />
          </svg>
        </div>
      </div>
      <div className="[word-break:break-word] flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3c4242] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[20px]">Table</p>
      </div>
    </div>
  );
}

export default function Category() {
  return (
    <div className="content-stretch flex gap-[8px] items-center px-[8px] py-[4px] relative size-full" data-name="Category">
      <Switch />
      <Switch1 />
      <div className="overflow-clip relative rounded-[4px] shrink-0 size-[24px]" data-name="Icon button">
        <div className="absolute inset-[16.67%] overflow-clip" data-name="Listing">
          <div className="absolute inset-[14.58%_12.5%]" data-name="Vector">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 11.3333">
              <path d={svgPaths.p32eae080} fill="var(--fill-0, #888E8E)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="overflow-clip relative rounded-[4px] shrink-0 size-[24px]" data-name="Icon button">
        <div className="absolute inset-[16.67%] overflow-clip" data-name="Figure">
          <div className="absolute inset-[12.5%_8.33%]" data-name="Vector">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 12">
              <path d={svgPaths.p1c14f600} fill="var(--fill-0, #888E8E)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}