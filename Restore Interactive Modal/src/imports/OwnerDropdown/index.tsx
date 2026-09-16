import svgPaths from "./svg-m4zohu9jkg";
type OwnerDropdownProps = {
  className?: string;
  status?: "Default" | "Result";
};

export default function OwnerDropdown({ className, status = "Default" }: OwnerDropdownProps) {
  const isDefault = status === "Default";
  const isResult = status === "Result";
  return (
    <div className={className || "bg-white relative rounded-[8px] size-[240px]"}>
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[8px] items-start p-[4px] relative size-full">
          {isDefault && (
            <>
              <button className="bg-[#e6ccdc] cursor-pointer h-[36px] relative rounded-[4px] shrink-0 w-full" data-name="Search bar">
                <div aria-hidden className="absolute border border-[#830051] border-solid inset-0 pointer-events-none rounded-[4px]" />
                <div className="flex flex-row items-center size-full">
                  <div className="content-stretch flex items-center p-[2px] relative size-full">
                    <div className="bg-white flex-[1_0_0] h-full min-w-px relative" data-name="Inner">
                      <div className="flex flex-row items-center size-full">
                        <div className="content-stretch flex items-center px-[6px] py-[4px] relative size-full">
                          <div className="content-stretch flex flex-[1_0_0] gap-[6px] items-center min-w-px relative" data-name="Label">
                            <div className="content-stretch flex flex-[1_0_0] items-center justify-center min-w-px relative" data-name="Input field">
                              <div aria-hidden className="absolute border-[#3f4444] border-l border-solid inset-0 pointer-events-none" />
                              <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[18px] min-w-px not-italic relative text-[#8c8f8f] text-[12px] text-left">Search people...</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
              <div className="content-stretch flex flex-col gap-[2px] items-start max-h-[206px] overflow-x-clip overflow-y-auto relative shrink-0 w-full" data-name="Option list">
                <div className="relative rounded-[2px] shrink-0 w-full" data-name="Option label">
                  <div className="flex flex-row items-center size-full">
                    <div className="content-stretch flex gap-[8px] items-center pl-[4px] pr-[12px] py-[2px] relative size-full">
                      <div className="bg-[#f0ab00] relative rounded-[12px] shrink-0 size-[16px]" data-name="Avatar">
                        <div aria-hidden className="absolute border-[#ececec] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[12px]" />
                        <div className="flex flex-row items-center justify-center size-full">
                          <div className="content-stretch flex items-center justify-center relative size-full">
                            <div className="h-[5.994px] relative shrink-0 w-[10.211px]" data-name="Initials">
                              <svg className="absolute block inset-0 size-full" fill="none" height="5.99432" preserveAspectRatio="none" viewBox="0 0 10.2109 5.99432" width="10.2109">
                                <g id="Initials">
                                  <path d={svgPaths.p186f5900} fill="white" />
                                  <path d={svgPaths.p33b10200} fill="white" />
                                </g>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#3c4242] text-[12px] whitespace-nowrap">Sarah Chen</p>
                      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#888e8e] text-[12px] text-ellipsis whitespace-nowrap">(You)</p>
                    </div>
                  </div>
                </div>
                <div className="relative rounded-[2px] shrink-0 w-full" data-name="Option label">
                  <div className="flex flex-row items-center size-full">
                    <div className="content-stretch flex gap-[8px] items-center pl-[4px] pr-[12px] py-[2px] relative size-full">
                      <div className="bg-[#830051] relative rounded-[12px] shrink-0 size-[16px]" data-name="Avatar">
                        <div aria-hidden className="absolute border-[#ececec] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[12px]" />
                        <div className="flex flex-row items-center justify-center size-full">
                          <div className="content-stretch flex items-center justify-center relative size-full" />
                        </div>
                      </div>
                      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#3c4242] text-[12px] whitespace-nowrap">Michael Ross</p>
                    </div>
                  </div>
                </div>
                <div className="relative rounded-[2px] shrink-0 w-full" data-name="Option label">
                  <div className="flex flex-row items-center size-full">
                    <div className="content-stretch flex gap-[8px] items-center pl-[4px] pr-[12px] py-[2px] relative size-full">
                      <div className="bg-[#d0006f] relative rounded-[12px] shrink-0 size-[16px]" data-name="Avatar">
                        <div aria-hidden className="absolute border-[#ececec] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[12px]" />
                        <div className="flex flex-row items-center justify-center size-full">
                          <div className="content-stretch flex items-center justify-center relative size-full" />
                        </div>
                      </div>
                      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#3c4242] text-[12px] whitespace-nowrap">James Liu</p>
                    </div>
                  </div>
                </div>
                <div className="relative rounded-[2px] shrink-0 w-full" data-name="Option label">
                  <div className="flex flex-row items-center size-full">
                    <div className="content-stretch flex gap-[8px] items-center pl-[4px] pr-[12px] py-[2px] relative size-full">
                      <div className="bg-[#9db0ac] relative rounded-[12px] shrink-0 size-[16px]" data-name="Avatar">
                        <div aria-hidden className="absolute border-[#ececec] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[12px]" />
                        <div className="flex flex-row items-center justify-center size-full">
                          <div className="content-stretch flex items-center justify-center relative size-full" />
                        </div>
                      </div>
                      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#3c4242] text-[12px] whitespace-nowrap">Emily Wang</p>
                    </div>
                  </div>
                </div>
                <div className="relative rounded-[2px] shrink-0 w-full" data-name="Option label">
                  <div className="flex flex-row items-center size-full">
                    <div className="content-stretch flex gap-[8px] items-center pl-[4px] pr-[12px] py-[2px] relative size-full">
                      <div className="bg-[#8c8f8f] relative rounded-[12px] shrink-0 size-[16px]" data-name="Avatar">
                        <div aria-hidden className="absolute border-[#ececec] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[12px]" />
                        <div className="flex flex-row items-center justify-center size-full">
                          <div className="content-stretch flex items-center justify-center relative size-full" />
                        </div>
                      </div>
                      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#3c4242] text-[12px] whitespace-nowrap">David Park</p>
                    </div>
                  </div>
                </div>
                <div className="relative rounded-[2px] shrink-0 w-full" data-name="Option label">
                  <div className="flex flex-row items-center size-full">
                    <div className="content-stretch flex gap-[8px] items-center pl-[4px] pr-[12px] py-[2px] relative size-full">
                      <div className="bg-[#8c8f8f] relative rounded-[12px] shrink-0 size-[16px]" data-name="Avatar">
                        <div aria-hidden className="absolute border-[#ececec] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[12px]" />
                        <div className="flex flex-row items-center justify-center size-full">
                          <div className="content-stretch flex items-center justify-center relative size-full" />
                        </div>
                      </div>
                      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#3c4242] text-[12px] whitespace-nowrap">David Park</p>
                    </div>
                  </div>
                </div>
                <div className="relative rounded-[2px] shrink-0 w-full" data-name="Option label">
                  <div className="flex flex-row items-center size-full">
                    <div className="content-stretch flex gap-[8px] items-center pl-[4px] pr-[12px] py-[2px] relative size-full">
                      <div className="bg-[#8c8f8f] relative rounded-[12px] shrink-0 size-[16px]" data-name="Avatar">
                        <div aria-hidden className="absolute border-[#ececec] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[12px]" />
                        <div className="flex flex-row items-center justify-center size-full">
                          <div className="content-stretch flex items-center justify-center relative size-full" />
                        </div>
                      </div>
                      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#3c4242] text-[12px] whitespace-nowrap">David Park</p>
                    </div>
                  </div>
                </div>
                <div className="relative rounded-[2px] shrink-0 w-full" data-name="Option label">
                  <div className="flex flex-row items-center size-full">
                    <div className="content-stretch flex gap-[8px] items-center pl-[4px] pr-[12px] py-[2px] relative size-full">
                      <div className="bg-[#8c8f8f] relative rounded-[12px] shrink-0 size-[16px]" data-name="Avatar">
                        <div aria-hidden className="absolute border-[#ececec] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[12px]" />
                        <div className="flex flex-row items-center justify-center size-full">
                          <div className="content-stretch flex items-center justify-center relative size-full">
                            <div className="h-[5.994px] relative shrink-0 w-[10.211px]" data-name="Initials">
                              <svg className="absolute block inset-0 size-full" fill="none" height="5.99432" preserveAspectRatio="none" viewBox="0 0 10.2109 5.99432" width="10.2109">
                                <g id="Initials">
                                  <path d={svgPaths.p186f5900} fill="white" />
                                  <path d={svgPaths.p33b10200} fill="white" />
                                </g>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#3c4242] text-[12px] whitespace-nowrap">David Park</p>
                    </div>
                  </div>
                </div>
                <div className="absolute h-[194px] right-0 top-0 w-[10px]" data-name="Owner Dropdown/Scrollbar">
                  <div className="flex flex-row justify-center size-full">
                    <div className="content-stretch flex items-start justify-center py-[2px] relative size-full">
                      <div className="bg-[rgba(216,218,218,0.75)] h-[181px] relative rounded-[8px] shrink-0 w-[4px]" data-name="Scrollbar" />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {isResult && (
            <>
              <div className="bg-[#e6ccdc] relative rounded-[4px] shrink-0 w-full" data-name="Search bar">
                <div aria-hidden className="absolute border border-[#830051] border-solid inset-0 pointer-events-none rounded-[4px]" />
                <div className="flex flex-row items-center size-full">
                  <div className="content-stretch flex items-center p-[2px] relative size-full">
                    <div className="bg-white flex-[1_0_0] min-w-px relative" data-name="Inner">
                      <div className="flex flex-row items-center size-full">
                        <div className="content-stretch flex gap-[6px] items-center px-[6px] py-[4px] relative size-full">
                          <div className="content-center flex flex-[1_0_0] flex-wrap gap-[4px] items-center min-w-px relative" data-name="Label">
                            <div className="bg-[#ececec] max-w-[160px] relative rounded-[4px] shrink-0" data-name="Tag">
                              <div className="flex flex-row items-center max-w-[inherit] size-full">
                                <div className="content-stretch flex gap-[4px] items-center max-w-[inherit] px-[6px] py-[2px] relative size-full">
                                  <div className="bg-[#f0ab00] relative rounded-[12px] shrink-0 size-[16px]" data-name="Prefix">
                                    <div aria-hidden className="absolute border-[#ececec] border-[0.667px] border-solid inset-0 pointer-events-none rounded-[12px]" />
                                    <div className="flex flex-row items-center justify-center size-full">
                                      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                                        <div className="h-[4.995px] relative shrink-0 w-[8.509px]" data-name="Initials">
                                          <svg className="absolute block inset-0 size-full" fill="none" height="4.99527" preserveAspectRatio="none" viewBox="0 0 8.50912 4.99527" width="8.50912">
                                            <g id="Initials">
                                              <path d={svgPaths.p3f48ce00} fill="white" />
                                              <path d={svgPaths.p32464400} fill="white" />
                                            </g>
                                          </svg>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="relative shrink-0" data-name="Text">
                                    <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                                      <div className="[word-break:break-word] flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[#3c4242] text-[12px] text-ellipsis whitespace-nowrap">
                                        <p className="leading-[20px] overflow-hidden text-ellipsis">Sarah Chen</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="relative shrink-0 size-[12px]" data-name="close-line">
                                    <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
                                      <div className="absolute inset-[23.49%_23.48%_23.48%_23.48%]" data-name="Vector">
                                        <svg className="absolute block inset-0 size-full" fill="none" height="6.36394" preserveAspectRatio="none" viewBox="0 0 6.36398 6.36394" width="6.36398">
                                          <path d={svgPaths.p6f9ad00} fill="#888E8E" id="Vector" />
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="bg-[#ececec] max-w-[160px] relative rounded-[4px] shrink-0" data-name="Tag">
                              <div className="flex flex-row items-center max-w-[inherit] size-full">
                                <div className="content-stretch flex gap-[4px] items-center max-w-[inherit] px-[6px] py-[2px] relative size-full">
                                  <div className="bg-[#d0006f] relative rounded-[12px] shrink-0 size-[16px]" data-name="Prefix">
                                    <div aria-hidden className="absolute border-[#ececec] border-[0.667px] border-solid inset-0 pointer-events-none rounded-[12px]" />
                                    <div className="flex flex-row items-center justify-center size-full">
                                      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                                        <div className="h-[4.995px] relative shrink-0 w-[8.509px]" data-name="Initials">
                                          <svg className="absolute block inset-0 size-full" fill="none" height="32" preserveAspectRatio="none" viewBox="0 0 32 32" width="32">
                                            <g id="Initials" />
                                          </svg>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="relative shrink-0" data-name="Text">
                                    <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                                      <div className="[word-break:break-word] flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[#3c4242] text-[12px] text-ellipsis whitespace-nowrap">
                                        <p className="leading-[20px] overflow-hidden text-ellipsis">James Liu</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="relative shrink-0 size-[12px]" data-name="close-line">
                                    <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
                                      <div className="absolute inset-[23.49%_23.48%_23.48%_23.48%]" data-name="Vector">
                                        <svg className="absolute block inset-0 size-full" fill="none" height="6.36394" preserveAspectRatio="none" viewBox="0 0 6.36398 6.36394" width="6.36398">
                                          <path d={svgPaths.p6f9ad00} fill="#888E8E" id="Vector" />
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="overflow-clip relative rounded-[4px] shrink-0 size-[24px]" data-name="Icon button">
                            <div className="absolute inset-[16.67%] overflow-clip" data-name="close-line">
                              <div className="absolute inset-[23.49%_23.48%_23.48%_23.48%]" data-name="Vector">
                                <svg className="absolute block inset-0 size-full" fill="none" height="8.48525" preserveAspectRatio="none" viewBox="0 0 8.48531 8.48525" width="8.48531">
                                  <path d={svgPaths.p601fc00} fill="#8C8F8F" id="Vector" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[2px] items-start max-h-[206px] overflow-x-clip overflow-y-auto relative shrink-0 w-full" data-name="Option list">
                <div className="relative rounded-[2px] shrink-0 w-full" data-name="Option label">
                  <div className="flex flex-row items-center size-full">
                    <div className="content-stretch flex gap-[8px] items-center pl-[4px] pr-[12px] py-[2px] relative size-full">
                      <div className="bg-[#f0ab00] relative rounded-[12px] shrink-0 size-[16px]" data-name="Avatar">
                        <div aria-hidden className="absolute border-[#ececec] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[12px]" />
                        <div className="flex flex-row items-center justify-center size-full">
                          <div className="content-stretch flex items-center justify-center relative size-full">
                            <div className="h-[5.994px] relative shrink-0 w-[10.211px]" data-name="Initials">
                              <svg className="absolute block inset-0 size-full" fill="none" height="5.99432" preserveAspectRatio="none" viewBox="0 0 10.2109 5.99432" width="10.2109">
                                <g id="Initials">
                                  <path d={svgPaths.p186f5900} fill="white" />
                                  <path d={svgPaths.p33b10200} fill="white" />
                                </g>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#3c4242] text-[12px] whitespace-nowrap">Sarah Chen</p>
                      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#888e8e] text-[12px] text-ellipsis whitespace-nowrap">(You)</p>
                    </div>
                  </div>
                </div>
                <div className="relative rounded-[2px] shrink-0 w-full" data-name="Option label">
                  <div className="flex flex-row items-center size-full">
                    <div className="content-stretch flex gap-[8px] items-center pl-[4px] pr-[12px] py-[2px] relative size-full">
                      <div className="bg-[#830051] relative rounded-[12px] shrink-0 size-[16px]" data-name="Avatar">
                        <div aria-hidden className="absolute border-[#ececec] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[12px]" />
                        <div className="flex flex-row items-center justify-center size-full">
                          <div className="content-stretch flex items-center justify-center relative size-full" />
                        </div>
                      </div>
                      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#3c4242] text-[12px] whitespace-nowrap">Michael Ross</p>
                    </div>
                  </div>
                </div>
                <div className="relative rounded-[2px] shrink-0 w-full" data-name="Option label">
                  <div className="flex flex-row items-center size-full">
                    <div className="content-stretch flex gap-[8px] items-center pl-[4px] pr-[12px] py-[2px] relative size-full">
                      <div className="bg-[#d0006f] relative rounded-[12px] shrink-0 size-[16px]" data-name="Avatar">
                        <div aria-hidden className="absolute border-[#ececec] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[12px]" />
                        <div className="flex flex-row items-center justify-center size-full">
                          <div className="content-stretch flex items-center justify-center relative size-full" />
                        </div>
                      </div>
                      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#3c4242] text-[12px] whitespace-nowrap">James Liu</p>
                    </div>
                  </div>
                </div>
                <div className="relative rounded-[2px] shrink-0 w-full" data-name="Option label">
                  <div className="flex flex-row items-center size-full">
                    <div className="content-stretch flex gap-[8px] items-center pl-[4px] pr-[12px] py-[2px] relative size-full">
                      <div className="bg-[#9db0ac] relative rounded-[12px] shrink-0 size-[16px]" data-name="Avatar">
                        <div aria-hidden className="absolute border-[#ececec] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[12px]" />
                        <div className="flex flex-row items-center justify-center size-full">
                          <div className="content-stretch flex items-center justify-center relative size-full" />
                        </div>
                      </div>
                      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#3c4242] text-[12px] whitespace-nowrap">Emily Wang</p>
                    </div>
                  </div>
                </div>
                <div className="relative rounded-[2px] shrink-0 w-full" data-name="Option label">
                  <div className="flex flex-row items-center size-full">
                    <div className="content-stretch flex gap-[8px] items-center pl-[4px] pr-[12px] py-[2px] relative size-full">
                      <div className="bg-[#8c8f8f] relative rounded-[12px] shrink-0 size-[16px]" data-name="Avatar">
                        <div aria-hidden className="absolute border-[#ececec] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[12px]" />
                        <div className="flex flex-row items-center justify-center size-full">
                          <div className="content-stretch flex items-center justify-center relative size-full" />
                        </div>
                      </div>
                      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#3c4242] text-[12px] whitespace-nowrap">David Park</p>
                    </div>
                  </div>
                </div>
                <div className="relative rounded-[2px] shrink-0 w-full" data-name="Option label">
                  <div className="flex flex-row items-center size-full">
                    <div className="content-stretch flex gap-[8px] items-center pl-[4px] pr-[12px] py-[2px] relative size-full">
                      <div className="bg-[#8c8f8f] relative rounded-[12px] shrink-0 size-[16px]" data-name="Avatar">
                        <div aria-hidden className="absolute border-[#ececec] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[12px]" />
                        <div className="flex flex-row items-center justify-center size-full">
                          <div className="content-stretch flex items-center justify-center relative size-full" />
                        </div>
                      </div>
                      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#3c4242] text-[12px] whitespace-nowrap">David Park</p>
                    </div>
                  </div>
                </div>
                <div className="relative rounded-[2px] shrink-0 w-full" data-name="Option label">
                  <div className="flex flex-row items-center size-full">
                    <div className="content-stretch flex gap-[8px] items-center pl-[4px] pr-[12px] py-[2px] relative size-full">
                      <div className="bg-[#8c8f8f] relative rounded-[12px] shrink-0 size-[16px]" data-name="Avatar">
                        <div aria-hidden className="absolute border-[#ececec] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[12px]" />
                        <div className="flex flex-row items-center justify-center size-full">
                          <div className="content-stretch flex items-center justify-center relative size-full" />
                        </div>
                      </div>
                      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#3c4242] text-[12px] whitespace-nowrap">David Park</p>
                    </div>
                  </div>
                </div>
                <div className="relative rounded-[2px] shrink-0 w-full" data-name="Option label">
                  <div className="flex flex-row items-center size-full">
                    <div className="content-stretch flex gap-[8px] items-center pl-[4px] pr-[12px] py-[2px] relative size-full">
                      <div className="bg-[#8c8f8f] relative rounded-[12px] shrink-0 size-[16px]" data-name="Avatar">
                        <div aria-hidden className="absolute border-[#ececec] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[12px]" />
                        <div className="flex flex-row items-center justify-center size-full">
                          <div className="content-stretch flex items-center justify-center relative size-full">
                            <div className="h-[5.994px] relative shrink-0 w-[10.211px]" data-name="Initials">
                              <svg className="absolute block inset-0 size-full" fill="none" height="5.99432" preserveAspectRatio="none" viewBox="0 0 10.2109 5.99432" width="10.2109">
                                <g id="Initials">
                                  <path d={svgPaths.p186f5900} fill="white" />
                                  <path d={svgPaths.p33b10200} fill="white" />
                                </g>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#3c4242] text-[12px] whitespace-nowrap">David Park</p>
                    </div>
                  </div>
                </div>
                <div className="absolute h-[162px] right-0 top-0 w-[10px]" data-name="Owner Dropdown/Scrollbar">
                  <div className="flex flex-row justify-center size-full">
                    <div className="content-stretch flex items-start justify-center py-[2px] relative size-full">
                      <div className="bg-[rgba(216,218,218,0.75)] h-full relative rounded-[8px] shrink-0 w-[4px]" data-name="Scrollbar" />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#ececec] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)]" />
    </div>
  );
}