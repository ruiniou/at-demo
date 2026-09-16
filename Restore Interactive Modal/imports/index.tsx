import svgPaths from "./svg-4ozr7xtg5v";
type DownloadSasProgramsModalProps = {
  className?: string;
  state?: "Default" | "Owner Filtered" | "Empty" | "Loading";
};

export default function DownloadSasProgramsModal({ className, state = "Default" }: DownloadSasProgramsModalProps) {
  const isDefault = state === "Default";
  const isDefaultOrOwnerFiltered = ["Default", "Owner Filtered"].includes(state);
  const isDefaultOrOwnerFilteredOrEmpty = ["Default", "Owner Filtered", "Empty"].includes(state);
  const isEmpty = state === "Empty";
  const isLoading = state === "Loading";
  const isOwnerFiltered = state === "Owner Filtered";
  const isOwnerFilteredOrEmpty = ["Owner Filtered", "Empty"].includes(state);
  return (
    <div className={className || "bg-white relative rounded-[8px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.12)] w-[800px]"}>
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start relative size-full">
          <div className="content-stretch flex items-center justify-between px-[24px] py-[16px] relative shrink-0 w-full" data-name="Header">
            <div className="content-stretch flex flex-[1_0_0] items-center min-w-px relative" data-name="Heading">
              <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] min-w-px not-italic relative text-[#3c4242] text-[16px]">Download SAS Programs</p>
            </div>
            <div className="overflow-clip relative rounded-[4px] shrink-0 size-[24px]" data-name="Icon button">
              <div className="absolute inset-[16.67%] overflow-clip" data-name="close-line">
                <div className="absolute inset-[23.49%_23.48%_23.48%_23.48%]" data-name="Vector">
                  <svg className="absolute block inset-0 size-full" fill="none" height="8.48525" preserveAspectRatio="none" viewBox="0 0 8.48531 8.48525" width="8.48531">
                    <path d={svgPaths.p601fc00} fill="#888E8E" id="Vector" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className={`content-stretch flex flex-col h-[590px] overflow-clip relative shrink-0 w-full ${isLoading ? "items-center justify-center p-[20px]" : "gap-[8px] items-start pb-[20px] pt-[12px] px-[20px]"}`} data-name="Body">
            {isDefaultOrOwnerFilteredOrEmpty && (
              <>
                <div className={`relative rounded-[4px] shrink-0 w-full ${isEmpty ? "bg-[#e6ccdc] h-[32px]" : ""}`} data-name="Search bar">
                  <div aria-hidden className={`absolute border-solid inset-0 pointer-events-none rounded-[4px] ${isEmpty ? "border border-[#830051]" : "border-[#d8dada] border-[0.6px]"}`} />
                  <div className="flex flex-row items-center size-full">
                    <div className="content-stretch flex items-center p-[2px] relative size-full">
                      {["Default", "Empty"].includes(state) && (
                        <div className={`bg-white flex-[1_0_0] min-w-px relative ${isEmpty ? "h-full" : ""}`} data-name="Inner">
                          <div className="flex flex-row items-center size-full">
                            <div className="content-stretch flex items-center px-[6px] py-[4px] relative size-full">
                              <div className="content-stretch flex flex-[1_0_0] gap-[6px] items-center min-w-px relative" data-name="Label">
                                <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Option/search-line">
                                  <div className="absolute inset-[8.33%_7.03%_7.03%_8.33%]" data-name="Vector">
                                    <svg className="absolute block inset-0 size-full" fill="none" height="13.5425" preserveAspectRatio="none" viewBox="0 0 13.5425 13.5425" width="13.5425">
                                      <path d={svgPaths.p2dab6600} fill="#888E8E" id="Vector" />
                                    </svg>
                                  </div>
                                </div>
                                <div className={`content-stretch flex flex-[1_0_0] items-center min-w-px relative ${isEmpty ? "" : "justify-center"}`} data-name="Input field">
                                  <p className={`[word-break:break-word] flex-[1_0_0] font-["PingFang_SC:Regular",sans-serif] leading-[20px] min-w-px not-italic relative text-[12px] ${isEmpty ? "text-[#3f4444]" : "text-[#888e8e]"}`}>{isEmpty ? "Macro name" : "Search title, name, or macro"}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {isOwnerFiltered && (
                        <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
                          <div className="bg-white flex-[1_0_0] h-full min-w-px relative" data-name="Inner">
                            <div className="flex flex-row items-center size-full">
                              <div className="content-stretch flex items-center px-[6px] py-[4px] relative size-full">
                                <div className="content-stretch flex flex-[1_0_0] gap-[6px] items-center min-w-px relative" data-name="Label">
                                  <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Option/search-line">
                                    <div className="absolute inset-[8.33%_7.03%_7.03%_8.33%]" data-name="Vector">
                                      <svg className="absolute block inset-0 size-full" fill="none" height="13.5425" preserveAspectRatio="none" viewBox="0 0 13.5425 13.5425" width="13.5425">
                                        <path d={svgPaths.p2dab6600} fill="#888E8E" id="Vector" />
                                      </svg>
                                    </div>
                                  </div>
                                  <div className="content-stretch flex flex-[1_0_0] items-center justify-center min-w-px relative" data-name="Input field">
                                    <p className="[word-break:break-word] flex-[1_0_0] font-['PingFang_SC:Regular',sans-serif] leading-[20px] min-w-px not-italic relative text-[#888e8e] text-[12px]">Search title, name, or macro</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Filter Bar">
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Left Filters">
                    <div className={`h-[28px] max-w-[300px] relative rounded-[4px] shrink-0 ${isEmpty ? "bg-[#f4e8ee]" : ""}`} data-name="Filter Chip">
                      <div className="flex flex-row items-center max-w-[inherit] size-full">
                        <div className="content-stretch flex gap-[4px] items-center max-w-[inherit] px-[8px] py-[6px] relative size-full">
                          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Table item/Lock">
                            <div className="absolute inset-[4.17%_8.33%]" data-name="Union">
                              <svg className="absolute block inset-0 size-full" fill="none" height="14.6667" preserveAspectRatio="none" viewBox="0 0 13.3333 14.6667" width="13.3333">
                                <path clipRule="evenodd" d={svgPaths.p26763e00} fill={isEmpty ? "#830051" : "#3F4444"} fillRule="evenodd" id="Union" />
                              </svg>
                            </div>
                          </div>
                          <p className={`[word-break:break-word] flex-[1_0_0] font-["Inter:Regular",sans-serif] font-normal leading-[18px] min-w-px not-italic relative text-[12px] ${isEmpty ? "text-[#830051]" : "text-[#3f4444]"}`}>Locked Only</p>
                        </div>
                      </div>
                    </div>
                    <div className={`h-[28px] max-w-[300px] relative rounded-[4px] shrink-0 ${isOwnerFilteredOrEmpty ? "bg-[#f4e8ee]" : ""}`} data-name="Filter Chip">
                      <div className="flex flex-row items-center max-w-[inherit] size-full">
                        <div className="content-stretch flex gap-[4px] items-center max-w-[inherit] pl-[8px] pr-[6px] py-[6px] relative size-full">
                          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="user-6-line">
                            <div className="absolute inset-[8.33%_14.14%_9.18%_14.14%]" data-name="Vector">
                              <svg className="absolute block inset-0 size-full" fill="none" height="13.1973" preserveAspectRatio="none" viewBox="0 0 11.4756 13.1973" width="11.4756">
                                <path d={svgPaths.p20d1ed00} fill={isOwnerFilteredOrEmpty ? "#830051" : "#3F4444"} id="Vector" />
                              </svg>
                            </div>
                          </div>
                          <p className={`[word-break:break-word] flex-[1_0_0] font-["Inter:Regular",sans-serif] font-normal leading-[18px] min-w-px not-italic relative text-[12px] ${isOwnerFilteredOrEmpty ? "text-[#830051]" : "text-[#3f4444]"}`}>{isOwnerFilteredOrEmpty ? "Sarah Chen" : "Owner"}</p>
                          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Chevron">
                            <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 overflow-clip size-[16px] top-1/2" data-name="arrow-down-s-line">
                              <div className="absolute inset-[34.26%_23.48%_33.33%_23.48%]" data-name="Vector">
                                <svg className="absolute block inset-0 size-full" fill="none" height="5.18548" preserveAspectRatio="none" viewBox="0 0 8.48527 5.18548" width="8.48527">
                                  <path d={svgPaths.p3cfa0180} fill={isOwnerFilteredOrEmpty ? "#830051" : "#3F4444"} id="Vector" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`border border-[#ececec] border-solid content-stretch flex flex-col items-start relative rounded-[4px] w-full ${isOwnerFilteredOrEmpty ? "flex-[1_0_0] min-h-px" : "shrink-0"}`} data-name="Table Container">
                  <div className="bg-[#f8f7f7] content-stretch flex h-[40px] items-center overflow-clip relative shrink-0 w-full" data-name="Table Header">
                    <div className="content-stretch flex h-full items-center overflow-clip pl-[14px] pr-[8px] relative shrink-0 w-[44px]" data-name="H-Checkbox">
                      <div className="relative shrink-0 size-[16px]" data-name="Checkbox-Square">
                        {isOwnerFilteredOrEmpty && (
                          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[16px] top-1/2" data-name="Outer">
                            <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
                              <path d={svgPaths.p8e46280} fill="#888E8E" id="Outer" />
                            </svg>
                          </div>
                        )}
                        {isDefault && (
                          <>
                            <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[#830051] left-1/2 rounded-[1px] size-[16px] top-1/2" data-name="Rectangle" />
                            <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-white h-[1.6px] left-1/2 top-1/2 w-[8px]" data-name="Line" />
                          </>
                        )}
                      </div>
                    </div>
                    <div className="content-stretch flex h-full items-start overflow-clip pb-[12px] pt-[13px] px-[12px] relative shrink-0 w-[210px]" data-name="H-TLF Title">
                      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#8c8f8f] text-[12px] whitespace-nowrap">Title</p>
                    </div>
                    <div className="content-stretch flex h-full items-center overflow-clip pl-[12px] pr-[8px] relative shrink-0 w-[150px]" data-name="H-Program Name">
                      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#8c8f8f] text-[12px] whitespace-nowrap">Program Name</p>
                    </div>
                    <div className="content-stretch flex h-full items-center overflow-clip pl-[12px] pr-[8px] relative shrink-0 w-[184px]" data-name="H-Macro">
                      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#8c8f8f] text-[12px] whitespace-nowrap">Macro</p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-w-px overflow-clip pl-[12px] pr-[8px] relative" data-name="H-Owner">
                      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#8c8f8f] text-[12px] whitespace-nowrap">Owner</p>
                    </div>
                  </div>
                  <div className={`bg-white content-stretch flex flex-col overflow-clip relative w-full ${isEmpty ? "flex-[1_0_0] items-center justify-center min-h-px" : isOwnerFiltered ? "flex-[1_0_0] items-start min-h-px" : "h-[404px] items-start shrink-0"}`} data-name="Table Body">
                    {isDefaultOrOwnerFiltered && (
                      <>
                        <div className="h-[44px] relative shrink-0 w-full" data-name="Program Row">
                          <div aria-hidden className="absolute border-[#ececec] border-b border-solid inset-0 pointer-events-none" />
                          <div className="flex flex-row items-center size-full">
                            <div className="content-stretch flex items-center relative size-full">
                              <div className="content-stretch flex h-full items-center overflow-clip pl-[14px] pr-[8px] relative shrink-0 w-[44px]" data-name="Cell-CB">
                                <div className="relative shrink-0 size-[16px]" data-name="Checkbox-Square">
                                  {isDefault && (
                                    <>
                                      <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[#830051] left-1/2 rounded-[1px] size-[16px] top-1/2" data-name="Rectangle" />
                                      <div className="absolute inset-[30.86%_21.72%_26.72%_21.72%]" data-name="Check">
                                        <svg className="absolute block inset-0 size-full" fill="none" height="6.78809" preserveAspectRatio="none" viewBox="0 0 9.05078 6.78809" width="9.05078">
                                          <path d={svgPaths.p19033900} fill="white" id="Check" />
                                        </svg>
                                      </div>
                                    </>
                                  )}
                                  {isOwnerFiltered && (
                                    <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[16px] top-1/2" data-name="Outer">
                                      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
                                        <path d={svgPaths.p8e46280} fill="#888E8E" id="Outer" />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="content-stretch flex h-full items-start overflow-clip pb-[10px] pt-[13px] px-[12px] relative shrink-0 w-[210px]" data-name="Cell-Title">
                                <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[18px] min-w-px not-italic overflow-hidden relative text-[#3f4444] text-[12px] text-ellipsis whitespace-nowrap">14.3.1.1 Summary of adverse events</p>
                              </div>
                              <div className="content-stretch flex gap-[8px] h-full items-center overflow-clip pl-[12px] pr-[8px] relative shrink-0 w-[150px]" data-name="Cell-Name">
                                <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#8c8f8f] text-[12px] whitespace-nowrap">t_ae_summary.sas</p>
                              </div>
                              <div className="content-stretch flex gap-[4px] h-full items-center overflow-clip pl-[12px] pr-[8px] relative shrink-0 w-[184px]" data-name="Cell-Macro">
                                <div className="bg-[#ececec] max-w-[160px] relative rounded-[4px] shrink-0" data-name="Tag">
                                  <div className="flex flex-row items-center max-w-[inherit] size-full">
                                    <div className="content-stretch flex gap-[4px] items-center max-w-[inherit] px-[6px] py-[2px] relative size-full">
                                      <div className="relative shrink-0 size-[16px]" data-name="link">
                                        <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
                                          <div className="absolute inset-[9.05%]" data-name="Vector">
                                            <svg className="absolute block inset-0 size-full" fill="none" height="13.1046" preserveAspectRatio="none" viewBox="0 0 13.1046 13.1046" width="13.1046">
                                              <path d={svgPaths.p95fe280} fill="#8C8F8F" id="Vector" />
                                            </svg>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="relative shrink-0" data-name="Text">
                                        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                                          <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[#3c4242] text-[12px] text-ellipsis whitespace-nowrap">
                                            <p className="leading-[18px] overflow-hidden text-ellipsis">m_t_ae</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="bg-[#ececec] max-w-[160px] relative rounded-[4px] shrink-0" data-name="Tag">
                                  <div className="flex flex-row items-center max-w-[inherit] size-full">
                                    <div className="content-stretch flex gap-[4px] items-center max-w-[inherit] px-[6px] py-[2px] relative size-full">
                                      <div className="relative shrink-0" data-name="Text">
                                        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                                          <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[#3c4242] text-[12px] text-ellipsis whitespace-nowrap">
                                            <p className="leading-[18px] overflow-hidden text-ellipsis">m_u_report</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="content-stretch flex flex-[1_0_0] gap-[6px] h-full items-center min-w-px overflow-clip pl-[12px] pr-[8px] relative" data-name="Cell-Owner">
                                <div className="bg-[#f0ab00] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[16px]" data-name="Avatar">
                                  <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[6.667px] text-center text-white whitespace-nowrap">
                                    <p className="leading-[9.333px]">SC</p>
                                  </div>
                                </div>
                                <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#8c8f8f] text-[12px] whitespace-nowrap">Sarah Chen</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="h-[44px] relative shrink-0 w-full" data-name="Program Row">
                          <div aria-hidden className="absolute border-[#ececec] border-b border-solid inset-0 pointer-events-none" />
                          <div className="flex flex-row items-center size-full">
                            <div className="content-stretch flex items-center relative size-full">
                              <div className="content-stretch flex h-full items-center overflow-clip pl-[14px] pr-[8px] relative shrink-0 w-[44px]" data-name="Cell-CB">
                                <div className="relative shrink-0 size-[16px]" data-name="Checkbox-Square">
                                  <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[16px] top-1/2" data-name="Outer">
                                    <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
                                      <path d={svgPaths.p8e46280} fill="#888E8E" id="Outer" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                              <div className="content-stretch flex h-full items-start overflow-clip pb-[10px] pt-[13px] px-[12px] relative shrink-0 w-[210px]" data-name="Cell-Title">
                                <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[18px] min-w-px not-italic overflow-hidden relative text-[#3f4444] text-[12px] text-ellipsis whitespace-nowrap">{isOwnerFiltered ? "14.2.3.1 Kaplan-Meier survival curve" : "16.2.1.1 Demographic data listing"}</p>
                              </div>
                              <div className="content-stretch flex gap-[8px] h-full items-center overflow-clip pl-[12px] pr-[8px] relative shrink-0 w-[150px]" data-name="Cell-Name">
                                <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#8c8f8f] text-[12px] whitespace-nowrap">{isOwnerFiltered ? "f_km_plot.sas" : "t_dm_listing.sas"}</p>
                              </div>
                              <div className="content-stretch flex gap-[4px] h-full items-center overflow-clip pl-[12px] pr-[8px] relative shrink-0 w-[184px]" data-name="Cell-Macro">
                                <div className="bg-[#ececec] max-w-[160px] relative rounded-[4px] shrink-0" data-name="Tag">
                                  <div className="flex flex-row items-center max-w-[inherit] size-full">
                                    <div className="content-stretch flex gap-[4px] items-center max-w-[inherit] px-[6px] py-[2px] relative size-full">
                                      <div className="relative shrink-0 size-[16px]" data-name="link">
                                        <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
                                          <div className="absolute inset-[9.05%]" data-name="Vector">
                                            <svg className="absolute block inset-0 size-full" fill="none" height="13.1046" preserveAspectRatio="none" viewBox="0 0 13.1046 13.1046" width="13.1046">
                                              <path d={svgPaths.p95fe280} fill="#8C8F8F" id="Vector" />
                                            </svg>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="relative shrink-0" data-name="Text">
                                        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                                          <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[#3c4242] text-[12px] text-ellipsis whitespace-nowrap">
                                            <p className="leading-[18px] overflow-hidden text-ellipsis">{isOwnerFiltered ? "m_f_km" : "m_t_dm"}</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {isOwnerFiltered && (
                                  <div className="bg-[#ececec] max-w-[160px] relative rounded-[4px] shrink-0" data-name="Tag">
                                    <div className="flex flex-row items-center max-w-[inherit] size-full">
                                      <div className="content-stretch flex gap-[4px] items-center max-w-[inherit] px-[6px] py-[2px] relative size-full">
                                        <div className="relative shrink-0" data-name="Text">
                                          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                                            <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[#3c4242] text-[12px] text-ellipsis whitespace-nowrap">
                                              <p className="leading-[18px] overflow-hidden text-ellipsis">m_u_plot</p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="content-stretch flex flex-[1_0_0] gap-[6px] h-full items-center min-w-px overflow-clip pl-[12px] pr-[8px] relative" data-name="Cell-Owner">
                                <div className="bg-[#f0ab00] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[16px]" data-name="Avatar">
                                  <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[6.667px] text-center text-white whitespace-nowrap">
                                    <p className="leading-[9.333px]">{isOwnerFiltered ? "SC" : "JP"}</p>
                                  </div>
                                </div>
                                <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#8c8f8f] text-[12px] whitespace-nowrap">{isOwnerFiltered ? "Sarah Chen" : "James Park"}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    {isDefault && (
                      <>
                        <div className="h-[44px] relative shrink-0 w-full" data-name="Program Row">
                          <div aria-hidden className="absolute border-[#ececec] border-b border-solid inset-0 pointer-events-none" />
                          <div className="flex flex-row items-center size-full">
                            <div className="content-stretch flex items-center relative size-full">
                              <div className="content-stretch flex h-full items-center overflow-clip pl-[14px] pr-[8px] relative shrink-0 w-[44px]" data-name="Cell-CB">
                                <div className="relative shrink-0 size-[16px]" data-name="Checkbox-Square">
                                  <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[#830051] left-1/2 rounded-[1px] size-[16px] top-1/2" data-name="Rectangle" />
                                  <div className="absolute inset-[30.86%_21.72%_26.72%_21.72%]" data-name="Check">
                                    <svg className="absolute block inset-0 size-full" fill="none" height="6.78809" preserveAspectRatio="none" viewBox="0 0 9.05078 6.78809" width="9.05078">
                                      <path d={svgPaths.p19033900} fill="white" id="Check" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                              <div className="content-stretch flex h-full items-start overflow-clip pb-[10px] pt-[13px] px-[12px] relative shrink-0 w-[210px]" data-name="Cell-Title">
                                <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[18px] min-w-px not-italic overflow-hidden relative text-[#3f4444] text-[12px] text-ellipsis whitespace-nowrap">14.2.3.1 Kaplan-Meier survival curve</p>
                              </div>
                              <div className="content-stretch flex gap-[8px] h-full items-center overflow-clip pl-[12px] pr-[8px] relative shrink-0 w-[150px]" data-name="Cell-Name">
                                <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#8c8f8f] text-[12px] whitespace-nowrap">f_km_plot.sas</p>
                              </div>
                              <div className="content-stretch flex gap-[4px] h-full items-center overflow-clip pl-[12px] pr-[8px] relative shrink-0 w-[184px]" data-name="Cell-Macro">
                                <div className="bg-[#ececec] max-w-[160px] relative rounded-[4px] shrink-0" data-name="Tag">
                                  <div className="flex flex-row items-center max-w-[inherit] size-full">
                                    <div className="content-stretch flex gap-[4px] items-center max-w-[inherit] px-[6px] py-[2px] relative size-full">
                                      <div className="relative shrink-0 size-[16px]" data-name="link">
                                        <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
                                          <div className="absolute inset-[9.05%]" data-name="Vector">
                                            <svg className="absolute block inset-0 size-full" fill="none" height="13.1046" preserveAspectRatio="none" viewBox="0 0 13.1046 13.1046" width="13.1046">
                                              <path d={svgPaths.p95fe280} fill="#8C8F8F" id="Vector" />
                                            </svg>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="relative shrink-0" data-name="Text">
                                        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                                          <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[#3c4242] text-[12px] text-ellipsis whitespace-nowrap">
                                            <p className="leading-[18px] overflow-hidden text-ellipsis">m_f_km</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="bg-[#ececec] max-w-[160px] relative rounded-[4px] shrink-0" data-name="Tag">
                                  <div className="flex flex-row items-center max-w-[inherit] size-full">
                                    <div className="content-stretch flex gap-[4px] items-center max-w-[inherit] px-[6px] py-[2px] relative size-full">
                                      <div className="relative shrink-0" data-name="Text">
                                        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                                          <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[#3c4242] text-[12px] text-ellipsis whitespace-nowrap">
                                            <p className="leading-[18px] overflow-hidden text-ellipsis">m_u_plot</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="content-stretch flex flex-[1_0_0] gap-[6px] h-full items-center min-w-px overflow-clip pl-[12px] pr-[8px] relative" data-name="Cell-Owner">
                                <div className="bg-[#f0ab00] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[16px]" data-name="Avatar">
                                  <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[6.667px] text-center text-white whitespace-nowrap">
                                    <p className="leading-[9.333px]">SC</p>
                                  </div>
                                </div>
                                <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#8c8f8f] text-[12px] whitespace-nowrap">Sarah Chen</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="h-[44px] relative shrink-0 w-full" data-name="Program Row">
                          <div aria-hidden className="absolute border-[#ececec] border-b border-solid inset-0 pointer-events-none" />
                          <div className="flex flex-row items-center size-full">
                            <div className="content-stretch flex items-center relative size-full">
                              <div className="content-stretch flex h-full items-center overflow-clip pl-[14px] pr-[8px] relative shrink-0 w-[44px]" data-name="Cell-CB">
                                <div className="relative shrink-0 size-[16px]" data-name="Checkbox-Square">
                                  <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[16px] top-1/2" data-name="Outer">
                                    <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
                                      <path d={svgPaths.p8e46280} fill="#888E8E" id="Outer" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                              <div className="content-stretch flex h-full items-start overflow-clip pb-[10px] pt-[13px] px-[12px] relative shrink-0 w-[210px]" data-name="Cell-Title">
                                <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[18px] min-w-px not-italic overflow-hidden relative text-[#3f4444] text-[12px] text-ellipsis whitespace-nowrap">14.2.1.1 Primary efficacy analysis</p>
                              </div>
                              <div className="content-stretch flex gap-[8px] h-full items-center overflow-clip pl-[12px] pr-[8px] relative shrink-0 w-[150px]" data-name="Cell-Name">
                                <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#8c8f8f] text-[12px] whitespace-nowrap">t_efficacy.sas</p>
                              </div>
                              <div className="content-stretch flex gap-[4px] h-full items-center overflow-clip pl-[12px] pr-[8px] relative shrink-0 w-[184px]" data-name="Cell-Macro">
                                <div className="bg-[#ececec] max-w-[160px] relative rounded-[4px] shrink-0" data-name="Tag">
                                  <div className="flex flex-row items-center max-w-[inherit] size-full">
                                    <div className="content-stretch flex gap-[4px] items-center max-w-[inherit] px-[6px] py-[2px] relative size-full">
                                      <div className="relative shrink-0 size-[16px]" data-name="link">
                                        <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
                                          <div className="absolute inset-[9.05%]" data-name="Vector">
                                            <svg className="absolute block inset-0 size-full" fill="none" height="13.1046" preserveAspectRatio="none" viewBox="0 0 13.1046 13.1046" width="13.1046">
                                              <path d={svgPaths.p95fe280} fill="#8C8F8F" id="Vector" />
                                            </svg>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="relative shrink-0" data-name="Text">
                                        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                                          <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[#3c4242] text-[12px] text-ellipsis whitespace-nowrap">
                                            <p className="leading-[18px] overflow-hidden text-ellipsis">m_t_eff</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="bg-[#ececec] max-w-[160px] relative rounded-[4px] shrink-0" data-name="Tag">
                                  <div className="flex flex-row items-center max-w-[inherit] size-full">
                                    <div className="content-stretch flex gap-[4px] items-center max-w-[inherit] px-[6px] py-[2px] relative size-full">
                                      <div className="relative shrink-0" data-name="Text">
                                        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                                          <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[#3c4242] text-[12px] text-ellipsis whitespace-nowrap">
                                            <p className="leading-[18px] overflow-hidden text-ellipsis">m_u_stat</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="content-stretch flex flex-[1_0_0] gap-[6px] h-full items-center min-w-px overflow-clip pl-[12px] pr-[8px] relative" data-name="Cell-Owner">
                                <div className="bg-[#f0ab00] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[16px]" data-name="Avatar">
                                  <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[6.667px] text-center text-white whitespace-nowrap">
                                    <p className="leading-[9.333px]">PS</p>
                                  </div>
                                </div>
                                <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#8c8f8f] text-[12px] whitespace-nowrap">Priya Sharma</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="h-[44px] relative shrink-0 w-full" data-name="Program Row">
                          <div aria-hidden className="absolute border-[#ececec] border-b border-solid inset-0 pointer-events-none" />
                          <div className="flex flex-row items-center size-full">
                            <div className="content-stretch flex items-center relative size-full">
                              <div className="content-stretch flex h-full items-center overflow-clip pl-[14px] pr-[8px] relative shrink-0 w-[44px]" data-name="Cell-CB">
                                <div className="relative shrink-0 size-[16px]" data-name="Checkbox-Square">
                                  <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[#830051] left-1/2 rounded-[1px] size-[16px] top-1/2" data-name="Rectangle" />
                                  <div className="absolute inset-[30.86%_21.72%_26.72%_21.72%]" data-name="Check">
                                    <svg className="absolute block inset-0 size-full" fill="none" height="6.78809" preserveAspectRatio="none" viewBox="0 0 9.05078 6.78809" width="9.05078">
                                      <path d={svgPaths.p19033900} fill="white" id="Check" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                              <div className="content-stretch flex h-full items-start overflow-clip pb-[10px] pt-[13px] px-[12px] relative shrink-0 w-[210px]" data-name="Cell-Title">
                                <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[18px] min-w-px not-italic overflow-hidden relative text-[#3f4444] text-[12px] text-ellipsis whitespace-nowrap">14.1.4.2 Vital signs shift table</p>
                              </div>
                              <div className="content-stretch flex gap-[8px] h-full items-center overflow-clip pl-[12px] pr-[8px] relative shrink-0 w-[150px]" data-name="Cell-Name">
                                <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#8c8f8f] text-[12px] whitespace-nowrap">t_vs_shift.sas</p>
                              </div>
                              <div className="content-stretch flex gap-[4px] h-full items-center overflow-clip pl-[12px] pr-[8px] relative shrink-0 w-[184px]" data-name="Cell-Macro">
                                <div className="bg-[#ececec] max-w-[160px] relative rounded-[4px] shrink-0" data-name="Tag">
                                  <div className="flex flex-row items-center max-w-[inherit] size-full">
                                    <div className="content-stretch flex gap-[4px] items-center max-w-[inherit] px-[6px] py-[2px] relative size-full">
                                      <div className="relative shrink-0 size-[16px]" data-name="link">
                                        <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
                                          <div className="absolute inset-[9.05%]" data-name="Vector">
                                            <svg className="absolute block inset-0 size-full" fill="none" height="13.1046" preserveAspectRatio="none" viewBox="0 0 13.1046 13.1046" width="13.1046">
                                              <path d={svgPaths.p95fe280} fill="#8C8F8F" id="Vector" />
                                            </svg>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="relative shrink-0" data-name="Text">
                                        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                                          <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[#3c4242] text-[12px] text-ellipsis whitespace-nowrap">
                                            <p className="leading-[18px] overflow-hidden text-ellipsis">m_t_vs</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="content-stretch flex flex-[1_0_0] gap-[6px] h-full items-center min-w-px overflow-clip pl-[12px] pr-[8px] relative" data-name="Cell-Owner">
                                <div className="bg-[#830051] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[16px]" data-name="Avatar">
                                  <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[6.667px] text-center text-white whitespace-nowrap">
                                    <p className="leading-[9.333px]">JP</p>
                                  </div>
                                </div>
                                <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#8c8f8f] text-[12px] whitespace-nowrap">James Park</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="h-[44px] relative shrink-0 w-full" data-name="Program Row">
                          <div aria-hidden className="absolute border-[#ececec] border-b border-solid inset-0 pointer-events-none" />
                          <div className="flex flex-row items-center size-full">
                            <div className="content-stretch flex items-center relative size-full">
                              <div className="content-stretch flex h-full items-center overflow-clip pl-[14px] pr-[8px] relative shrink-0 w-[44px]" data-name="Cell-CB">
                                <div className="relative shrink-0 size-[16px]" data-name="Checkbox-Square">
                                  <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[16px] top-1/2" data-name="Outer">
                                    <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
                                      <path d={svgPaths.p8e46280} fill="#888E8E" id="Outer" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                              <div className="content-stretch flex h-full items-start overflow-clip pb-[10px] pt-[13px] px-[12px] relative shrink-0 w-[210px]" data-name="Cell-Title">
                                <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[18px] min-w-px not-italic overflow-hidden relative text-[#3f4444] text-[12px] text-ellipsis whitespace-nowrap">16.2.4.1 Concomitant medications listing</p>
                              </div>
                              <div className="content-stretch flex gap-[8px] h-full items-center overflow-clip pl-[12px] pr-[8px] relative shrink-0 w-[150px]" data-name="Cell-Name">
                                <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#8c8f8f] text-[12px] whitespace-nowrap">l_conmed.sas</p>
                              </div>
                              <div className="content-stretch flex gap-[4px] h-full items-center overflow-clip pl-[12px] pr-[8px] relative shrink-0 w-[184px]" data-name="Cell-Macro">
                                <div className="bg-[#ececec] max-w-[160px] relative rounded-[4px] shrink-0" data-name="Tag">
                                  <div className="flex flex-row items-center max-w-[inherit] size-full">
                                    <div className="content-stretch flex gap-[4px] items-center max-w-[inherit] px-[6px] py-[2px] relative size-full">
                                      <div className="relative shrink-0 size-[16px]" data-name="link">
                                        <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
                                          <div className="absolute inset-[9.05%]" data-name="Vector">
                                            <svg className="absolute block inset-0 size-full" fill="none" height="13.1046" preserveAspectRatio="none" viewBox="0 0 13.1046 13.1046" width="13.1046">
                                              <path d={svgPaths.p95fe280} fill="#8C8F8F" id="Vector" />
                                            </svg>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="relative shrink-0" data-name="Text">
                                        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                                          <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[#3c4242] text-[12px] text-ellipsis whitespace-nowrap">
                                            <p className="leading-[18px] overflow-hidden text-ellipsis">m_l_cm</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="bg-[#ececec] max-w-[160px] relative rounded-[4px] shrink-0" data-name="Tag">
                                  <div className="flex flex-row items-center max-w-[inherit] size-full">
                                    <div className="content-stretch flex gap-[4px] items-center max-w-[inherit] px-[6px] py-[2px] relative size-full">
                                      <div className="relative shrink-0" data-name="Text">
                                        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                                          <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[#3c4242] text-[12px] text-ellipsis whitespace-nowrap">
                                            <p className="leading-[18px] overflow-hidden text-ellipsis">m_u_report</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="content-stretch flex flex-[1_0_0] gap-[6px] h-full items-center min-w-px overflow-clip pl-[12px] pr-[8px] relative" data-name="Cell-Owner">
                                <div className="bg-[#f4e8ee] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[16px]" data-name="Avatar">
                                  <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[6.667px] text-center text-white whitespace-nowrap">
                                    <p className="leading-[9.333px]">AK</p>
                                  </div>
                                </div>
                                <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#8c8f8f] text-[12px] whitespace-nowrap">Alex Kim</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="h-[44px] relative shrink-0 w-full" data-name="Program Row">
                          <div aria-hidden className="absolute border-[#ececec] border-b border-solid inset-0 pointer-events-none" />
                          <div className="flex flex-row items-center size-full">
                            <div className="content-stretch flex items-center relative size-full">
                              <div className="content-stretch flex h-full items-center overflow-clip pl-[14px] pr-[8px] relative shrink-0 w-[44px]" data-name="Cell-CB">
                                <div className="relative shrink-0 size-[16px]" data-name="Checkbox-Square">
                                  <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[16px] top-1/2" data-name="Outer">
                                    <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
                                      <path d={svgPaths.p8e46280} fill="#888E8E" id="Outer" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                              <div className="content-stretch flex h-full items-start overflow-clip pb-[10px] pt-[13px] px-[12px] relative shrink-0 w-[210px]" data-name="Cell-Title">
                                <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[18px] min-w-px not-italic overflow-hidden relative text-[#3f4444] text-[12px] text-ellipsis whitespace-nowrap">14.1.5.3 Laboratory abnormalities summary</p>
                              </div>
                              <div className="content-stretch flex gap-[8px] h-full items-center overflow-clip pl-[12px] pr-[8px] relative shrink-0 w-[150px]" data-name="Cell-Name">
                                <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#8c8f8f] text-[12px] whitespace-nowrap">t_lab_abnormal.sas</p>
                              </div>
                              <div className="content-stretch flex gap-[4px] h-full items-center overflow-clip pl-[12px] pr-[8px] relative shrink-0 w-[184px]" data-name="Cell-Macro">
                                <div className="bg-[#ececec] max-w-[160px] relative rounded-[4px] shrink-0" data-name="Tag">
                                  <div className="flex flex-row items-center max-w-[inherit] size-full">
                                    <div className="content-stretch flex gap-[4px] items-center max-w-[inherit] px-[6px] py-[2px] relative size-full">
                                      <div className="relative shrink-0 size-[16px]" data-name="link">
                                        <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
                                          <div className="absolute inset-[9.05%]" data-name="Vector">
                                            <svg className="absolute block inset-0 size-full" fill="none" height="13.1046" preserveAspectRatio="none" viewBox="0 0 13.1046 13.1046" width="13.1046">
                                              <path d={svgPaths.p95fe280} fill="#8C8F8F" id="Vector" />
                                            </svg>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="relative shrink-0" data-name="Text">
                                        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                                          <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[#3c4242] text-[12px] text-ellipsis whitespace-nowrap">
                                            <p className="leading-[18px] overflow-hidden text-ellipsis">m_t_lab</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="content-stretch flex flex-[1_0_0] gap-[6px] h-full items-center min-w-px overflow-clip pl-[12px] pr-[8px] relative" data-name="Cell-Owner">
                                <div className="bg-[#f0ab00] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[16px]" data-name="Avatar">
                                  <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[6.667px] text-center text-white whitespace-nowrap">
                                    <p className="leading-[9.333px]">PS</p>
                                  </div>
                                </div>
                                <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#8c8f8f] text-[12px] whitespace-nowrap">Priya Sharma</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    {isEmpty && <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#8c8f8f] text-[14px] whitespace-nowrap">No programs match your search or filters.</p>}
                  </div>
                  {isDefault && (
                    <div className="bg-[#f8f7f7] content-stretch flex gap-[6px] items-center overflow-clip px-[12px] py-[8px] relative shrink-0 w-full" data-name="Bundle Bar">
                      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#8c8f8f] text-[12px] whitespace-nowrap">This download includes:</p>
                      <div className="content-stretch flex items-center relative shrink-0" data-name="Bundle Info">
                        <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#3f4444] text-[12px] whitespace-nowrap">
                          <span className="leading-[20px]">3 SAS Programs</span>
                          <span className="leading-[20px]">,</span>
                        </p>
                      </div>
                      <div className="content-stretch flex gap-[4px] items-center overflow-clip relative shrink-0" data-name="TOC Option">
                        <div className="relative shrink-0 size-[16px]" data-name="Checkbox-Square">
                          <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[#830051] left-1/2 rounded-[1px] size-[16px] top-1/2" data-name="Rectangle" />
                          <div className="absolute inset-[30.86%_21.72%_26.72%_21.72%]" data-name="Check">
                            <svg className="absolute block inset-0 size-full" fill="none" height="6.78809" preserveAspectRatio="none" viewBox="0 0 9.05078 6.78809" width="9.05078">
                              <path d={svgPaths.p19033900} fill="white" id="Check" />
                            </svg>
                          </div>
                        </div>
                        <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#3f4444] text-[12px] whitespace-nowrap">TOC</p>
                      </div>
                      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#8c8f8f] text-[12px] whitespace-nowrap">and</p>
                      <div className="content-stretch flex gap-[4px] items-center overflow-clip relative shrink-0" data-name="Task List Option">
                        <div className="relative shrink-0 size-[16px]" data-name="Checkbox-Square">
                          <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[#830051] left-1/2 rounded-[1px] size-[16px] top-1/2" data-name="Rectangle" />
                          <div className="absolute inset-[30.86%_21.72%_26.72%_21.72%]" data-name="Check">
                            <svg className="absolute block inset-0 size-full" fill="none" height="6.78809" preserveAspectRatio="none" viewBox="0 0 9.05078 6.78809" width="9.05078">
                              <path d={svgPaths.p19033900} fill="white" id="Check" />
                            </svg>
                          </div>
                        </div>
                        <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#3f4444] text-[12px] whitespace-nowrap">Macro</p>
                      </div>
                      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#8c8f8f] text-[12px] whitespace-nowrap">for this Event</p>
                    </div>
                  )}
                </div>
              </>
            )}
            {isLoading && (
              <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Loading Spinner">
                <div className="absolute inset-[12.5%]" data-name="Vector">
                  <svg className="absolute block inset-0 size-full" fill="none" height="18" preserveAspectRatio="none" viewBox="0 0 18 18" width="18">
                    <path d={svgPaths.p228dbc00} fill="#830051" id="Vector" />
                  </svg>
                </div>
              </div>
            )}
          </div>
          <div className={`content-stretch flex items-center justify-end px-[20px] py-[16px] relative shrink-0 w-full ${["Owner Filtered", "Empty", "Loading"].includes(state) ? "gap-[12px]" : ""}`} data-name="Footer">
            <div aria-hidden className="absolute border-[#ececec] border-solid border-t inset-0 pointer-events-none" />
            <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="CTAs">
              <div className={`relative rounded-[4px] shrink-0 ${isLoading ? "bg-white" : ""}`} data-name="Button/No-fill">
                <div className="flex flex-row items-center size-full">
                  <div className="content-stretch flex gap-[4px] items-center px-[12px] py-[8px] relative size-full">
                    <div className={`[word-break:break-word] flex flex-col font-["Inter:Medium",sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[0px] whitespace-nowrap ${isLoading ? "text-[#b2b4b4]" : "text-[#3c4242]"}`}>
                      <p className="leading-[20px] text-[12px]">Cancel</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`relative rounded-[4px] shrink-0 ${["Owner Filtered", "Loading"].includes(state) ? "bg-[#e6ccdc]" : "bg-[#830051]"}`} data-name="Button/Primary">
                <div className="flex flex-row items-center size-full">
                  <div className="content-stretch flex gap-[4px] items-center px-[12px] py-[8px] relative size-full">
                    <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[0px] text-white whitespace-nowrap">
                      <p className="leading-[20px] text-[12px]">Download</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}