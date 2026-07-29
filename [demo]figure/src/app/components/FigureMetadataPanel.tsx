import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import svgPaths from '../../imports/MetadataComponents-1/svg-azr8qwiio2';

// ─── Types ────────────────────────────────────────────────────────────────────

type BadgeVariant = 'ai' | 'conflict';

interface ComponentField {
  label: string;
  value: string;
  badge?: { text: string; variant: BadgeVariant };
}

type ComponentState = 'ready' | 'loading';

interface FigureComponent {
  id: string;
  label: string;
  state: ComponentState;
  fields: ComponentField[];
  deprecated?: boolean;
}

type TabId = 'basic-info' | 'components';
type SidebarSelection = 'all' | string;

const COMPONENT_TYPE_OPTIONS = ['Chart', 'Table', 'Annotation', 'Legend', 'Text Block'] as const;

// ─── Initial data ─────────────────────────────────────────────────────────────

const INITIAL_COMPONENTS: FigureComponent[] = [
  {
    id: 'km-plot',
    label: 'KM Plot Chart',
    state: 'ready',
    fields: [
      { label: 'Component Label', value: 'KM Plot Chart' },
      { label: 'Component Type', value: 'Chart' },
      { label: 'Source Dataset(s)', value: 'ADTTTE', badge: { text: 'AI Infer', variant: 'ai' } },
      { label: 'Source Variable(s)', value: 'AVAL, CNSR, PARAMCD', badge: { text: 'AI Infer', variant: 'ai' } },
    ],
  },
  {
    id: 'risk-table',
    label: 'Number at Risk Table',
    state: 'ready',
    fields: [
      { label: 'Component Label', value: 'Number at Risk Table' },
      { label: 'Component Type', value: 'Table' },
      { label: 'Source Dataset(s)', value: 'ADTTTE', badge: { text: 'AI Infer', variant: 'ai' } },
      { label: 'Source Variable(s)', value: 'AVAL, TRTA', badge: { text: 'Conflict', variant: 'conflict' } },
    ],
  },
];

function buildFields(type: string, instructions: string): ComponentField[] {
  const label = instructions.trim() || type;
  const base: ComponentField[] = [
    { label: 'Component Label', value: label },
    { label: 'Component Type', value: type },
  ];
  if (type === 'Annotation') {
    return [
      ...base,
      { label: 'Source Dataset(s)', value: 'ADTTE', badge: { text: 'AI Infer', variant: 'ai' } },
      { label: 'Annotation Text', value: 'Median OS: 18.3 months (95% CI: 15.1–21.5)' },
    ];
  }
  if (type === 'Legend') {
    return [
      ...base,
      { label: 'Source Variable(s)', value: 'TRT01A', badge: { text: 'AI Infer', variant: 'ai' } },
    ];
  }
  return [
    ...base,
    { label: 'Source Dataset(s)', value: 'ADTTE', badge: { text: 'AI Infer', variant: 'ai' } },
    { label: 'Source Variable(s)', value: 'AVAL, PARAM', badge: { text: 'AI Infer', variant: 'ai' } },
  ];
}

// ─── Atoms ────────────────────────────────────────────────────────────────────

function CheckboxSquare() {
  return (
    <div className="relative shrink-0 size-[16px]">
      <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 16 16">
        <path d={svgPaths.p8e46280} fill="#888E8E" />
      </svg>
    </div>
  );
}

function FieldRow({ field, deprecated }: { field: ComponentField; deprecated?: boolean }) {
  const textColor = deprecated ? '#b2b4b4' : '#3c4242';
  const borderColor = deprecated ? '#d8dada' : '#888e8e';

  return (
    <div className="bg-white relative shrink-0 w-full" style={{ pointerEvents: deprecated ? 'none' : undefined }}>
      <div className="flex flex-col gap-[4px] items-start px-[12px] py-[8px]">
        <div className="flex h-[20px] items-center justify-between shrink-0 w-full">
          <div className="flex gap-[4px] items-center min-w-0">
            <p className="font-['Inter:Regular',sans-serif] leading-[0] text-[12px] whitespace-nowrap" style={{ color: textColor }}>
              <span className="leading-[20px]" style={{ color: deprecated ? '#b2b4b4' : '#cc2c3c' }}>*</span>
              <span className="leading-[20px]">{` ${field.label}`}</span>
            </p>
            {field.badge && (
              <div
                className="flex h-[20px] items-center justify-center px-[4px] rounded-[4px] shrink-0"
                style={deprecated ? { border: '1px solid #ebecec' } : field.badge.variant === 'conflict' ? { background: '#f6cce2' } : { border: '1px solid #ebecec' }}
              >
                <p
                  className="font-['Inter:Regular',sans-serif] leading-[20px] text-[11px] whitespace-nowrap"
                  style={{ color: deprecated ? '#b2b4b4' : field.badge.variant === 'conflict' ? '#cc2c3c' : '#888e8e' }}
                >
                  {field.badge.text}
                </p>
              </div>
            )}
          </div>
          <div style={{ opacity: deprecated ? 0.4 : 1 }}>
            <CheckboxSquare />
          </div>
        </div>
        <div className="bg-white h-[32px] rounded-[2px] shrink-0 w-full" style={{ border: `0.6px solid ${borderColor}` }}>
          <div className="flex items-center px-[8px] h-full overflow-hidden">
            <p className="flex-1 font-['Inter:Regular',sans-serif] leading-[20px] text-[12px] overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: textColor }}>
              {field.value}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonPulse({ w, h }: { w: string; h: string }) {
  return <div className="rounded-[3px] animate-pulse bg-[#efefef]" style={{ width: w, height: h }} />;
}

function LoadingSection() {
  return (
    <div className="w-full flex flex-col">
      <div className="px-[12px] pt-[12px] pb-[8px]">
        <SkeletonPulse w="110px" h="15px" />
      </div>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="px-[12px] py-[8px] flex flex-col gap-[6px]">
          <SkeletonPulse w="90px" h="13px" />
          <SkeletonPulse w="100%" h="32px" />
        </div>
      ))}
    </div>
  );
}

// ─── More Options menu (portal) ───────────────────────────────────────────────

interface MoreOptionsMenuProps {
  anchorRect: DOMRect;
  isDeprecated: boolean;
  onClose: () => void;
  onDeprecate: () => void;
  onDelete: () => void;
}

function MoreOptionsMenu({ anchorRect, isDeprecated, onClose, onDeprecate, onDelete }: MoreOptionsMenuProps) {
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const menu = (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        top: anchorRect.top,
        left: anchorRect.right + 4,
        zIndex: 9999,
        transformOrigin: 'top left',
        transform: mounted ? 'scale(1)' : 'scale(0.95)',
        opacity: mounted ? 1 : 0,
        transition: 'transform 140ms cubic-bezier(0.2,0,0,1), opacity 120ms',
      }}
    >
      <div className="bg-white rounded-[8px] overflow-hidden" style={{ border: '1px solid #ebecec', boxShadow: '0px 2px 6px rgba(0,0,0,0.10)' }}>
        <div className="flex flex-col p-[4px]">
          {/* Deprecate option */}
          <button
            type="button"
            onClick={() => { onDeprecate(); onClose(); }}
            className="flex items-center gap-[6px] px-[4px] py-[6px] rounded-[2px] hover:bg-[#f8f7f7] transition-colors whitespace-nowrap w-full text-left active:scale-[0.97] transition-transform"
          >
            {/* forbid-line icon */}
            <div className="relative shrink-0 size-[16px]">
              <div className="absolute" style={{ inset: '8.33% 8.34% 8.34% 8.33%' }}>
                <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 13.333 13.333" preserveAspectRatio="none">
                  <path d="M6.66699 0C10.3487 0.000175812 13.333 2.9852 13.333 6.66699C13.3328 10.3486 10.3486 13.3328 6.66699 13.333C2.9852 13.333 0.000175816 10.3487 0 6.66699C0 2.98509 2.98509 0 6.66699 0ZM6.66699 1.33301C3.72147 1.33301 1.33301 3.72147 1.33301 6.66699C1.33318 9.61238 3.72158 12 6.66699 12C9.61227 11.9998 11.9998 9.61227 12 6.66699C12 3.72158 9.61238 1.33318 6.66699 1.33301ZM9.92773 8.98438C9.80013 9.16338 9.65578 9.33452 9.49512 9.49512C9.33452 9.65578 9.16338 9.80013 8.98438 9.92773L3.40625 4.34863C3.5338 4.16969 3.67735 3.99844 3.83789 3.83789C3.99844 3.67735 4.16969 3.5338 4.34863 3.40625L9.92773 8.98438Z" fill="#888E8E" />
                </svg>
              </div>
            </div>
            <span className="font-['Inter:Regular',sans-serif] text-[12px] leading-[20px] text-[#3c4242]">
              {isDeprecated ? 'Remove Deprecation' : 'Mark as Deprecated'}
            </span>
          </button>

          {/* Delete option */}
          <button
            type="button"
            onClick={() => { onDelete(); onClose(); }}
            className="flex items-center gap-[6px] px-[4px] py-[6px] rounded-[2px] hover:bg-[#fff5f5] transition-colors whitespace-nowrap w-full text-left active:scale-[0.97] transition-transform"
          >
            {/* delete-bin-line icon */}
            <div className="overflow-hidden relative shrink-0 size-[16px]">
              <div className="absolute" style={{ inset: '8.33%' }}>
                <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 13.3333 13.3333" preserveAspectRatio="none">
                  <path d="M10 2.66667H13.3333V4H12V12.6667C12 13.0349 11.7015 13.3333 11.3333 13.3333H2C1.63181 13.3333 1.33333 13.0349 1.33333 12.6667V4H0V2.66667H3.33333V0.666667C3.33333 0.29848 3.63181 0 4 0H9.33333C9.70153 0 10 0.29848 10 0.666667V2.66667ZM10.6667 4H2.66667V12H10.6667V4ZM4.66667 6H6V10H4.66667V6ZM7.33333 6H8.66667V10H7.33333V6ZM4.66667 1.33333V2.66667H8.66667V1.33333H4.66667Z" fill="#CC2C3C" />
                </svg>
              </div>
            </div>
            <span className="font-['Inter:Regular',sans-serif] text-[12px] leading-[20px] text-[#cc2c3c]">
              Delete Component
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(menu, document.body);
}

// ─── Delete Confirm Modal (portal) ────────────────────────────────────────────

interface DeleteConfirmModalProps {
  label: string;
  onCancel: () => void;
  onConfirm: () => void;
}

function DeleteConfirmModal({ label, onCancel, onConfirm }: DeleteConfirmModalProps) {
  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onCancel} />
      {/* Dialog */}
      <div className="relative bg-white rounded-[12px] w-[360px] flex flex-col overflow-hidden" style={{ boxShadow: '0px 20px 40px rgba(0,0,0,0.16)' }}>
        <div className="flex flex-col gap-[8px] px-[24px] pt-[24px] pb-[20px]">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[16px] leading-[24px] text-[#3c4242]">
            Delete "{label}"?
          </p>
          <p className="font-['Inter:Regular',sans-serif] text-[13px] leading-[20px] text-[#656969]">
            This action is permanent and cannot be undone. If you only need to hide this component temporarily, consider using <span className="font-['Inter:Medium',sans-serif] font-medium text-[#3c4242]">Mark as Deprecated</span> instead — it can be reversed at any time.
          </p>
        </div>
        <div className="flex items-center justify-end gap-[8px] px-[24px] py-[16px]" style={{ borderTop: '1px solid #ebecec' }}>
          <button
            type="button"
            onClick={onCancel}
            className="h-[32px] px-[14px] rounded-[4px] font-['Inter:Medium',sans-serif] font-medium text-[12px] text-[#3c4242] hover:bg-[#f8f7f7] transition-colors active:scale-[0.97] transition-transform"
            style={{ border: '1px solid #d8dada' }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-[32px] px-[14px] rounded-[4px] font-['Inter:Medium',sans-serif] font-medium text-[12px] text-white bg-[#cc2c3c] hover:bg-[#b02030] transition-colors active:scale-[0.97] transition-transform"
          >
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── Add Component dropdown (portal — escapes overflow clipping) ───────────────

interface AddMenuProps {
  anchorRect: DOMRect;
  onClose: () => void;
  onGenerate: (name: string, type: string, instructions: string) => void;
}

function AddComponentMenu({ anchorRect, onClose, onGenerate }: AddMenuProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<string>('');
  const [instructions, setInstructions] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const inputBorder = '1px solid #ebecec';

  const menu = (
    <div
      style={{
        position: 'fixed',
        top: anchorRect.bottom + 4,
        left: anchorRect.left,
        width: 260,
        zIndex: 9999,
        transformOrigin: 'top left',
        transform: mounted ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(-4px)',
        opacity: mounted ? 1 : 0,
        transition: 'transform 180ms cubic-bezier(0.2,0,0,1), opacity 140ms cubic-bezier(0.2,0,0,1)',
      }}
      ref={menuRef}
    >
      <div
        className="bg-white rounded-[8px] flex flex-col overflow-hidden"
        style={{ border: '1px solid #d8dada', boxShadow: '0px 4px 6px rgba(0,0,0,0.15)' }}
      >
        {/* Header — title only, no close button */}
        <div
          className="h-[40px] shrink-0 flex items-center px-[12px]"
          style={{ borderBottom: '0.5px solid #ebecec' }}
        >
          <p className="font-['Inter:Medium',sans-serif] font-medium text-[14px] leading-[24px] text-[#3c4242] whitespace-nowrap">
            Add Component
          </p>
        </div>

        {/* Form body */}
        <div className="flex flex-col gap-[16px] p-[12px]">
          {/* Name */}
          <div className="flex flex-col gap-[6px]">
            <div className="flex gap-[2px] items-center">
              <p className="font-['Inter:Medium',sans-serif] font-medium text-[12px] leading-[18px] text-[#3c4242]">Name</p>
              <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[12px] text-[#830051]">*</p>
            </div>
            <div className="bg-white h-[36px] rounded-[4px] relative">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Input name..."
                className="w-full h-full px-[12px] font-['Inter:Regular',sans-serif] text-[12px] leading-[16px] text-[#3c4242] placeholder:text-[#888e8e] outline-none bg-transparent rounded-[4px]"
                style={{ border: inputBorder }}
              />
            </div>
          </div>

          {/* Type */}
          <div className="flex flex-col gap-[6px]">
            <div className="flex gap-[2px] items-center">
              <p className="font-['Inter:Medium',sans-serif] font-medium text-[12px] leading-[18px] text-[#3c4242]">Type</p>
              <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[12px] text-[#830051]">*</p>
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(v => !v)}
                className="w-full h-[36px] flex items-center justify-between pl-[12px] pr-[10px] bg-white rounded-[4px] active:scale-[0.97] transition-transform"
                style={{ border: inputBorder }}
              >
                <span
                  className="font-['Inter:Regular',sans-serif] text-[12px] leading-[16px] flex-1 text-left overflow-hidden text-ellipsis whitespace-nowrap"
                  style={{ color: type ? '#3c4242' : '#888e8e' }}
                >
                  {type || 'Select a component type'}
                </span>
                <svg
                  className="size-[20px] text-[#888E8E] shrink-0 transition-transform duration-150"
                  style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  viewBox="0 0 20 20" fill="none"
                >
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {dropdownOpen && (
                <div
                  className="absolute left-0 right-0 top-[38px] bg-white rounded-[6px] overflow-hidden"
                  style={{ border: '1px solid #D8DADA', boxShadow: '0px 4px 12px rgba(0,0,0,0.08)', zIndex: 10 }}
                >
                  {COMPONENT_TYPE_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => { setType(opt); setDropdownOpen(false); }}
                      className="w-full text-left px-[12px] py-[7px] font-['Inter:Regular',sans-serif] text-[12px] transition-colors hover:bg-[#f8f7f7] active:scale-[0.98] transition-transform"
                      style={{ color: opt === type ? '#830051' : '#3c4242', background: opt === type ? '#faf5f8' : undefined }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Custom instructions */}
          <div className="flex flex-col gap-[6px]">
            <p className="font-['Inter:Medium',sans-serif] font-medium text-[12px] leading-[18px] text-[#3c4242]">
              Custom instructions
            </p>
            <div className="bg-white h-[90px] rounded-[4px] relative">
              <textarea
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                placeholder="Describe the component..."
                className="w-full h-full resize-none pl-[12px] pr-[20px] py-[8px] font-['Inter:Regular',sans-serif] text-[12px] leading-[16px] text-[#3c4242] placeholder:text-[#888e8e] outline-none bg-transparent rounded-[4px]"
                style={{ border: inputBorder }}
              />
            </div>
          </div>

          {/* Generate button */}
          <button
            type="button"
            onClick={() => { onGenerate(name, type, instructions); onClose(); }}
            className="w-full flex items-center justify-center gap-[4px] rounded-[4px] bg-[#830051] text-white font-['Inter:Medium',sans-serif] font-medium text-[12px] leading-[18px] px-[8px] py-[4px] hover:bg-[#6d0044] active:scale-[0.97] transition-colors transition-transform"
          >
            <svg className="size-[14px] shrink-0" viewBox="0 0 14 14" fill="none">
              <path d="M7 3.617l.951-.634.431.647L7.39 4.29V6.326l1.762-1.017.077-1.191.776.05-.073 1.14 1.025.506-.345.697-1.07-.529L7.89 7l1.762 1.017 1.07-.529.345.697-1.025.506.073 1.14-.776.05-.077-1.191L7.39 9.674V11.71l.993.662-.431.647L7 12.383l-.952.636-.431-.647.993-.662V9.674L4.848 10.69l-.077 1.191-.776-.05.073-1.14-1.025-.506.345-.697 1.07.529L6.11 9 4.348 7.983l-1.07.529-.345-.697 1.025-.506-.073-1.14.776-.05.077 1.191L6.61 6.326V4.29L5.617 3.63l.431-.647L7 3.617Z" fill="white" />
            </svg>
            Generate
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(menu, document.body);
}

// ─── Sidebar items ────────────────────────────────────────────────────────────

// "All" row — shows a "+" icon button on hover to open the Add Component menu
interface AllSidebarItemProps {
  isSelected: boolean;
  onSelect: () => void;
  onAdd: (rect: DOMRect) => void;
  menuOpen: boolean;
}

function AllSidebarItem({ isSelected, onSelect, onAdd, menuOpen }: AllSidebarItemProps) {
  const [hovered, setHovered] = useState(false);
  const addBtnRef = useRef<HTMLButtonElement>(null);
  const showAdd = hovered || menuOpen;

  return (
    <div
      className="relative shrink-0 w-full rounded-[4px] mx-[4px] cursor-pointer"
      style={{
        background: isSelected ? '#f4e8ee' : hovered ? '#f8f7f7' : undefined,
        width: 'calc(100% - 8px)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onSelect}
    >
      <div className="flex items-center pl-[8px] pr-[4px] py-[6px] h-[32px]">
        <p
          className="flex-1 font-['Inter:Medium',sans-serif] font-medium text-[12px] leading-[18px] overflow-hidden text-ellipsis whitespace-nowrap"
          style={{ color: isSelected ? '#830051' : '#3c4242' }}
        >
          All
        </p>

        {/* "+" button — visible on hover or while menu is open */}
        <button
          ref={addBtnRef}
          type="button"
          aria-label="Add Component"
          onClick={e => {
            e.stopPropagation();
            if (addBtnRef.current) onAdd(addBtnRef.current.getBoundingClientRect());
          }}
          className="shrink-0 size-[24px] rounded-[4.8px] flex items-center justify-center active:scale-[0.92] transition-transform hover:bg-[#ebecec]"
          style={{
            background: menuOpen ? '#ebecec' : undefined,
            opacity: showAdd ? 1 : 0,
            pointerEvents: showAdd ? 'auto' : 'none',
            transition: 'opacity 120ms',
          }}
        >
          {/* "+" path from LeftSidebar Figma import */}
          <svg className="size-[10px]" viewBox="0 0 9.33333 9.33333" fill="none">
            <path d="M4 4V0H5.33333V4H9.33333V5.33333H5.33333V9.33333H4V5.33333H0V4H4Z" fill="#888E8E" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function SidebarItem({
  label,
  isSelected,
  isLoading = false,
  deprecated = false,
  moreOpen = false,
  onClick,
  onMore,
}: {
  label: string;
  isSelected: boolean;
  isLoading?: boolean;
  deprecated?: boolean;
  moreOpen?: boolean;
  onClick: () => void;
  onMore?: (rect: DOMRect) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const moreBtnRef = useRef<HTMLButtonElement>(null);
  const showMore = (hovered || moreOpen) && !isLoading;

  const bg = isLoading ? undefined : isSelected ? '#f4e8ee' : hovered ? '#f8f7f7' : undefined;

  return (
    <div
      className="relative shrink-0 rounded-[4px] cursor-pointer"
      style={{ background: bg, width: 'calc(100% - 8px)', marginLeft: 4, marginRight: 4 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {isLoading ? (
        <div className="flex items-center gap-[4px] pl-[8px] pr-[4px] py-[6px] h-[32px] bg-[#f4e8ee] rounded-[4px]">
          <p className="flex-1 font-['Inter:Medium',sans-serif] font-medium text-[12px] leading-[18px] text-[#830051] overflow-hidden text-ellipsis whitespace-nowrap min-w-px">
            {label}
          </p>
          <div className="overflow-hidden relative rounded-[4.8px] shrink-0 size-[24px]">
            <div className="absolute" style={{ inset: '15% 12.14% 13.06% 13%' }}>
              <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 17.9667 17.2666" preserveAspectRatio="none">
                <path d="M13.3334 0L14.3884 1.97826L16.3667 3.03334L14.3884 4.08841L13.3334 6.06666L12.2783 4.08841L10.3 3.03334L12.2783 1.97826L13.3334 0ZM6.13333 2.5L8.26665 6.5L12.2667 8.63335L8.26665 10.7666L6.13333 14.7666L4 10.7666L0 8.63335L4 6.5L6.13333 2.5ZM15.4667 12.1L14.1334 9.59999L12.8 12.1L10.3 13.4334L12.8 14.7666L14.1334 17.2666L15.4667 14.7666L17.9667 13.4334L15.4667 12.1Z" fill="url(#sparkle-gen-grad)" />
                <defs>
                  <linearGradient id="sparkle-gen-grad" gradientUnits="userSpaceOnUse" x1="17.9667" y1="8.63332" x2="0" y2="8.63332">
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
      ) : (
        <div className="flex items-center pl-[8px] pr-[4px] py-[6px] h-[32px] gap-[4px]">
          <p
            className="flex-1 font-['Inter:Medium',sans-serif] font-medium text-[12px] leading-[18px] overflow-hidden text-ellipsis whitespace-nowrap min-w-px"
            style={{ color: deprecated ? '#b2b4b4' : isSelected ? '#830051' : '#3c4242', textDecoration: deprecated ? 'line-through' : undefined }}
          >
            {label}
          </p>
          {/* ··· More button — appears on hover */}
          {onMore && (
            <button
              ref={moreBtnRef}
              type="button"
              aria-label="More options"
              onClick={e => {
                e.stopPropagation();
                if (moreBtnRef.current) onMore(moreBtnRef.current.getBoundingClientRect());
              }}
              className="shrink-0 size-[24px] rounded-[4.8px] flex items-center justify-center active:scale-[0.92] transition-transform hover:bg-[#ebecec]"
              style={{
                background: moreOpen ? '#ebecec' : undefined,
                opacity: showMore ? 1 : 0,
                pointerEvents: showMore ? 'auto' : 'none',
                transition: 'opacity 120ms',
              }}
            >
              {/* more-line: three dots */}
              <svg className="size-[12px]" viewBox="0 0 12 2" fill="none">
                <path d="M1 0C0.45 0 0 0.45 0 1C0 1.55 0.45 2 1 2C1.55 2 2 1.55 2 1C2 0.45 1.55 0 1 0ZM11 0C10.45 0 10 0.45 10 1C10 1.55 10.45 2 11 2C11.55 2 12 1.55 12 1C12 0.45 11.55 0 11 0ZM6 0C5.45 0 5 0.45 5 1C5 1.55 5.45 2 6 2C6.55 2 7 1.55 7 1C7 0.45 6.55 0 6 0Z" fill="#888E8E" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main panel ───────────────────────────────────────────────────────────────

interface FigureMetadataPanelProps {
  onClose: () => void;
}

export default function FigureMetadataPanel({ onClose: _onClose }: FigureMetadataPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>('components');
  const [selection, setSelection] = useState<SidebarSelection>('all');
  const [components, setComponents] = useState<FigureComponent[]>(INITIAL_COMPONENTS);
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const [moreMenu, setMoreMenu] = useState<{ compId: string; rect: DOMRect } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const totalFields = components.filter(c => c.state === 'ready').reduce((s, c) => s + c.fields.length, 0);

  const openMenu = useCallback((rect: DOMRect) => {
    setAnchorRect(rect);
    setMenuOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    setAnchorRect(null);
  }, []);

  const handleDeprecate = useCallback((id: string) => {
    setComponents(prev => prev.map(c => c.id === id ? { ...c, deprecated: !c.deprecated } : c));
  }, []);

  const handleDelete = useCallback((id: string) => {
    setComponents(prev => prev.filter(c => c.id !== id));
    setSelection(sel => sel === id ? 'all' : sel);
    setDeleteTarget(null);
  }, []);

  const handleGenerate = useCallback((name: string, type: string, instructions: string) => {
    const id = `generated-${Date.now()}`;
    const label = name.trim() || instructions.trim().split(/\s+/).slice(0, 4).join(' ') || type;

    setComponents(prev => [
      ...prev,
      { id, label, state: 'loading', fields: [] },
    ]);
    setSelection(id);

    setTimeout(() => {
      setComponents(prev =>
        prev.map(c =>
          c.id === id
            ? { ...c, state: 'ready', fields: buildFields(type, label) }
            : c
        )
      );
    }, 2200);
  }, []);

  const DeprecatedBanner = () => (
    <div className="flex items-center gap-[6px] mx-[12px] mt-[10px] mb-[2px] px-[10px] py-[6px] rounded-[4px]" style={{ background: '#f8f7f7', border: '1px solid #ebecec' }}>
      <svg className="shrink-0 size-[14px]" fill="none" viewBox="0 0 13.333 13.333">
        <path d="M6.66699 0C10.3487 0.000175812 13.333 2.9852 13.333 6.66699C13.3328 10.3486 10.3486 13.3328 6.66699 13.333C2.9852 13.333 0.000175816 10.3487 0 6.66699C0 2.98509 2.98509 0 6.66699 0ZM6.66699 1.33301C3.72147 1.33301 1.33301 3.72147 1.33301 6.66699C1.33318 9.61238 3.72158 12 6.66699 12C9.61227 11.9998 11.9998 9.61227 12 6.66699C12 3.72158 9.61238 1.33318 6.66699 1.33301ZM9.92773 8.98438C9.80013 9.16338 9.65578 9.33452 9.49512 9.49512C9.33452 9.65578 9.16338 9.80013 8.98438 9.92773L3.40625 4.34863C3.5338 4.16969 3.67735 3.99844 3.83789 3.83789C3.99844 3.67735 4.16969 3.5338 4.34863 3.40625L9.92773 8.98438Z" fill="#888E8E" />
      </svg>
      <p className="font-['Inter:Regular',sans-serif] text-[11px] leading-[16px] text-[#888e8e]">This component is deprecated</p>
    </div>
  );

  const renderContent = () => {
    if (selection === 'all') {
      return (
        <div className="w-full">
          {components.map((comp, idx) => (
            <div key={comp.id}>
              {idx > 0 && <div className="h-px bg-[#ebecec] mx-[12px] my-[4px]" />}
              {comp.state === 'loading' ? (
                <LoadingSection />
              ) : (
                <div className="flex flex-col">
                  <div className="px-[12px] pt-[12px] pb-[6px]">
                    <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[13px] leading-[20px]" style={{ color: comp.deprecated ? '#b2b4b4' : '#3c4242' }}>
                      {comp.label}
                    </p>
                  </div>
                  {comp.fields.map((field, i) => <FieldRow key={i} field={field} deprecated={comp.deprecated} />)}
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    const comp = components.find(c => c.id === selection);
    if (!comp) return null;
    if (comp.state === 'loading') return <LoadingSection />;

    return (
      <div className="w-full">
        {comp.deprecated && <DeprecatedBanner />}
        <div className="flex flex-col items-start p-[12px]">
          <div className="pb-[8px] w-full shrink-0">
            <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[13px] leading-[20px]" style={{ color: comp.deprecated ? '#b2b4b4' : '#3c4242', textDecoration: comp.deprecated ? 'line-through' : undefined }}>
              {comp.label}
            </p>
          </div>
          {comp.fields.map((field, i) => <FieldRow key={i} field={field} deprecated={comp.deprecated} />)}
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className="bg-white flex flex-col h-full min-w-px relative rounded-[8px] overflow-hidden"
        style={{
          border: '1px solid #ebecec',
          boxShadow: '0px 1px 1px 0px rgba(0,0,0,0.04), 0px 3px 8px -2px rgba(0,0,0,0.02)',
        }}
      >
        {/* Tab bar */}
        <div
          className="bg-white h-[40px] shrink-0 w-full flex items-center justify-between"
          style={{ borderBottom: '0.6px solid #d8dada' }}
        >
          <div className="flex h-full items-center">
            {(['basic-info', 'components'] as TabId[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="h-full relative shrink-0 cursor-pointer"
              >
                {activeTab === tab && (
                  <div aria-hidden className="absolute border-[#830051] border-b-2 inset-0 pointer-events-none" />
                )}
                <div className="flex items-center justify-center px-[16px] h-full">
                  <p className={`font-['Inter:Medium',sans-serif] font-medium text-[14px] leading-[24px] whitespace-nowrap ${activeTab === tab ? 'text-[#830051]' : 'text-[#3c4242]'}`}>
                    {tab === 'basic-info' ? 'Basic info' : 'Components'}
                  </p>
                </div>
              </button>
            ))}
          </div>
          <button
            className="mr-[8px] rounded-[4px] size-[24px] flex items-center justify-center hover:bg-black/5 transition-colors active:scale-[0.96] transition-transform"
            aria-label="Edit"
          >
            <svg className="size-[12px]" fill="none" viewBox="0 0 12 11.9804">
              <path d={svgPaths.p243c4800} fill="#888E8E" />
            </svg>
          </button>
        </div>

        {activeTab === 'components' && (
          <>
            {/* Confirmed bar */}
            <div className="bg-[#f8f7f7] shrink-0 w-full">
              <div className="flex items-center justify-end gap-[6px] px-[12px] py-[8px]">
                <p className="font-['Inter:Regular',sans-serif] text-[12px] leading-[16px] text-[#3c4242] whitespace-nowrap tabular-nums">
                  0/{totalFields} Confirmed
                </p>
                <CheckboxSquare />
              </div>
            </div>

            {/* Body: sidebar + content */}
            <div className="flex flex-1 min-h-0">
              {/* Left sidebar */}
              <div
                className="flex flex-col shrink-0 w-[140px] overflow-y-auto py-[4px] gap-[2px]"
                style={{ boxShadow: '1px 0 0 0 #ebecec' }}
              >
                {/* ALL row — "+" appears on hover */}
                <AllSidebarItem
                  isSelected={selection === 'all'}
                  onSelect={() => setSelection('all')}
                  onAdd={openMenu}
                  menuOpen={menuOpen}
                />

                {/* Individual components */}
                {components.map(comp => (
                  <SidebarItem
                    key={comp.id}
                    label={comp.label}
                    isSelected={selection === comp.id}
                    isLoading={comp.state === 'loading'}
                    deprecated={comp.deprecated}
                    moreOpen={moreMenu?.compId === comp.id}
                    onClick={() => setSelection(comp.id)}
                    onMore={rect => setMoreMenu({ compId: comp.id, rect })}
                  />
                ))}
              </div>

              {/* Right content */}
              <div className="flex-1 min-w-0 overflow-y-auto">
                {renderContent()}
              </div>
            </div>
          </>
        )}

        {activeTab === 'basic-info' && (
          <div className="flex-1 flex items-center justify-center text-[#888e8e] text-[12px] font-['Inter:Regular',sans-serif]">
            Basic info
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {menuOpen && anchorRect && (
        <AddComponentMenu
          anchorRect={anchorRect}
          onClose={closeMenu}
          onGenerate={handleGenerate}
        />
      )}

      {moreMenu && (
        <MoreOptionsMenu
          anchorRect={moreMenu.rect}
          isDeprecated={!!components.find(c => c.id === moreMenu.compId)?.deprecated}
          onClose={() => setMoreMenu(null)}
          onDeprecate={() => handleDeprecate(moreMenu.compId)}
          onDelete={() => { setDeleteTarget(moreMenu.compId); setMoreMenu(null); }}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          label={components.find(c => c.id === deleteTarget)?.label ?? ''}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => handleDelete(deleteTarget)}
        />
      )}
    </>
  );
}
