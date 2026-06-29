import { Save, Copy, Clock, MoreHorizontal } from 'lucide-react';

interface CodePanelProps {
  selectedItem: string | null;
  isCollapsed: boolean;
  isLocked?: boolean;
}

export default function CodePanel({ selectedItem, isCollapsed, isLocked }: CodePanelProps) {

  return (
    <div className={`h-full flex flex-col overflow-hidden border-r border-[#d8dada] ${isLocked ? 'bg-[#f8f7f7]' : 'bg-white'}`}>
      {/* Top Bar */}
      <div className={`h-[40px] relative shrink-0 w-full border-b border-[#d8dada] ${isLocked ? 'bg-[#f8f7f7]' : 'bg-white'}`}>
        <div className="flex items-center justify-between px-[16px] h-full">
          {/* Selected item name */}
          <p className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] text-black">
            {selectedItem || 'Code'}
          </p>

          {/* Tool Bar */}
          <div className="flex items-center gap-[8px]">
            {/* Save Button */}
            <button
              disabled={isLocked}
              className={`flex items-center gap-[4px] h-[24px] px-[8px] py-[4px] border-[0.6px] rounded-[4px] transition-colors ${
                isLocked
                  ? 'bg-[#f8f7f7] border-[#ebecec] cursor-not-allowed'
                  : 'bg-white border-[#d8dada] hover:bg-[#f8f7f7] active:scale-[0.96] transition-transform'
              }`}
            >
              <Save className={`size-4 ${isLocked ? 'text-[#b2b4b4]' : 'text-[#3c4242]'}`} />
              <p className={`font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] ${isLocked ? 'text-[#b2b4b4]' : 'text-[#3c4242]'}`}>
                Save
              </p>
            </button>

            {/* Icon Buttons */}
            <div className="flex items-center gap-[2px]">
              <button
                className="size-[24px] flex items-center justify-center rounded-[4px] hover:bg-black/5 transition-colors active:scale-[0.96] transition-transform"
                aria-label="Copy"
              >
                <Copy className="size-4 text-[#888E8E]" />
              </button>
              <button
                className="size-[24px] flex items-center justify-center rounded-[4px] hover:bg-black/5 transition-colors active:scale-[0.96] transition-transform"
                aria-label="History"
              >
                <Clock className="size-4 text-[#888E8E]" />
              </button>
              <button
                className="size-[24px] flex items-center justify-center rounded-[4px] hover:bg-black/5 transition-colors active:scale-[0.96] transition-transform"
                aria-label="More"
              >
                <MoreHorizontal className="size-4 text-[#888E8E]" />
              </button>
            </div>
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
