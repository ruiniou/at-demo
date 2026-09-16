import { useState, useMemo, useRef, useEffect, useCallback } from "react";

const SVG = {
  check: "M9.05078 1.13184L3.39453 6.78809L2.2627 5.65723V5.65625L0 3.39453L1.13184 2.2627L3.39355 4.52539L7.91992 0L9.05078 1.13184Z",
  checkboxBorder: "M15.1113 0C15.6021 0.000116938 15.9999 0.397928 16 0.888672V15.1113C15.9999 15.6021 15.6021 15.9999 15.1113 16H0.888672C0.397928 15.9999 0.000116938 15.6021 0 15.1113V0.888672C0.000117277 0.397928 0.397928 0.000117277 0.888672 0H15.1113ZM1.04004 1.04004V14.96H14.96V1.04004H1.04004Z",
  search: "M10.6873 9.74453L13.5425 12.5997L12.5997 13.5425L9.74453 10.6873C8.71793 11.5087 7.416 12 6 12C2.688 12 0 9.312 0 6C0 2.688 2.688 0 6 0C9.312 0 12 2.688 12 6C12 7.416 11.5087 8.71793 10.6873 9.74453ZM9.3498 9.24987C10.165 8.40973 10.6667 7.26373 10.6667 6C10.6667 3.42167 8.57833 1.33333 6 1.33333C3.42167 1.33333 1.33333 3.42167 1.33333 6C1.33333 8.57833 3.42167 10.6667 6 10.6667C7.26373 10.6667 8.40973 10.165 9.24987 9.3498L9.3498 9.24987Z",
  close: "M4.24264 3.29985L7.54251 0L8.48531 0.942807L5.18544 4.24265L8.48531 7.54245L7.54251 8.48525L4.24264 5.18545L0.942814 8.48525L0 7.54245L3.29984 4.24265L0 0.942807L0.942814 0L4.24264 3.29985Z",
  lock: "M6.66667 0C7.72749 2.77992e-06 8.74466 0.42178 9.49479 1.17188C10.2449 1.92198 10.6666 2.93919 10.6667 4V6H11.3333C12.4378 6 13.3332 6.89551 13.3333 8V12.6667C13.3333 13.7712 12.4379 14.6667 11.3333 14.6667H2C0.895431 14.6667 0 13.7712 0 12.6667V8C8.79571e-05 6.89551 0.895485 6 2 6H2.66667V4C2.66671 2.93919 3.08843 1.92198 3.83854 1.17188C4.58868 0.421784 5.60584 0 6.66667 0ZM2 7.33333C1.63186 7.33333 1.33342 7.63189 1.33333 8V12.6667C1.33333 13.0349 1.63181 13.3333 2 13.3333H11.3333C11.7015 13.3333 12 13.0349 12 12.6667V8C11.9999 7.63189 11.7015 7.33333 11.3333 7.33333H2ZM6.66667 1.33333C5.95946 1.33333 5.28134 1.61454 4.78125 2.11458C4.28119 2.61464 4.00004 3.29281 4 4V6H9.33333V4C9.33329 3.29281 9.05214 2.61464 8.55208 2.11458C8.052 1.61454 7.37387 1.33334 6.66667 1.33333Z",
  user: "M5.73757 10C8.17917 10 10.3142 11.0501 11.4756 12.6165L10.2476 13.1973C9.3025 12.0771 7.63583 11.3333 5.73757 11.3333C3.83929 11.3333 2.17265 12.0771 1.22749 13.1973L0 12.6159C1.16147 11.0498 3.29627 10 5.73757 10ZM5.73757 0C7.5785 0 9.0709 1.49239 9.0709 3.33333V5.33333C9.0709 7.12587 7.65603 8.58787 5.88217 8.6636L5.73757 8.66667C3.89661 8.66667 2.40423 7.17427 2.40423 5.33333V3.33333C2.40423 1.54083 3.8191 0.0787867 5.59297 0.00308005L5.73757 0ZM5.73757 1.33333C4.67243 1.33333 3.80179 2.16595 3.74096 3.21582L3.73757 3.33333V5.33333C3.73757 6.43793 4.63297 7.33333 5.73757 7.33333C6.8027 7.33333 7.67337 6.50073 7.73417 5.45087L7.73757 5.33333V3.33333C7.73757 2.22877 6.8421 1.33333 5.73757 1.33333Z",
  chevronDown: "M4.24261 3.29981L7.54247 0L8.48527 0.942807L4.24261 5.18548L0 0.942807L0.942807 0L4.24261 3.29981Z",
  closeSmall: "M3.18198 2.47489L5.65688 0L6.36398 0.707105L3.88908 3.18199L6.36398 5.65684L5.65688 6.36394L3.18198 3.88909L0.70711 6.36394L0 5.65684L2.47488 3.18199L0 0.707105L0.70711 0L3.18198 2.47489Z",
  link: "M10.7949 8.90929L9.85214 7.96649L10.7949 7.02369C12.0967 5.72196 12.0967 3.6114 10.7949 2.30965C9.49321 1.0079 7.38261 1.0079 6.08087 2.30965L5.13807 3.25246L4.19526 2.30965L5.13807 1.36684C6.96054 -0.455612 9.91528 -0.455612 11.7377 1.36684C13.5602 3.18928 13.5602 6.14402 11.7377 7.96649L10.7949 8.90929ZM8.90928 10.795L7.96648 11.7378C6.14408 13.5602 3.18928 13.5602 1.36684 11.7378C-0.455612 9.91529 -0.455612 6.96049 1.36684 5.13808L2.30964 4.19526L3.25245 5.13808L2.30964 6.08089C1.00789 7.38262 1.00789 9.49316 2.30964 10.795C3.61139 12.0967 5.72194 12.0967 7.02367 10.795L7.96648 9.85209L8.90928 10.795ZM8.43788 3.72386L9.38074 4.66667L4.66667 9.38069L3.72386 8.43789L8.43788 3.72386Z",
  spinner: "M15.364 2.63604L13.9497 4.05025C12.683 2.7835 10.933 2 9 2C5.13401 2 2 5.13401 2 9C2 12.866 5.13401 16 9 16C12.866 16 16 12.866 16 9H18C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9C0 4.02944 4.02944 0 9 0C11.4853 0 13.7353 1.00736 15.364 2.63604Z",
};

type Program = {
  id: number;
  title: string;
  program: string;
  macros: string[];
  macroLinked: boolean[];
  owner: string;
  ownerInitials: string;
  ownerColor: string;
  locked: boolean;
};

const PROGRAMS: Program[] = [
  {
    id: 1, title: "14.3.1.1 Summary of adverse events",
    program: "t_ae_summary.sas", macros: ["m_t_ae", "m_u_report"], macroLinked: [true, false],
    owner: "Sarah Chen", ownerInitials: "SC", ownerColor: "#f0ab00", locked: false,
  },
  {
    id: 2, title: "16.2.1.1 Demographic data listing",
    program: "t_dm_listing.sas", macros: ["m_t_dm"], macroLinked: [true],
    owner: "James Park", ownerInitials: "JP", ownerColor: "#f0ab00", locked: false,
  },
  {
    id: 3, title: "14.2.3.1 Kaplan-Meier survival curve",
    program: "f_km_plot.sas", macros: ["m_f_km", "m_u_plot"], macroLinked: [true, false],
    owner: "Sarah Chen", ownerInitials: "SC", ownerColor: "#f0ab00", locked: false,
  },
  {
    id: 4, title: "14.2.1.1 Primary efficacy analysis",
    program: "t_efficacy.sas", macros: ["m_t_eff", "m_u_stat"], macroLinked: [true, false],
    owner: "Priya Sharma", ownerInitials: "PS", ownerColor: "#f0ab00", locked: false,
  },
  {
    id: 5, title: "14.1.4.2 Vital signs shift table",
    program: "t_vs_shift.sas", macros: ["m_t_vs"], macroLinked: [true],
    owner: "James Park", ownerInitials: "JP", ownerColor: "#830051", locked: true,
  },
  {
    id: 6, title: "16.2.4.1 Concomitant medications listing",
    program: "l_conmed.sas", macros: ["m_l_cm", "m_u_report"], macroLinked: [true, false],
    owner: "Alex Kim", ownerInitials: "AK", ownerColor: "#7c8db0", locked: false,
  },
  {
    id: 7, title: "14.1.5.3 Laboratory abnormalities summary",
    program: "t_lab_abnormal.sas", macros: ["m_t_lab"], macroLinked: [true],
    owner: "Priya Sharma", ownerInitials: "PS", ownerColor: "#f0ab00", locked: false,
  },
];

// Checkbox with checked / indeterminate / unchecked states
function Checkbox({
  checked, indeterminate, onChange, size = 16,
}: { checked: boolean; indeterminate?: boolean; onChange?: () => void; size?: number }) {
  return (
    <div
      className="relative shrink-0 cursor-pointer select-none"
      style={{ width: size, height: size }}
      onClick={onChange}
    >
      {checked || indeterminate ? (
        <>
          <div
            className="absolute inset-0 rounded-[1px]"
            style={{ background: "#830051" }}
          />
          {indeterminate ? (
            <div className="absolute bg-white" style={{ left: "25%", right: "25%", top: "50%", height: "1.6px", transform: "translateY(-50%)" }} />
          ) : (
            <svg className="absolute" style={{ inset: "30.86% 21.72% 26.72% 21.72%" }} fill="none" viewBox="0 0 9.05078 6.78809">
              <path d={SVG.check} fill="white" />
            </svg>
          )}
        </>
      ) : (
        <svg className="absolute block inset-0 w-full h-full" fill="none" viewBox="0 0 16 16">
          <path d={SVG.checkboxBorder} fill="#888E8E" />
        </svg>
      )}
    </div>
  );
}

function MacroTag({ macro, linked }: { macro: string; linked: boolean }) {
  return (
    <div className="bg-[#ececec] rounded-[4px] shrink-0 flex items-center px-[6px] py-[2px] gap-[4px] max-w-[160px]">
      {linked && (
        <div className="shrink-0 w-[16px] h-[16px] overflow-hidden relative">
          <svg className="absolute block inset-0 w-full h-full" fill="none" viewBox="0 0 13.1046 13.1046">
            <path d={SVG.link} fill="#8C8F8F" />
          </svg>
        </div>
      )}
      <span
        className="text-[12px] leading-[18px] text-[#3c4242] overflow-hidden text-ellipsis whitespace-nowrap"
        style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
      >
        {macro}
      </span>
    </div>
  );
}

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div
      className="flex items-center justify-center rounded-[8px] shrink-0"
      style={{ width: 16, height: 16, background: color }}
    >
      <span
        className="text-white text-center"
        style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 6.667, lineHeight: "9.333px" }}
      >
        {initials}
      </span>
    </div>
  );
}

function ProgramRow({
  program, checked, onChange,
}: { program: Program; checked: boolean; onChange: () => void }) {
  return (
    <div
      className="h-[44px] relative shrink-0 w-full hover:bg-[#f8f7f7] cursor-pointer transition-colors"
      onClick={onChange}
    >
      <div className="absolute inset-0 border-b border-[#ececec] pointer-events-none" />
      <div className="flex items-center size-full">
        {/* Checkbox */}
        <div className="flex items-center pl-[14px] pr-[8px] h-full shrink-0 w-[44px]" onClick={(e) => { e.stopPropagation(); onChange(); }}>
          <Checkbox checked={checked} />
        </div>
        {/* Title */}
        <div className="flex items-start pb-[10px] pt-[13px] px-[12px] h-full shrink-0 w-[210px] overflow-hidden">
          <p
            className="text-[12px] leading-[18px] text-[#3f4444] overflow-hidden text-ellipsis whitespace-nowrap flex-1 min-w-0"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
          >
            {program.title}
          </p>
        </div>
        {/* Program Name */}
        <div className="flex items-center pl-[12px] pr-[8px] h-full shrink-0 w-[150px] overflow-hidden">
          <p
            className="text-[12px] leading-[18px] text-[#8c8f8f] whitespace-nowrap"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
          >
            {program.program}
          </p>
        </div>
        {/* Macros */}
        <div className="flex gap-[4px] items-center pl-[12px] pr-[8px] h-full shrink-0 w-[184px] overflow-hidden">
          {program.macros.map((m, i) => (
            <MacroTag key={m} macro={m} linked={program.macroLinked[i]} />
          ))}
        </div>
        {/* Owner */}
        <div className="flex flex-1 gap-[6px] items-center pl-[12px] pr-[8px] h-full min-w-0 overflow-hidden">
          <Avatar initials={program.ownerInitials} color={program.ownerColor} />
          <p
            className="text-[12px] leading-[18px] text-[#8c8f8f] whitespace-nowrap"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
          >
            {program.owner}
          </p>
        </div>
      </div>
    </div>
  );
}

const OWNER_META: Record<string, { color: string; initials: string }> = {
  "Sarah Chen":  { color: "#f0ab00", initials: "SC" },
  "James Park":  { color: "#830051", initials: "JP" },
  "Priya Sharma":{ color: "#d0006f", initials: "PS" },
  "Alex Kim":    { color: "#7c8db0", initials: "AK" },
};
const ALL_OWNERS = Array.from(new Set(PROGRAMS.map((p) => p.owner))).sort();

function OwnerAvatar({ owner, size = 16 }: { owner: string; size?: number }) {
  const meta = OWNER_META[owner] ?? { color: "#8c8f8f", initials: owner.slice(0, 2).toUpperCase() };
  return (
    <div
      className="relative rounded-[12px] shrink-0 flex items-center justify-center"
      style={{ width: size, height: size, background: meta.color }}
    >
      <div
        className="absolute inset-0 rounded-[12px] pointer-events-none"
        style={{ border: "0.8px solid #ececec" }}
      />
      <span
        className="text-white font-['Inter',sans-serif] not-italic relative"
        style={{ fontSize: size * 0.417, lineHeight: 1, fontWeight: 500 }}
      >
        {meta.initials}
      </span>
    </div>
  );
}

function OwnerDropdown({
  selectedOwners,
  onChange,
}: {
  selectedOwners: Set<string>;
  onChange: (owners: Set<string>) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) { setSearch(""); return; }
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    setTimeout(() => inputRef.current?.focus(), 0);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const toggle = useCallback(
    (owner: string) => {
      const next = new Set(selectedOwners);
      if (next.has(owner)) next.delete(owner);
      else next.add(owner);
      onChange(next);
    },
    [selectedOwners, onChange]
  );

  const clearAll = useCallback(() => onChange(new Set()), [onChange]);

  const filteredOptions = ALL_OWNERS.filter((o) =>
    o.toLowerCase().includes(search.toLowerCase())
  );
  const isActive = selectedOwners.size > 0;
  const label =
    selectedOwners.size === 0
      ? "Owner"
      : selectedOwners.size === 1
      ? Array.from(selectedOwners)[0]
      : `${selectedOwners.size} Owners`;

  return (
    <div ref={ref} className="relative">
      {/* Trigger chip */}
      <button
        className={`h-[28px] max-w-[300px] rounded-[4px] shrink-0 flex items-center pl-[8px] pr-[6px] py-[6px] gap-[4px] cursor-pointer transition-colors hover:bg-[#f4e8ee] ${
          isActive || open ? "bg-[#f4e8ee]" : "bg-transparent"
        }`}
        onClick={() => setOpen((v) => !v)}
      >
        <div className="shrink-0 w-[16px] h-[16px] relative overflow-hidden">
          <svg className="absolute block" style={{ inset: "8.33% 14.14% 9.18% 14.14%" }} fill="none" viewBox="0 0 11.4756 13.1973">
            <path d={SVG.user} fill={isActive || open ? "#830051" : "#3F4444"} />
          </svg>
        </div>
        <span
          className="text-[12px] leading-[18px] whitespace-nowrap"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, color: isActive || open ? "#830051" : "#3f4444" }}
        >
          {label}
        </span>
        <div className="shrink-0 w-[16px] h-[16px] relative overflow-hidden">
          <svg
            className="absolute block transition-transform"
            style={{ inset: "34.26% 23.48% 33.33% 23.48%", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
            fill="none" viewBox="0 0 8.48527 5.18548"
          >
            <path d={SVG.chevronDown} fill={isActive || open ? "#830051" : "#3F4444"} />
          </svg>
        </div>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute top-[32px] left-0 z-50 bg-white rounded-[8px] w-[240px] p-[4px] flex flex-col gap-[8px]"
          style={{ boxShadow: "0px 4px 16px 0px rgba(0,0,0,0.08)", border: "1px solid #ececec" }}
        >
          {/* Search bar */}
          <div className="bg-[#e6ccdc] rounded-[4px] relative shrink-0 w-full" style={{ border: "1px solid #830051" }}>
            <div className="p-[2px] flex items-center size-full">
              <div className="bg-white flex-1 min-w-0 flex items-center px-[6px] py-[4px] gap-[6px]">
                {/* Tag chips + input */}
                <div className="flex flex-wrap gap-[4px] items-center flex-1 min-w-0">
                  {Array.from(selectedOwners).map((owner) => (
                    <div key={owner} className="bg-[#ececec] rounded-[4px] shrink-0 flex items-center gap-[4px] px-[6px] py-[2px]">
                      <OwnerAvatar owner={owner} size={16} />
                      <span className="text-[12px] leading-[20px] text-[#3c4242] whitespace-nowrap font-['Inter',sans-serif]">
                        {owner}
                      </span>
                      <button
                        className="relative shrink-0 size-[12px] overflow-hidden cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); toggle(owner); }}
                      >
                        <svg className="absolute block" style={{ inset: "23.49% 23.48%" }} fill="none" viewBox="0 0 6.364 6.364">
                          <path d={SVG.closeSmall} fill="#888E8E" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <input
                    ref={inputRef}
                    className="min-w-[60px] flex-1 bg-transparent outline-none text-[12px] leading-[18px] text-[#3c4242] placeholder-[#8c8f8f] font-['Inter',sans-serif]"
                    placeholder={selectedOwners.size === 0 ? "Search people..." : ""}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                {/* Clear-all button */}
                {isActive && (
                  <button
                    className="relative shrink-0 size-[24px] overflow-hidden cursor-pointer hover:bg-[#f4f4f4] rounded-[4px] transition-colors"
                    onClick={clearAll}
                  >
                    <div className="absolute inset-[16.67%] overflow-hidden">
                      <div className="absolute" style={{ inset: "23.49% 23.48%" }}>
                        <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 8.485 8.485">
                          <path d={SVG.close} fill="#8C8F8F" />
                        </svg>
                      </div>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Option list */}
          <div className="flex flex-col gap-[2px] max-h-[206px] overflow-y-auto overflow-x-hidden w-full relative">
            {filteredOptions.map((owner) => (
              <button
                key={owner}
                className={`relative rounded-[2px] shrink-0 w-full cursor-pointer hover:bg-[#f8f7f7] transition-colors ${
                  selectedOwners.has(owner) ? "bg-[#fdf3f9]" : ""
                }`}
                onClick={() => toggle(owner)}
              >
                <div className="flex items-center gap-[8px] pl-[4px] pr-[12px] py-[2px] size-full">
                  <OwnerAvatar owner={owner} size={16} />
                  <span className="text-[12px] leading-[20px] text-[#3c4242] whitespace-nowrap font-['Inter',sans-serif]">
                    {owner}
                  </span>
                  {owner === "Sarah Chen" && (
                    <span className="text-[12px] leading-[20px] text-[#888e8e] whitespace-nowrap overflow-hidden text-ellipsis font-['Inter',sans-serif]">
                      (You)
                    </span>
                  )}
                </div>
              </button>
            ))}
            {filteredOptions.length === 0 && (
              <p className="text-[12px] leading-[20px] text-[#8c8f8f] px-[4px] py-[2px] font-['Inter',sans-serif]">
                No results
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DownloadModal({ onClose }: { onClose: () => void }) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set([1, 3, 5]));
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOwners, setSelectedOwners] = useState<Set<string>>(new Set());
  const [lockedFilter, setLockedFilter] = useState(false);
  const [includeTOC, setIncludeTOC] = useState(true);
  const [includeMacro, setIncludeMacro] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredPrograms = useMemo(() => {
    let result = PROGRAMS;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.program.toLowerCase().includes(q) ||
          p.macros.some((m) => m.toLowerCase().includes(q))
      );
    }
    if (selectedOwners.size > 0) result = result.filter((p) => selectedOwners.has(p.owner));
    if (lockedFilter) result = result.filter((p) => p.locked);
    return result;
  }, [searchQuery, selectedOwners, lockedFilter]);

  const visibleSelectedCount = filteredPrograms.filter((p) => selectedIds.has(p.id)).length;
  const allVisible = filteredPrograms.length > 0 && filteredPrograms.every((p) => selectedIds.has(p.id));
  const someVisible = filteredPrograms.some((p) => selectedIds.has(p.id)) && !allVisible;
  const isEmpty = filteredPrograms.length === 0;
  const isSearchError = isEmpty && (searchQuery.trim() !== "" || lockedFilter || selectedOwners.size > 0);

  const toggleAll = () => {
    if (allVisible) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filteredPrograms.forEach((p) => next.delete(p.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filteredPrograms.forEach((p) => next.add(p.id));
        return next;
      });
    }
  };

  const toggleRow = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDownload = () => {
    if (visibleSelectedCount === 0 || isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onClose();
    }, 1500);
  };

  const canDownload = visibleSelectedCount > 0 && !isLoading;

  return (
    <div className="bg-white rounded-[8px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.12)] w-[800px] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-[24px] py-[16px] shrink-0">
        <p
          className="text-[16px] leading-[22px] text-[#3c4242] flex-1 min-w-0"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
        >
          Download SAS Programs
        </p>
        <button
          className="relative rounded-[4px] size-[24px] flex items-center justify-center hover:bg-[#f4f4f4] transition-colors cursor-pointer"
          onClick={onClose}
        >
          <svg className="block" width="8.485" height="8.485" fill="none" viewBox="0 0 8.48531 8.48525">
            <path d={SVG.close} fill="#888E8E" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div
        className={`flex flex-col h-[590px] shrink-0 w-full overflow-hidden ${
          isLoading ? "items-center justify-center p-[20px]" : "gap-[8px] items-start pb-[20px] pt-[12px] px-[20px]"
        }`}
      >
        {!isLoading && (
          <>
            {/* Search Bar */}
            <div
              className={`relative rounded-[4px] shrink-0 w-full ${
                isSearchError ? "bg-[#e6ccdc]" : "bg-white"
              }`}
            >
              <div
                className={`absolute inset-0 rounded-[4px] pointer-events-none ${
                  isSearchError
                    ? "border border-[#830051]"
                    : "border-[0.6px] border-[#d8dada]"
                }`}
              />
              <div className="flex items-center px-[6px] py-[4px] gap-[6px] w-full">
                <div className="shrink-0 w-[16px] h-[16px] relative overflow-hidden">
                  <svg className="absolute block inset-0 w-full h-full" fill="none" viewBox="0 0 13.5425 13.5425">
                    <path d={SVG.search} fill="#888E8E" />
                  </svg>
                </div>
                <input
                  ref={inputRef}
                  className="flex-1 min-w-0 bg-transparent outline-none text-[12px] leading-[20px] placeholder-[#888e8e]"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    color: isSearchError ? "#3f4444" : "#3f4444",
                  }}
                  placeholder="Search title, name, or macro"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center justify-between shrink-0 w-full">
              <div className="flex gap-[8px] items-center">
                {/* Locked Only chip */}
                <button
                  className={`h-[28px] max-w-[300px] rounded-[4px] shrink-0 flex items-center px-[8px] py-[6px] gap-[4px] cursor-pointer transition-colors hover:bg-[#f4e8ee] ${
                    lockedFilter ? "bg-[#f4e8ee]" : "bg-transparent"
                  }`}
                  onClick={() => setLockedFilter((v) => !v)}
                >
                  <div className="shrink-0 w-[16px] h-[16px] relative overflow-hidden">
                    <svg
                      className="absolute block"
                      style={{ inset: "4.17% 8.33%" }}
                      fill="none"
                      viewBox="0 0 13.3333 14.6667"
                    >
                      <path
                        clipRule="evenodd"
                        d={SVG.lock}
                        fill={lockedFilter ? "#830051" : "#3F4444"}
                        fillRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span
                    className="text-[12px] leading-[18px] whitespace-nowrap"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      color: lockedFilter ? "#830051" : "#3f4444",
                    }}
                  >
                    Locked Only
                  </span>
                </button>

                {/* Owner dropdown */}
                <OwnerDropdown selectedOwners={selectedOwners} onChange={setSelectedOwners} />
              </div>
            </div>

            {/* Table Container */}
            <div
              className={`border border-[#ececec] flex flex-col items-start rounded-[4px] w-full ${
                isEmpty ? "flex-1 min-h-0" : selectedOwners.size > 0 ? "flex-1 min-h-0" : "shrink-0"
              }`}
            >
              {/* Table Header */}
              <div className="bg-[#f8f7f7] flex h-[40px] items-center overflow-hidden shrink-0 w-full">
                <div className="flex h-full items-center overflow-hidden pl-[14px] pr-[8px] shrink-0 w-[44px]">
                  <Checkbox
                    checked={allVisible}
                    indeterminate={someVisible}
                    onChange={toggleAll}
                  />
                </div>
                <div className="flex h-full items-start pb-[12px] pt-[13px] px-[12px] shrink-0 w-[210px]">
                  <p
                    className="text-[12px] leading-[20px] text-[#8c8f8f] whitespace-nowrap"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                  >
                    Title
                  </p>
                </div>
                <div className="flex h-full items-center pl-[12px] pr-[8px] shrink-0 w-[150px]">
                  <p
                    className="text-[12px] leading-[20px] text-[#8c8f8f] whitespace-nowrap"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                  >
                    Program Name
                  </p>
                </div>
                <div className="flex h-full items-center pl-[12px] pr-[8px] shrink-0 w-[184px]">
                  <p
                    className="text-[12px] leading-[20px] text-[#8c8f8f] whitespace-nowrap"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                  >
                    Macro
                  </p>
                </div>
                <div className="flex flex-1 h-full items-center pl-[12px] pr-[8px] min-w-0">
                  <p
                    className="text-[12px] leading-[20px] text-[#8c8f8f] whitespace-nowrap"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                  >
                    Owner
                  </p>
                </div>
              </div>

              {/* Table Body */}
              <div
                className={`bg-white flex flex-col overflow-auto w-full ${
                  isEmpty
                    ? "flex-1 min-h-0 items-center justify-center"
                    : selectedOwners.size > 0
                    ? "flex-1 min-h-0 items-start"
                    : "h-[404px] items-start shrink-0"
                }`}
              >
                {!isEmpty ? (
                  filteredPrograms.map((p) => (
                    <ProgramRow
                      key={p.id}
                      program={p}
                      checked={selectedIds.has(p.id)}
                      onChange={() => toggleRow(p.id)}
                    />
                  ))
                ) : (
                  <p
                    className="text-[14px] leading-[24px] text-[#8c8f8f] whitespace-nowrap"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
                  >
                    No programs match your search or filters.
                  </p>
                )}
              </div>

              {/* Bundle Bar — only when no owner filter and not empty */}
              {selectedOwners.size === 0 && !isEmpty && visibleSelectedCount > 0 && (
                <div className="bg-[#f8f7f7] flex gap-[6px] items-center overflow-hidden px-[12px] py-[8px] shrink-0 w-full">
                  <p
                    className="text-[12px] leading-[18px] text-[#8c8f8f] whitespace-nowrap shrink-0"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
                  >
                    This download includes:
                  </p>
                  <p
                    className="text-[12px] leading-[20px] text-[#3f4444] whitespace-nowrap shrink-0"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                  >
                    {visibleSelectedCount} SAS Program{visibleSelectedCount !== 1 ? "s" : ""},
                  </p>
                  <button
                    className="flex gap-[4px] items-center overflow-hidden shrink-0 cursor-pointer"
                    onClick={() => setIncludeTOC((v) => !v)}
                  >
                    <Checkbox checked={includeTOC} size={16} />
                    <p
                      className="text-[12px] leading-[20px] text-[#3f4444] whitespace-nowrap"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                    >
                      TOC
                    </p>
                  </button>
                  <p
                    className="text-[12px] leading-[18px] text-[#8c8f8f] whitespace-nowrap shrink-0"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
                  >
                    and
                  </p>
                  <button
                    className="flex gap-[4px] items-center overflow-hidden shrink-0 cursor-pointer"
                    onClick={() => setIncludeMacro((v) => !v)}
                  >
                    <Checkbox checked={includeMacro} size={16} />
                    <p
                      className="text-[12px] leading-[20px] text-[#3f4444] whitespace-nowrap"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                    >
                      Macro
                    </p>
                  </button>
                  <p
                    className="text-[12px] leading-[18px] text-[#8c8f8f] whitespace-nowrap shrink-0"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
                  >
                    for this Event
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="spinner-anim w-[24px] h-[24px] relative overflow-hidden">
            <svg className="absolute block" style={{ inset: "12.5%" }} fill="none" width="18" height="18" viewBox="0 0 18 18">
              <path d={SVG.spinner} fill="#830051" />
            </svg>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative flex items-center justify-end px-[20px] py-[16px] shrink-0 w-full">
        <div className="absolute inset-0 border-t border-[#ececec] pointer-events-none" />
        <div className="flex gap-[12px] items-center relative">
          {/* Cancel */}
          <button
            className="relative rounded-[4px] shrink-0 flex items-center px-[12px] py-[8px] hover:bg-[#f4f4f4] transition-colors cursor-pointer"
            onClick={onClose}
            disabled={isLoading}
          >
            <span
              className={`text-[12px] leading-[20px] whitespace-nowrap ${isLoading ? "text-[#b2b4b4]" : "text-[#3c4242]"}`}
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
            >
              Cancel
            </span>
          </button>

          {/* Download */}
          <button
            className={`relative rounded-[4px] shrink-0 flex items-center px-[12px] py-[8px] transition-colors ${
              canDownload
                ? "bg-[#830051] hover:bg-[#6d0044] cursor-pointer"
                : "bg-[#e6ccdc] cursor-not-allowed"
            }`}
            onClick={handleDownload}
            disabled={!canDownload}
          >
            <span
              className="text-[12px] leading-[20px] text-white whitespace-nowrap"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
            >
              Download
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="size-full bg-[#f0eeee] flex items-center justify-center">
      <DownloadModal onClose={() => {}} />
    </div>
  );
}
