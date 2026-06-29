import svgPaths from "./svg-gfxzdmcc6f";

function PageSeparator() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="page-separator">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="page-separator">
          <path d={svgPaths.p165b3c80} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

export default function Frame() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center px-[4px] relative rounded-[4px] size-full">
      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[12px] text-black whitespace-nowrap">分页预览</p>
      <PageSeparator />
    </div>
  );
}