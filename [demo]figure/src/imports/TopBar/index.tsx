import svgPaths from "./svg-er3wrwqoab";

function TabSwitch() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative" data-name="Tab switch">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[4px] items-center pr-[16px] relative size-full">
          <div className="overflow-clip relative shrink-0 size-[20px]" data-name="code-s-slash-line">
            <div className="absolute inset-[15.63%_4.17%]" data-name="Vector">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.3333 13.75">
                <path d={svgPaths.p2c95f900} fill="var(--fill-0, #888E8E)" id="Vector" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IconButtonWrap() {
  return (
    <div className="content-stretch flex gap-[2px] items-center relative shrink-0" data-name="Icon Button Wrap">
      <div className="overflow-clip relative rounded-[4px] shrink-0 size-[24px]" data-name="Icon button">
        <div className="absolute inset-[16.67%] overflow-clip" data-name="save-line">
          <div className="absolute inset-[12.5%]" data-name="Vector">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
              <path d={svgPaths.p2358eff2} fill="var(--fill-0, #888E8E)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
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
              <path d={svgPaths.p28fa4580} fill="var(--fill-0, #888E8E)" id="è·¯å¾" />
            </svg>
          </div>
        </div>
      </div>
      <div className="overflow-clip relative rounded-[4px] shrink-0 size-[24px]" data-name="Icon button">
        <div className="absolute inset-[16.67%] overflow-clip" data-name="Table item/Unlock">
          <div className="absolute inset-[4.17%_8.33%]" data-name="Union">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 14.6667">
              <path clipRule="evenodd" d={svgPaths.p3c279efc} fill="var(--fill-0, #888E8E)" fillRule="evenodd" id="Union" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToolBar() {
  return (
    <div className="content-stretch flex h-full items-center justify-end relative shrink-0" data-name="Tool bar">
      <IconButtonWrap />
    </div>
  );
}

export default function TopBar() {
  return (
    <div className="bg-white content-stretch flex items-center justify-between pl-[12px] pr-[16px] relative size-full" data-name="Top Bar">
      <div aria-hidden className="absolute border-[#ebecec] border-b border-solid inset-0 pointer-events-none" />
      <TabSwitch />
      <ToolBar />
    </div>
  );
}