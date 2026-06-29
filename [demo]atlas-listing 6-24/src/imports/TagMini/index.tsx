import svgPaths from "./svg-rj8j4acajd";

export default function TagMini() {
  return (
    <div className="bg-[#f4e8ee] content-stretch flex gap-[4px] items-center justify-center pl-[2px] pr-[6px] relative rounded-[4px] size-full" data-name="Tag/Mini">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="code-line">
        <div className="absolute inset-[20.54%_4.17%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.6667 9.42809">
            <path d={svgPaths.p4accf00} fill="var(--fill-0, #830051)" id="Vector" />
          </svg>
        </div>
      </div>
      <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] max-w-[152px] min-w-px not-italic overflow-hidden relative text-[#830051] text-[13px] text-ellipsis whitespace-nowrap">
        <p className="leading-[20px] overflow-hidden text-ellipsis">Table.1(290-321)</p>
      </div>
    </div>
  );
}