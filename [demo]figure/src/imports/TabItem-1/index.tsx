import svgPaths from "./svg-tsrlums199";

export default function TabItem() {
  return (
    <div className="bg-[#f4e8ee] content-stretch flex gap-[4px] items-center pl-[8px] pr-[4px] py-[6px] relative rounded-[4px] size-full" data-name="Tab/Item">
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[18px] min-w-px not-italic overflow-hidden relative text-[#830051] text-[12px] text-ellipsis whitespace-nowrap">Component name</p>
      <div className="overflow-clip relative rounded-[4.8px] shrink-0 size-[24px]" data-name="Icon/Code-Status">
        <div className="absolute inset-[15%_12.14%_13.06%_13%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" height="17.2666" preserveAspectRatio="none" viewBox="0 0 17.9667 17.2666" width="17.9667">
            <path d={svgPaths.p2fedb8c0} fill="url(#paint0_linear_4019_694)" id="Vector" />
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_4019_694" x1="17.9667" x2="0" y1="8.63332" y2="8.63332">
                <stop stopColor="#DFA9FF" />
                <stop offset="0.342857" stopColor="#939AFF" />
                <stop offset="0.7" stopColor="#078EFB" />
                <stop offset="1" stopColor="#406AFB" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}