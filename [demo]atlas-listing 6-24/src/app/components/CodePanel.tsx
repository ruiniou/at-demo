import { Save, Copy, Clock } from 'lucide-react';

interface CodePanelProps {
  selectedItem: string | null;
  isCollapsed: boolean;
  isLocked?: boolean;
  aiRevision?: number;
}

export default function CodePanel({ selectedItem, isCollapsed, isLocked, aiRevision = 0 }: CodePanelProps) {

  return (
    <div className={`h-full flex flex-col overflow-hidden border-r border-[#d8dada] ${isLocked ? 'bg-[#f8f7f7]' : 'bg-white'}`}>
      {/* Top Bar */}
      <div className={`h-[40px] relative shrink-0 w-full border-b border-[#d8dada] ${isLocked ? 'bg-[#f8f7f7]' : 'bg-white'}`}>
        <div className="flex items-center justify-between pl-[12px] pr-[16px] h-full">
          {/* Left: code icon */}
          <div className="size-[20px] flex items-center justify-center shrink-0">
            <svg fill="none" viewBox="0 0 18.3333 13.75" className="size-full">
              <path d="M18.3333 6.875L14.0121 11.1962L12.9318 10.1159L16.1727 6.875L12.9318 3.63409L14.0121 2.5538L18.3333 6.875ZM2.16061 6.875L5.40151 10.1159L4.3212 11.1962L0 6.875L4.3212 2.5538L5.40151 3.63409L2.16061 6.875ZM7.47729 13.75H5.85146L10.8561 0H12.4819L7.47729 13.75Z" fill="#888E8E" />
            </svg>
          </div>

          {/* Tool Bar */}
          <div className="flex items-center gap-[2px]">
            <button
              disabled={isLocked}
              className={`size-[24px] flex items-center justify-center rounded-[4px] transition-colors ${isLocked ? 'cursor-not-allowed opacity-40' : 'hover:bg-black/5 active:scale-[0.96]'}`}
              aria-label="Save"
            >
              <Save className="size-4 text-[#888E8E]" />
            </button>
            <button
              className="size-[24px] flex items-center justify-center rounded-[4px] hover:bg-black/5 transition-colors active:scale-[0.96]"
              aria-label="Copy"
            >
              <Copy className="size-4 text-[#888E8E]" />
            </button>
            <button
              className="size-[24px] flex items-center justify-center rounded-[4px] hover:bg-black/5 transition-colors active:scale-[0.96]"
              aria-label="History"
            >
              <Clock className="size-4 text-[#888E8E]" />
            </button>
            <button
              className="size-[24px] flex items-center justify-center rounded-[4px] hover:bg-black/5 transition-colors active:scale-[0.96]"
              aria-label="Unlock"
            >
              <svg className="size-4" fill="none" viewBox="0 0 13.3333 14.6667">
                <path clipRule="evenodd" d="M6.66667 0C7.72749 2.69574e-06 8.74466 0.42178 9.49479 1.17188C9.85167 1.52876 10.1346 1.94598 10.3327 2.39974C10.48 2.73716 10.3257 3.13003 9.98828 3.27734C9.65084 3.42464 9.25797 3.27039 9.11068 2.93294C8.97861 2.63049 8.78996 2.35246 8.55208 2.11458C8.052 1.61454 7.37387 1.33334 6.66667 1.33333C5.95946 1.33333 5.28134 1.61454 4.78125 2.11458C4.28119 2.61464 4.00004 3.29281 4 4V6H11.3333C12.4378 6 13.3332 6.89551 13.3333 8V12.6667C13.3333 13.7712 12.4379 14.6667 11.3333 14.6667H2C0.895431 14.6667 0 13.7712 0 12.6667V8C8.79571e-05 6.89551 0.895485 6 2 6H2.66667V4C2.66671 2.93919 3.08843 1.92198 3.83854 1.17188C4.58868 0.421784 5.60584 0 6.66667 0ZM2 7.33333C1.63186 7.33333 1.33342 7.63189 1.33333 8V12.6667C1.33333 13.0349 1.63181 13.3333 2 13.3333H11.3333C11.7015 13.3333 12 13.0349 12 12.6667V8C11.9999 7.63189 11.7015 7.33333 11.3333 7.33333H2Z" fill="#888E8E" fillRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto relative">
        {isLocked && (
          <div className="absolute inset-0 bg-[#f8f7f7]/60 z-10 pointer-events-all cursor-not-allowed" />
        )}
        <div className="flex font-mono text-[13px] leading-[20px]">
          {/* Line Numbers */}
          <div className="bg-[#f8f7f7] px-[8px] py-[16px] select-none shrink-0">
            {Array.from({ length: 35 }, (_, i) => (
              <div key={i} className="text-[#999] text-right">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Code Content */}
          <div className="flex-1 px-[16px] py-[16px] overflow-x-auto">
            {aiRevision > 0 && (
              <div className="mb-[12px] px-[8px] py-[4px] rounded-[4px] bg-[#f3f7cc] border border-[#c4d600] text-[11px] font-['PingFang_SC:Regular',sans-serif] text-[#3c4242]">
                ✓ Code updated with metadata changes
              </div>
            )}
            <pre className="whitespace-pre">
              <code>{`/*= c_nested_cont(
    cluster_1, hba1c1( RLG_A,RLG_B,RLG_C )= a/ */
`}<span className="text-[#0066cc]">proc sql</span>{`;
`}<span className="text-[#0066cc]">  create table</span>{` atlas_prep_cluster1
`}<span className="text-[#0066cc]">  select</span>{` a.*
       , b.rlg_decim
`}<span className="text-[#0066cc]">  from</span>{` adlb(in=a)
`}<span className="text-[#0066cc]">  where</span>{` anl1fl=`}<span className="text-[#008000]">''</span> <span className="text-[#0066cc]">and</span>{` max(length(scanprint(anl1, best., 2, `}<span className="text-[#008000]">','</span>{`))), 0) a1 `}<span className="text-[#0066cc]">as</span>{`
       param
`}<span className="text-[#0066cc]">  left join</span>{` (
`}<span className="text-[#0066cc]">    select</span>{` param,
           max( missing(anl1) )
`}<span className="text-[#0066cc]">    and</span>{` PARAMCD=`}<span className="text-[#008000]">'CHEMISTRY'</span>{`
`}<span className="text-[#0066cc]">    and</span>{` ANLFL1=`}<span className="text-[#008000]">''</span>{`
`}<span className="text-[#0066cc]">    and</span> <span className="text-[#0066cc]">not</span>{` missing(ANL1)
`}<span className="text-[#0066cc]">    group by</span>{` param
  ) as b
`}<span className="text-[#0066cc]">  on</span>{` a.paramcd=param
`}<span className="text-[#0066cc]">  where</span>{` SAFFL=`}<span className="text-[#008000]">''</span>{`
`}<span className="text-[#0066cc]">    and</span>{` PARAMCD=`}<span className="text-[#008000]">'CHEMISTRY'</span> <span className="text-[#0066cc]">and</span>{` ANLFL1=`}<span className="text-[#008000]">'Y'</span>{`;
`}<span className="text-[#0066cc]">quit</span>{`;

%s_c_nested_cont(
  inda = atlas_prep_cluster_1
, pop_flag = SAFFL=''
, paramvar = SAFFL and PARAMCD='CHEMISTRY' and ANLFL1='Y')
, byvarlistin = PARAM()
, paramvar = PARAM
, trgrpn = TRTAN(N)
, popgrp = SAFFL(a.1_2_123
  ustgrp =`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
