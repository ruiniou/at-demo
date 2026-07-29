import { FileText } from 'lucide-react';
import Union from '../../imports/Union';
import MetadataPanel from './MetadataPanel';
import FigureMetadataPanel from './FigureMetadataPanel';
import Divider from './Divider';
import svgFigurePaths from '../../imports/MetadataComponents-1/svg-azr8qwiio2';
import { useState, useRef, useEffect, useMemo } from 'react';
import type React from 'react';
import { createPortal } from 'react-dom';
import { Input } from './ui/input';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';

interface ShellPreviewProps {
  selectedItem: string | null;
  selectedItemType?: 'table' | 'figure' | 'listing' | 'program' | null;
  onBlockClick: () => void;
  onMetadataClick: () => void;
  metadataOpen: boolean;
  onCloseMetadata: () => void;
  isLocked?: boolean;
  onPagePreviewChange?: (active: boolean) => void;
}

const METADATA_MIN = 280;
const METADATA_MAX = 420;
const A4_LANDSCAPE_WIDTH_PX = 1123;
const A4_LANDSCAPE_HEIGHT_PX = 794;
const A4_HORIZONTAL_PADDING_PX = 96;
const PRINT_PADDING_TOP_PX = 64;
const PRINT_PADDING_BOTTOM_PX = 48;
const PRINT_HEADER_BLOCK_HEIGHT_PX = 62;
const PRINT_TABLE_HEAD_HEIGHT_PX = 28;
const PRINT_TABLE_ROW_HEIGHT_PX = 28;
const PRINT_ROWS_PER_PAGE = Math.max(
  1,
  Math.floor(
    (A4_LANDSCAPE_HEIGHT_PX
      - PRINT_PADDING_TOP_PX
      - PRINT_PADDING_BOTTOM_PX
      - PRINT_HEADER_BLOCK_HEIGHT_PX
      - PRINT_TABLE_HEAD_HEIGHT_PX) / PRINT_TABLE_ROW_HEIGHT_PX
  )
);


const columns = [
  { key: 'subject', label: 'Subject identifier', width: 'min-w-[112px]', widthPx: 112 },
  { key: 'age', label: 'Age/Sex/Race [a]', width: 'min-w-[118px]', widthPx: 118 },
  { key: 'region', label: 'Geographical region/Prior gastrectomy/Line of therapy', width: 'min-w-[205px]', widthPx: 205 },
  { key: 'ethnicity', label: 'Ethnicity', width: 'min-w-[86px]', widthPx: 86 },
  { key: 'country', label: 'Country/Area', width: 'min-w-[96px]', widthPx: 96 },
  { key: 'weight', label: 'Baseline weight (kg)', width: 'min-w-[108px]', widthPx: 108 },
  { key: 'height', label: 'Baseline height (cm)', width: 'min-w-[112px]', widthPx: 112 },
  { key: 'bmi', label: 'Baseline body mass index (kg/m2)', width: 'min-w-[124px]', widthPx: 124 },
  { key: 'nicotine', label: 'Nicotine use', width: 'min-w-[92px]', widthPx: 92 },
  { key: 'alcohol', label: 'Alcohol use', width: 'min-w-[88px]', widthPx: 88 },
  { key: 'ecog', label: 'ECOG performance status', width: 'min-w-[132px]', widthPx: 132 },
] as const;

const rows = [
  {
    subject: 'E0000001',
    age: '29/F/White',
    region: 'xx/xx/xx',
    ethnicity: 'Xxxxxxx',
    country: 'Xxxxxxx',
    weight: 'xx',
    height: 'xx',
    bmi: 'xx.x',
    nicotine: 'Xxxxx',
    alcohol: 'Xxxxx',
    ecog: '(0) Fully active',
  },
  {
    subject: 'E0000002',
    age: '30/M/Asian',
    region: 'xx/xx/xx',
    ethnicity: 'Xxxxxxx',
    country: 'Xxxxxxx',
    weight: 'xx',
    height: 'xx',
    bmi: 'xx.x',
    nicotine: 'Xxxxx',
    alcohol: 'Xxxxx',
    ecog: '(1) Fully active',
  },
  {
    subject: 'E0000003',
    age: '31/F/Black',
    region: 'xx/xx/xx',
    ethnicity: 'Xxxxxxx',
    country: 'Xxxxxxx',
    weight: 'xx',
    height: 'xx',
    bmi: 'xx.x',
    nicotine: 'Xxxxx',
    alcohol: 'Xxxxx',
    ecog: '(2) Fully active',
  },
  {
    subject: 'E0000004',
    age: '32/M/Other',
    region: 'xx/xx/xx',
    ethnicity: 'Xxxxxxx',
    country: 'Xxxxxxx',
    weight: 'xx',
    height: 'xx',
    bmi: 'xx.x',
    nicotine: 'Xxxxx',
    alcohol: 'Xxxxx',
    ecog: '(3) Fully active',
  },
  {
    subject: 'E0000005',
    age: '33/F/White',
    region: 'xx/xx/xx',
    ethnicity: 'Xxxxxxx',
    country: 'Xxxxxxx',
    weight: 'xx',
    height: 'xx',
    bmi: 'xx.x',
    nicotine: 'Xxxxx',
    alcohol: 'Xxxxx',
    ecog: '(0) Fully active',
  },
  {
    subject: 'E0000006',
    age: '34/M/Asian',
    region: 'xx/xx/xx',
    ethnicity: 'Xxxxxxx',
    country: 'Xxxxxxx',
    weight: 'xx',
    height: 'xx',
    bmi: 'xx.x',
    nicotine: 'Xxxxx',
    alcohol: 'Xxxxx',
    ecog: '(1) Fully active',
  },
  {
    subject: 'E0000007',
    age: '35/F/Black',
    region: 'xx/xx/xx',
    ethnicity: 'Xxxxxxx',
    country: 'Xxxxxxx',
    weight: 'xx',
    height: 'xx',
    bmi: 'xx.x',
    nicotine: 'Xxxxx',
    alcohol: 'Xxxxx',
    ecog: '(2) Fully active',
  },
  {
    subject: 'E0000008',
    age: '36/M/Other',
    region: 'xx/xx/xx',
    ethnicity: 'Xxxxxxx',
    country: 'Xxxxxxx',
    weight: 'xx',
    height: 'xx',
    bmi: 'xx.x',
    nicotine: 'Xxxxx',
    alcohol: 'Xxxxx',
    ecog: '(3) Fully active',
  },
  {
    subject: 'E0000009',
    age: '37/F/White',
    region: 'xx/xx/xx',
    ethnicity: 'Xxxxxxx',
    country: 'Xxxxxxx',
    weight: 'xx',
    height: 'xx',
    bmi: 'xx.x',
    nicotine: 'Xxxxx',
    alcohol: 'Xxxxx',
    ecog: '(0) Fully active',
  },
  {
    subject: 'E0000010',
    age: '38/M/Asian',
    region: 'xx/xx/xx',
    ethnicity: 'Xxxxxxx',
    country: 'Xxxxxxx',
    weight: 'xx',
    height: 'xx',
    bmi: 'xx.x',
    nicotine: 'Xxxxx',
    alcohol: 'Xxxxx',
    ecog: '(1) Fully active',
  },
  {
    subject: 'E0000011',
    age: '39/F/Black',
    region: 'xx/xx/xx',
    ethnicity: 'Xxxxxxx',
    country: 'Xxxxxxx',
    weight: 'xx',
    height: 'xx',
    bmi: 'xx.x',
    nicotine: 'Xxxxx',
    alcohol: 'Xxxxx',
    ecog: '(2) Fully active',
  },
  {
    subject: 'E0000012',
    age: '40/M/Other',
    region: 'xx/xx/xx',
    ethnicity: 'Xxxxxxx',
    country: 'Xxxxxxx',
    weight: 'xx',
    height: 'xx',
    bmi: 'xx.x',
    nicotine: 'Xxxxx',
    alcohol: 'Xxxxx',
    ecog: '(3) Fully active',
  },
  {
    subject: 'E0000013',
    age: '41/F/White',
    region: 'xx/xx/xx',
    ethnicity: 'Xxxxxxx',
    country: 'Xxxxxxx',
    weight: 'xx',
    height: 'xx',
    bmi: 'xx.x',
    nicotine: 'Xxxxx',
    alcohol: 'Xxxxx',
    ecog: '(0) Fully active',
  },
  {
    subject: 'E0000014',
    age: '42/M/Asian',
    region: 'xx/xx/xx',
    ethnicity: 'Xxxxxxx',
    country: 'Xxxxxxx',
    weight: 'xx',
    height: 'xx',
    bmi: 'xx.x',
    nicotine: 'Xxxxx',
    alcohol: 'Xxxxx',
    ecog: '(1) Fully active',
  },
  {
    subject: 'E0000015',
    age: '43/F/Black',
    region: 'xx/xx/xx',
    ethnicity: 'Xxxxxxx',
    country: 'Xxxxxxx',
    weight: 'xx',
    height: 'xx',
    bmi: 'xx.x',
    nicotine: 'Xxxxx',
    alcohol: 'Xxxxx',
    ecog: '(2) Fully active',
  },
  {
    subject: 'E0000016',
    age: '44/M/Other',
    region: 'xx/xx/xx',
    ethnicity: 'Xxxxxxx',
    country: 'Xxxxxxx',
    weight: 'xx',
    height: 'xx',
    bmi: 'xx.x',
    nicotine: 'Xxxxx',
    alcohol: 'Xxxxx',
    ecog: '(3) Fully active',
  },
  {
    subject: 'E0000017',
    age: '45/F/White',
    region: 'xx/xx/xx',
    ethnicity: 'Xxxxxxx',
    country: 'Xxxxxxx',
    weight: 'xx',
    height: 'xx',
    bmi: 'xx.x',
    nicotine: 'Xxxxx',
    alcohol: 'Xxxxx',
    ecog: '(0) Fully active',
  },
  {
    subject: 'E0000018',
    age: '46/M/Asian',
    region: 'xx/xx/xx',
    ethnicity: 'Xxxxxxx',
    country: 'Xxxxxxx',
    weight: 'xx',
    height: 'xx',
    bmi: 'xx.x',
    nicotine: 'Xxxxx',
    alcohol: 'Xxxxx',
    ecog: '(1) Fully active',
  },
  {
    subject: 'E0000019',
    age: '47/F/Black',
    region: 'xx/xx/xx',
    ethnicity: 'Xxxxxxx',
    country: 'Xxxxxxx',
    weight: 'xx',
    height: 'xx',
    bmi: 'xx.x',
    nicotine: 'Xxxxx',
    alcohol: 'Xxxxx',
    ecog: '(2) Fully active',
  },
  {
    subject: 'E0000020',
    age: '48/M/Other',
    region: 'xx/xx/xx',
    ethnicity: 'Xxxxxxx',
    country: 'Xxxxxxx',
    weight: 'xx',
    height: 'xx',
    bmi: 'xx.x',
    nicotine: 'Xxxxx',
    alcohol: 'Xxxxx',
    ecog: '(3) Fully active',
  },
  {
    subject: 'E0000021',
    age: '49/F/White',
    region: 'xx/xx/xx',
    ethnicity: 'Xxxxxxx',
    country: 'Xxxxxxx',
    weight: 'xx',
    height: 'xx',
    bmi: 'xx.x',
    nicotine: 'Xxxxx',
    alcohol: 'Xxxxx',
    ecog: '(0) Fully active',
  },
  {
    subject: 'E0000022',
    age: '50/M/Asian',
    region: 'xx/xx/xx',
    ethnicity: 'Xxxxxxx',
    country: 'Xxxxxxx',
    weight: 'xx',
    height: 'xx',
    bmi: 'xx.x',
    nicotine: 'Xxxxx',
    alcohol: 'Xxxxx',
    ecog: '(1) Fully active',
  },
  {
    subject: 'E0000023',
    age: '51/F/Black',
    region: 'xx/xx/xx',
    ethnicity: 'Xxxxxxx',
    country: 'Xxxxxxx',
    weight: 'xx',
    height: 'xx',
    bmi: 'xx.x',
    nicotine: 'Xxxxx',
    alcohol: 'Xxxxx',
    ecog: '(2) Fully active',
  },
  {
    subject: 'E0000024',
    age: '52/M/Other',
    region: 'xx/xx/xx',
    ethnicity: 'Xxxxxxx',
    country: 'Xxxxxxx',
    weight: 'xx',
    height: 'xx',
    bmi: 'xx.x',
    nicotine: 'Xxxxx',
    alcohol: 'Xxxxx',
    ecog: '(3) Fully active',
  },
  {
    subject: 'E0000025',
    age: '53/F/White',
    region: 'xx/xx/xx',
    ethnicity: 'Xxxxxxx',
    country: 'Xxxxxxx',
    weight: 'xx',
    height: 'xx',
    bmi: 'xx.x',
    nicotine: 'Xxxxx',
    alcohol: 'Xxxxx',
    ecog: '(0) Fully active',
  },
  {
    subject: 'E0000026',
    age: '54/M/Asian',
    region: 'xx/xx/xx',
    ethnicity: 'Xxxxxxx',
    country: 'Xxxxxxx',
    weight: 'xx',
    height: 'xx',
    bmi: 'xx.x',
    nicotine: 'Xxxxx',
    alcohol: 'Xxxxx',
    ecog: '(1) Fully active',
  },
  {
    subject: 'E0000027',
    age: '55/F/Black',
    region: 'xx/xx/xx',
    ethnicity: 'Xxxxxxx',
    country: 'Xxxxxxx',
    weight: 'xx',
    height: 'xx',
    bmi: 'xx.x',
    nicotine: 'Xxxxx',
    alcohol: 'Xxxxx',
    ecog: '(2) Fully active',
  },
  {
    subject: 'E0000028',
    age: '56/M/Other',
    region: 'xx/xx/xx',
    ethnicity: 'Xxxxxxx',
    country: 'Xxxxxxx',
    weight: 'xx',
    height: 'xx',
    bmi: 'xx.x',
    nicotine: 'Xxxxx',
    alcohol: 'Xxxxx',
    ecog: '(3) Fully active',
  },
  {
    subject: 'E0000029',
    age: '57/F/White',
    region: 'xx/xx/xx',
    ethnicity: 'Xxxxxxx',
    country: 'Xxxxxxx',
    weight: 'xx',
    height: 'xx',
    bmi: 'xx.x',
    nicotine: 'Xxxxx',
    alcohol: 'Xxxxx',
    ecog: '(0) Fully active',
  },
  {
    subject: 'E0000030',
    age: '58/M/Asian',
    region: 'xx/xx/xx',
    ethnicity: 'Xxxxxxx',
    country: 'Xxxxxxx',
    weight: 'xx',
    height: 'xx',
    bmi: 'xx.x',
    nicotine: 'Xxxxx',
    alcohol: 'Xxxxx',
    ecog: '(1) Fully active',
  }
] as const;

// ─── Divider Components ───────────────────────────────────────────────────────
// TABLE_TOP: where the <table> begins inside the relative container (= title div height).
// The line is clipped to this range so it never overflows the table.
const TABLE_TOP = 72;
// Pill sits just above the thead row.
const PILL_BOTTOM_Y = TABLE_TOP - 4;

interface PageBreakDividerProps {
  gapX: number;
  label: string;
  isSelected: boolean;
  isDragging: boolean;
  dragGapX: number;
  onSelect: (e: React.MouseEvent) => void;
  onRemove: () => void;
  onDragStart: (e: React.MouseEvent) => void;
}

function PageBreakDivider({
  gapX,
  label,
  isSelected,
  isDragging,
  dragGapX,
  onSelect,
  onRemove,
  onDragStart,
}: PageBreakDividerProps) {
  const [isHovered, setIsHovered] = useState(false);

  const variant =
    isDragging ? 'drag'
    : isSelected && isHovered ? 'selected-hover'
    : isSelected ? 'selected'
    : isHovered ? 'hover'
    : 'default';

  const lineWidth = variant === 'hover' || variant === 'drag' ? 3 : 2;
  const lineSolid = variant !== 'default';

  return (
    <>
      {/* Ghost — original position while dragging; clipped to table height */}
      {isDragging && (
        <div
          className="absolute bottom-0 pointer-events-none"
          style={{ left: `${gapX}px`, top: `${TABLE_TOP}px`, width: '2px', backgroundColor: 'rgba(240,171,0,0.2)', zIndex: 28 }}
        />
      )}

      {/* Hit area — covers table area only (top = TABLE_TOP) */}
      <div
        className="absolute bottom-0"
        style={{ left: `${dragGapX - 6}px`, top: `${TABLE_TOP}px`, width: '12px', cursor: 'col-resize', zIndex: 32 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={onDragStart}
        onClick={onSelect}
      >
        {/* Visual line — centered in the 12px hit area, full table height */}
        <div
          className="absolute top-0 bottom-0 pointer-events-none transition-[width] duration-[120ms]"
          style={{
            left: '50%',
            transform: 'translateX(-50%)',
            width: `${lineWidth}px`,
            ...(lineSolid
              ? { backgroundColor: '#F0AB00' }
              : { borderLeft: '2px dashed rgba(240,171,0,0.8)' }),
          }}
        />

        {/* Drag handle — centered on the table height */}
        {(variant === 'hover' || variant === 'drag') && (
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none text-[#888E8E]"
            style={{ fontSize: '14px', lineHeight: 1 }}
          >
            ⠿
          </div>
        )}
      </div>

      {/* Delete button — visible whenever selected; tooltip shown on hover */}
      {isSelected && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="absolute flex items-center justify-center bg-white border border-[#D8DADA] rounded-full hover:border-[#F0AB00] transition-colors active:scale-[0.96] transition-transform"
              style={{
                left: `${dragGapX}px`,
                top: `${TABLE_TOP - 22}px`,
                transform: 'translateX(-50%)',
                width: '16px',
                height: '16px',
                zIndex: 40,
              }}
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              aria-label="Remove page break"
            >
              <span className="text-[#3C4242] leading-none select-none" style={{ fontSize: '10px' }}>×</span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={4} className="bg-[#3C4242] text-[#F8F7F7] text-[12px] rounded-[4px] px-[6px] py-[4px] font-normal border-0">
            Remove page break
          </TooltipContent>
        </Tooltip>
      )}

      {/* Pill label — hidden when selected; replaced by the delete button */}
      {!isSelected && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${dragGapX}px`,
            top: `${PILL_BOTTOM_Y}px`,
            transform: 'translateX(-50%) translateY(-100%)',
            zIndex: 36,
          }}
        >
          <div
            className="font-['PingFang_SC:Regular',sans-serif] text-[10px] leading-[14px] whitespace-nowrap rounded-[3px]"
            style={{
              background: '#FCEECC',
              color: '#3C4242',
              padding: '1px 6px',
              border: '1px solid transparent',
            }}
          >
            {label}
          </div>
        </div>
      )}
    </>
  );
}

// ─── FreezeDivider ────────────────────────────────────────────────────────────
interface FreezeDividerProps {
  columnIndex: number;
  columnX: number;
  columnLabel: string;
  isDragging: boolean;
  dragColumnX: number;
  onRemove: () => void;
  onDragStart: (e: React.MouseEvent) => void;
}

function FreezeDivider({
  columnIndex,
  columnX,
  columnLabel,
  isDragging,
  dragColumnX,
  onRemove,
  onDragStart,
}: FreezeDividerProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {/* Ghost — original position while dragging */}
      {isDragging && (
        <div
          className="absolute bottom-0 pointer-events-none"
          style={{ 
            left: `${columnX}px`, 
            top: `${TABLE_TOP}px`, 
            width: '2px', 
            backgroundColor: 'rgba(131,0,81,0.2)', 
            zIndex: 28 
          }}
        />
      )}

      {/* Hit area for dragging — on the freeze line itself */}
      <div
        className="absolute bottom-0"
        style={{ 
          left: `${dragColumnX - 6}px`, 
          top: `${TABLE_TOP}px`, 
          width: '12px', 
          cursor: 'col-resize', 
          zIndex: 33 
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={onDragStart}
      >
        {/* Visual line — purple freeze line */}
        <div
          className="absolute top-0 bottom-0 pointer-events-none"
          style={{
            left: '50%',
            transform: 'translateX(-50%)',
            width: '2px',
            backgroundColor: '#830051',
          }}
        />

        {/* Drag handle — shown on hover */}
        {isHovered && (
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none text-[#888E8E]"
            style={{ fontSize: '14px', lineHeight: 1 }}
          >
            ⠿
          </div>
        )}
      </div>

      {/* Label pill with delete button */}
      <div
        className="absolute pointer-events-auto"
        style={{
          left: `${dragColumnX}px`,
          top: `${PILL_BOTTOM_Y}px`,
          transform: 'translateX(-50%) translateY(-100%)',
          zIndex: 36,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={onDragStart}
      >
        <div
          className="flex items-center gap-[2px] rounded-[4px] px-[6px] py-[2px] cursor-col-resize"
          style={{
            background: '#f4e8ee',
            color: '#3C4242',
          }}
        >
          <span className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] whitespace-nowrap">
            {columnLabel} Frozen
          </span>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="overflow-clip rounded-[4px] size-[20px] flex items-center justify-center hover:bg-black/10 transition-colors"
                onClick={(e) => { 
                  e.stopPropagation(); 
                  e.preventDefault();
                  onRemove(); 
                }}
                aria-label="Remove freeze"
              >
                <svg className="size-[13.33px]" viewBox="0 0 7.07109 7.07104" fill="none">
                  <path d="M0 0.706011L0.706011 0L3.53555 2.82954L6.36509 0L7.0711 0.706011L4.24156 3.53555L7.0711 6.36509L6.36509 7.0711L3.53555 4.24156L0.706011 7.0711L0 6.36509L2.82954 3.53555L0 0.706011Z" fill="#888E8E"/>
                </svg>
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={4} className="bg-[#3C4242] text-[#F8F7F7] text-[12px] rounded-[4px] px-[6px] py-[4px] font-normal border-0">
              Remove freeze
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </>
  );
}
// ─── Figure Shell Placeholder ─────────────────────────────────────────────────
function FigureShellContent({ selectedItem: _ }: { selectedItem: string | null }) {
  return (
    <div className="flex-1 h-full overflow-hidden">
      {/* KM Plot placeholder */}
      <div className="h-full overflow-auto bg-white p-[16px]">
        <div className="bg-white text-black" style={{ minWidth: '900px' }}>
          {/* Title area */}
          <div className="relative h-[62px] w-[900px] text-center">
            <p className="absolute font-['Inter',sans-serif] font-bold text-[#333] text-[13px] top-[14px] left-0 right-0">[Figure Title]</p>
            <p className="absolute font-['Inter',sans-serif] font-normal text-[#888] text-[11px] top-[32px] left-0 right-0">Figure X.X</p>
          </div>

          {/* Plot area */}
          <div className="relative" style={{ height: '480px', width: '900px' }}>
            {/* Y axis */}
            <div className="absolute bg-[#ccc] w-px" style={{ left: '60px', top: '70px', height: '340px' }} />
            {/* X axis */}
            <div className="absolute bg-[#ccc] h-px" style={{ left: '60px', top: '410px', width: '800px' }} />

            {/* KM Curves SVG */}
            <svg className="absolute" fill="none" height="340" viewBox="0 0 800 340" width="800" style={{ left: '60px', top: '70px' }}>
              <path d={svgFigurePaths.p527f8c0} stroke="#9A3374" strokeWidth="2" />
              <path d={svgFigurePaths.p2d371000} stroke="#F3BC33" strokeWidth="2" />
            </svg>

            {/* Legend */}
            <div className="absolute" style={{ left: '740px', top: '82px' }}>
              <div className="flex items-center gap-[6px] mb-[10px]">
                <div className="bg-[#9a3374] h-[2px] w-[16px]" />
                <p className="font-['Inter',sans-serif] text-[#333] text-[10px]">Group A</p>
              </div>
              <div className="flex items-center gap-[6px]">
                <div className="bg-[#f3bc33] h-[2px] w-[16px]" />
                <p className="font-['Inter',sans-serif] text-[#333] text-[10px]">Group B</p>
              </div>
            </div>

            {/* Y axis label */}
            <div className="absolute flex items-center justify-center" style={{ left: '-10px', top: '180px', width: '13px', height: '100px' }}>
              <div className="-rotate-90 whitespace-nowrap">
                <p className="font-['Inter',sans-serif] text-[#333] text-[11px]">Survival Probability</p>
              </div>
            </div>

            {/* X axis ticks */}
            {[0, 17, 33, 50, 66, 83, 99].map((val, i) => {
              const x = 60 + (i / 6) * 800;
              return (
                <div key={val}>
                  <div className="absolute bg-[#ccc] h-[4px] w-px" style={{ left: `${x}px`, top: '414px' }} />
                  <p className="absolute font-['Inter',sans-serif] text-[#666] text-[9px]" style={{ left: `${x - 5}px`, top: '422px' }}>{val}</p>
                </div>
              );
            })}

            {/* X axis label */}
            <p className="absolute font-['Inter',sans-serif] text-[#333] text-[11px]" style={{ left: '390px', top: '436px' }}>Time (Months)</p>

            {/* Y axis ticks */}
            {['0%', '20%', '40%', '60%', '80%', '100%'].map((label, i) => {
              const y = 70 + (1 - i / 5) * 340;
              return (
                <div key={label}>
                  <div className="absolute bg-[#ccc] w-[5px] h-px" style={{ left: '55px', top: `${y}px` }} />
                  <p className="absolute font-['Inter',sans-serif] text-[#666] text-[9px] text-right" style={{ right: `${900 - 54}px`, top: `${y - 6}px`, width: '48px' }}>{label}</p>
                </div>
              );
            })}
          </div>

          {/* Risk table */}
          <div className="relative" style={{ height: '88px', width: '900px' }}>
            <div className="absolute bg-[#ccc] h-px" style={{ left: '60px', top: '0', width: '800px' }} />
            <p className="absolute font-['Inter',sans-serif] font-bold text-[#333] text-[9px] text-right" style={{ left: '0', width: '56px', top: '8px' }}>Number at risk</p>
            {/* Group A */}
            <p className="absolute font-['Inter',sans-serif] text-[#9a3374] text-[9px] text-right" style={{ left: '0', width: '56px', top: '38px' }}>Group A</p>
            {[50, 39, 32, 21, 16, 11, 10].map((n, i) => (
              <p key={i} className="absolute font-['Inter',sans-serif] text-[#9a3374] text-[9px] text-center tabular-nums" style={{ left: `${60 + (i / 6) * 800 - 10}px`, width: '20px', top: '38px' }}>{n}</p>
            ))}
            {/* Group B */}
            <p className="absolute font-['Inter',sans-serif] text-[#f3bc33] text-[9px] text-right" style={{ left: '0', width: '56px', top: '66px' }}>Group B</p>
            {[45, 30, 28, 24, 20, 17, 14].map((n, i) => (
              <p key={i} className="absolute font-['Inter',sans-serif] text-[#f3bc33] text-[9px] text-center tabular-nums" style={{ left: `${60 + (i / 6) * 800 - 10}px`, width: '20px', top: '66px' }}>{n}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────

export default function ShellPreview({
  selectedItem,
  selectedItemType,
  onBlockClick,
  onMetadataClick,
  metadataOpen,
  onCloseMetadata,
  isLocked,
  onPagePreviewChange,
}: ShellPreviewProps) {
  const [metadataWidth, setMetadataWidth] = useState(320);
  const [pageSepActive, setPageSepActive] = useState(false);
  const [frozenUntilIndex, setFrozenUntilIndex] = useState<number | null>(null);
  const [idpageBaseline, setIdpageBaseline] = useState<{ frozenUntilIndex: number | null; pageSepActive: boolean; pageColumnCounts: Record<string, number> } | null>(() => {
    try {
      const raw = sessionStorage.getItem('metadataIdpageBaseline');
      return raw ? JSON.parse(raw) : { frozenUntilIndex: null, pageSepActive: false, pageColumnCounts: {} };
    } catch {
      return { frozenUntilIndex: null, pageSepActive: false, pageColumnCounts: {} };
    }
  });
  const [idlistBaseline, setIdlistBaseline] = useState<{ frozenUntilIndex: number | null; pageSepActive: boolean; pageColumnCounts: Record<string, number> } | null>(() => {
    try {
      const raw = sessionStorage.getItem('metadataIdlistBaseline');
      return raw ? JSON.parse(raw) : { frozenUntilIndex: null, pageSepActive: false, pageColumnCounts: {} };
    } catch {
      return { frozenUntilIndex: null, pageSepActive: false, pageColumnCounts: {} };
    }
  });
  const [metadataPending, setMetadataPending] = useState(false);
  const [pageScale, setPageScale] = useState(100);
  const [pageColumnCounts, setPageColumnCounts] = useState<Record<string, number>>({});
  const [selectedPrintPageIndex, setSelectedPrintPageIndex] = useState(0);
  const [pageSelectionDraft, setPageSelectionDraft] = useState('1');
  const [hoveredGap, setHoveredGap] = useState<number | null>(null);
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);
  const [pageBreakColumns, setPageBreakColumns] = useState<number[]>([]);
  const [selectedPageBreak, setSelectedPageBreak] = useState<number | null>(null);
  const [draggingBreak, setDraggingBreak] = useState<{ colIdx: number; currentGap: number } | null>(null);
  const [draggingFreeze, setDraggingFreeze] = useState<{ originalIdx: number; currentIdx: number } | null>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const thRefs = useRef<Array<HTMLTableCellElement | null>>([]);
  const gapXPositionsRef = useRef<number[]>([]);
  const [gapXPositions, setGapXPositions] = useState<number[]>([]);
  const columnXPositionsRef = useRef<number[]>([]);
  const [columnXPositions, setColumnXPositions] = useState<number[]>([]);

  // Measure actual rendered column right-edges and column right edges relative to the table container.
  // Called once on mount and whenever the container resizes (handles zoom/layout changes).
  useEffect(() => {
    const measure = () => {
      const container = tableContainerRef.current;
      if (!container) return;
      const containerLeft = container.getBoundingClientRect().left;
      
      // Gap positions (right edge of each column except last)
      const gapPositions = Array.from({ length: columns.length - 1 }, (_, i) => {
        const th = thRefs.current[i];
        if (!th) return 0;
        return th.getBoundingClientRect().right - containerLeft;
      });
      gapXPositionsRef.current = gapPositions;
      setGapXPositions(gapPositions);

      // Column positions (right edge of each column for freeze line)
      const colPositions = Array.from({ length: columns.length }, (_, i) => {
        const th = thRefs.current[i];
        if (!th) return 0;
        return th.getBoundingClientRect().right - containerLeft;
      });
      columnXPositionsRef.current = colPositions;
      setColumnXPositions(colPositions);
    };
    measure();
    const container = tableContainerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, []); // ResizeObserver handles all layout changes

  // Rule 3 + 4: when freeze expands and would overlap a page break, push it right.
  useEffect(() => {
    if (frozenUntilIndex === null) return;
    setPageBreakColumns(prev => {
      const frozen = prev.filter(c => c <= frozenUntilIndex).sort((a, b) => a - b);
      if (frozen.length === 0) return prev;
      // Occupied gaps that must not be reused
      const occupied = new Set(prev.filter(c => c > frozenUntilIndex));
      const pushed: number[] = [];
      for (const _ of frozen) {
        let slot = frozenUntilIndex + 1;
        while ((occupied.has(slot) || pushed.includes(slot)) && slot < columns.length - 1) slot++;
        if (slot <= columns.length - 2) pushed.push(slot);
      }
      return [...occupied, ...pushed].sort((a, b) => a - b);
    });
  }, [frozenUntilIndex]);

  const previousPageSepActiveRef = useRef(pageSepActive);
  const savedPrintPageIndexRef = useRef(0);
  const pageCardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const pagePreviewScrollRef = useRef<HTMLDivElement>(null);
  const suppressPageSyncRef = useRef(false);
  const suppressPageSyncTimerRef = useRef<number | null>(null);

  const handleMetadataDividerDrag = (delta: number) => {
    setMetadataWidth(prev =>
      Math.max(METADATA_MIN, Math.min(METADATA_MAX, prev - delta))
    );
  };

  // Recalculate red-dot pending state whenever relevant state changes
  useEffect(() => {
    const load = <T,>(key: string, fallback: T): T => {
      try {
        const raw = sessionStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : fallback;
      } catch {
        return fallback;
      }
    };

    const blocks = load<{ fields: { status: string }[] }[]>('metadataBlocks', []);
    const blockFields = load<{ status: string }[]>('metadataBlockFields', []);
    const groupStatus = load<string>('metadataGroupStatus', 'unconfirmed');

    const hasEditedField =
      groupStatus === 'edited' ||
      blocks.some(b => b.fields.some(f => f.status === 'edited')) ||
      blockFields.some(f => f.status === 'edited');

    const areColumnCountsEqual = (a: Record<string, number>, b: Record<string, number>) => {
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);
      if (keysA.length !== keysB.length) return false;
      return keysA.every(key => a[key] === b[key]);
    };

    const idpagePending = idpageBaseline !== null && (
      idpageBaseline.frozenUntilIndex !== frozenUntilIndex ||
      idpageBaseline.pageSepActive !== pageSepActive ||
      !areColumnCountsEqual(idpageBaseline.pageColumnCounts, pageColumnCounts)
    );

    const idlistPending = idlistBaseline !== null && (
      idlistBaseline.frozenUntilIndex !== frozenUntilIndex ||
      idlistBaseline.pageSepActive !== pageSepActive ||
      !areColumnCountsEqual(idlistBaseline.pageColumnCounts, pageColumnCounts)
    );

    setMetadataPending(hasEditedField || idpagePending || idlistPending);
  }, [
    metadataOpen, // trigger on panel open/close
    frozenUntilIndex, pageSepActive, pageColumnCounts,
    idpageBaseline, idlistBaseline,
  ]);

  useEffect(() => {
    if (previousPageSepActiveRef.current === pageSepActive) return;
    previousPageSepActiveRef.current = pageSepActive;
    onPagePreviewChange?.(pageSepActive);
  }, [pageSepActive, onPagePreviewChange]);

  useEffect(() => {
    sessionStorage.setItem('metadataIdpageBaseline', JSON.stringify(idpageBaseline));
  }, [idpageBaseline]);

  useEffect(() => {
    sessionStorage.setItem('metadataIdlistBaseline', JSON.stringify(idlistBaseline));
  }, [idlistBaseline]);

  const handlePagePreviewToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (metadataOpen) {
      onCloseMetadata();
    }
    setPageSepActive(current => !current);
  };

  const getFrozenLeft = (columnIndex: number) =>
    columns.slice(0, columnIndex).reduce((sum, column) => sum + column.widthPx, 0);

  const isColumnFrozen = (columnIndex: number) =>
    frozenUntilIndex !== null && columnIndex <= frozenUntilIndex;

  const getGapX = (afterColumnIndex: number) =>
    columns.slice(0, afterColumnIndex + 1).reduce((sum, col) => sum + col.widthPx, 0);

  const isGapInteractive = (afterColumnIndex: number) =>
    frozenUntilIndex === null || afterColumnIndex > frozenUntilIndex;

  const addPageBreak = (afterColumnIndex: number) => {
    setPageBreakColumns(prev =>
      prev.includes(afterColumnIndex) ? prev : [...prev, afterColumnIndex]
    );
  };

  const handlePageBreakDragStart = (colIdx: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const containerEl = tableContainerRef.current;
    if (!containerEl) return;

    const frozenSnapshot = frozenUntilIndex;
    setDraggingBreak({ colIdx, currentGap: colIdx });

    const snapToNearest = (mouseX: number): number => {
      let nearest = colIdx;
      let minDist = Infinity;
      for (let i = 0; i < columns.length - 1; i++) {
        if (frozenSnapshot !== null && i <= frozenSnapshot) continue;
        const gx = gapXPositionsRef.current[i] ?? columns.slice(0, i + 1).reduce((s, c) => s + c.widthPx, 0);
        const dist = Math.abs(mouseX - gx);
        if (dist < minDist) { minDist = dist; nearest = i; }
      }
      return nearest;
    };

    const onMove = (ev: MouseEvent) => {
      const rect = containerEl.getBoundingClientRect();
      const nearest = snapToNearest(ev.clientX - rect.left);
      setDraggingBreak(prev => prev ? { ...prev, currentGap: nearest } : null);
    };

    const onUp = () => {
      setDraggingBreak(prev => {
        if (!prev) return null;
        setPageBreakColumns(old => {
          const without = old.filter(c => c !== prev.colIdx);
          if (without.includes(prev.currentGap)) return without;
          return [...without, prev.currentGap].sort((a, b) => a - b);
        });
        return null;
      });
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.body.style.cursor = '';
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.body.style.cursor = 'col-resize';
  };

  const handleFreezeDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const containerEl = tableContainerRef.current;
    if (!containerEl || frozenUntilIndex === null) return;

    setDraggingFreeze({ originalIdx: frozenUntilIndex, currentIdx: frozenUntilIndex });

    const snapToNearestColumn = (mouseX: number): number => {
      let nearest = frozenUntilIndex ?? 0;
      let minDist = Infinity;
      for (let i = 0; i < columns.length; i++) {
        const cx = columnXPositionsRef.current[i] ?? columns.slice(0, i + 1).reduce((s, c) => s + c.widthPx, 0);
        const dist = Math.abs(mouseX - cx);
        if (dist < minDist) { minDist = dist; nearest = i; }
      }
      return nearest;
    };

    const onMove = (ev: MouseEvent) => {
      const rect = containerEl.getBoundingClientRect();
      const nearest = snapToNearestColumn(ev.clientX - rect.left);
      setDraggingFreeze(prev => prev ? { ...prev, currentIdx: nearest } : null);
    };

    const onUp = () => {
      setDraggingFreeze(prev => {
        if (!prev) return null;
        setFrozenUntilIndex(prev.currentIdx);
        return null;
      });
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.body.style.cursor = '';
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.body.style.cursor = 'col-resize';
  };

  const pageWidthPx = A4_LANDSCAPE_WIDTH_PX;
  const pageHeightPx = A4_LANDSCAPE_HEIGHT_PX;
  const printableWidthPx = pageWidthPx - A4_HORIZONTAL_PADDING_PX;

  const printRowPages = Array.from(
    { length: Math.ceil(rows.length / PRINT_ROWS_PER_PAGE) },
    (_, pageIndex) => rows.slice(pageIndex * PRINT_ROWS_PER_PAGE, (pageIndex + 1) * PRINT_ROWS_PER_PAGE)
  );

  const frozenPrintColumns = columns.filter((_, columnIndex) => isColumnFrozen(columnIndex));
  const scrollPrintColumns = columns.filter((_, columnIndex) => !isColumnFrozen(columnIndex));
  const frozenColumnCount = frozenPrintColumns.length;
  const minColumnsPerPage = Math.min(columns.length, frozenColumnCount + 1);
  const maxColumnsPerPage = columns.length;
  const frozenPrintWidth = frozenPrintColumns.reduce((sum, column) => sum + column.widthPx, 0);
  const availableScrollPrintWidth = Math.max(120, printableWidthPx - frozenPrintWidth);

  const autoColumnPageTotals = useMemo(() => {
    if (scrollPrintColumns.length === 0) {
      return [frozenPrintColumns.length > 0 ? frozenPrintColumns.length : columns.length];
    }

    const autoPages: number[] = [];
    let currentWidth = 0;
    let currentScrollColumns = 0;

    scrollPrintColumns.forEach((column) => {
      const nextWidth = currentWidth + column.widthPx;
      if (currentScrollColumns > 0 && nextWidth > availableScrollPrintWidth) {
        autoPages.push(frozenPrintColumns.length + currentScrollColumns);
        currentScrollColumns = 0;
        currentWidth = 0;
      }

      currentScrollColumns += 1;
      currentWidth += column.widthPx;
    });

    if (currentScrollColumns > 0) {
      autoPages.push(frozenPrintColumns.length + currentScrollColumns);
    }

    return autoPages;
  }, [availableScrollPrintWidth, columns.length, frozenPrintColumns.length, scrollPrintColumns]);

  const printPages = useMemo(() => {
    const pages: Array<{
      id: string;
      pageRows: typeof rows;
      pageColumns: typeof columns[number][];
      pageScrollColumns: typeof columns[number][];
      rowPageIndex: number;
      columnPageIndex: number;
    }> = [];

    printRowPages.forEach((pageRows, rowPageIndex) => {
      if (scrollPrintColumns.length === 0) {
        const pageColumns = frozenPrintColumns.length > 0 ? [...frozenPrintColumns] : [...columns];
        pages.push({
          id: `${rowPageIndex}-0`,
          pageRows,
          pageColumns,
          pageScrollColumns: pageColumns.filter((pageColumn) => !frozenPrintColumns.some((frozenColumn) => frozenColumn.key === pageColumn.key)),
          rowPageIndex,
          columnPageIndex: 0,
        });
        return;
      }

      let remainingScrollColumns = [...scrollPrintColumns];
      let columnPageIndex = 0;

      while (remainingScrollColumns.length > 0) {
        const pageKey = `${rowPageIndex}-${columnPageIndex}`;
        const defaultTotalColumns = autoColumnPageTotals[columnPageIndex] ?? (frozenPrintColumns.length + remainingScrollColumns.length);
        const configuredTotalColumns = pageColumnCounts[pageKey] ?? defaultTotalColumns;
        const normalizedTotalColumns = Math.max(minColumnsPerPage, Math.min(maxColumnsPerPage, configuredTotalColumns));
        const scrollColumnCount = Math.max(1, Math.min(normalizedTotalColumns - frozenPrintColumns.length, remainingScrollColumns.length));
        const pageScrollColumns = remainingScrollColumns.slice(0, scrollColumnCount);
        const pageColumns = [...frozenPrintColumns, ...pageScrollColumns];

        pages.push({
          id: pageKey,
          pageRows,
          pageColumns,
          pageScrollColumns,
          rowPageIndex,
          columnPageIndex,
        });

        remainingScrollColumns = remainingScrollColumns.slice(scrollColumnCount);
        columnPageIndex += 1;
      }
    });

    return pages;
  }, [autoColumnPageTotals, columns, frozenPrintColumns, maxColumnsPerPage, minColumnsPerPage, pageColumnCounts, printRowPages, scrollPrintColumns]);

  useEffect(() => {
    setSelectedPrintPageIndex((current) => Math.min(current, Math.max(printPages.length - 1, 0)));
  }, [printPages.length]);

  useEffect(() => {
    setPageSelectionDraft(String(selectedPrintPageIndex + 1));
  }, [selectedPrintPageIndex]);

  useEffect(() => {
    if (pageSepActive) {
      setSelectedPrintPageIndex(savedPrintPageIndexRef.current);
    } else {
      savedPrintPageIndexRef.current = selectedPrintPageIndex;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSepActive]);

  const selectedPrintPage = printPages[selectedPrintPageIndex] ?? printPages[0] ?? null;

  useEffect(() => {
    if (!pageSepActive) return;
    if (suppressPageSyncRef.current) return;

    const scrollContainer = pagePreviewScrollRef.current;
    if (!scrollContainer) return;

    let frameId = 0;

    const syncCurrentPageFromScroll = () => {
      const containerRect = scrollContainer.getBoundingClientRect();
      const viewportCenter = containerRect.top + containerRect.height / 2;

      let nearestPageIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      printPages.forEach((page, pageIndex) => {
        const pageElement = pageCardRefs.current[page.id];
        if (!pageElement) return;

        const pageRect = pageElement.getBoundingClientRect();
        const pageCenter = pageRect.top + pageRect.height / 2;
        const distance = Math.abs(pageCenter - viewportCenter);

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestPageIndex = pageIndex;
        }
      });

      setSelectedPrintPageIndex((current) => (current === nearestPageIndex ? current : nearestPageIndex));
    };

    const handleScroll = () => {
      cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(syncCurrentPageFromScroll);
    };

    syncCurrentPageFromScroll();
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frameId);
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [pageSepActive, printPages]);

  const selectedPageColumnTotal = selectedPrintPage
    ? Math.max(minColumnsPerPage, Math.min(maxColumnsPerPage, pageColumnCounts[selectedPrintPage.id] ?? selectedPrintPage.pageColumns.length))
    : minColumnsPerPage;

  const selectedPageRowRange = selectedPrintPage
    ? {
        start: selectedPrintPage.rowPageIndex * PRINT_ROWS_PER_PAGE + 1,
        end: selectedPrintPage.rowPageIndex * PRINT_ROWS_PER_PAGE + selectedPrintPage.pageRows.length,
      }
    : { start: 1, end: PRINT_ROWS_PER_PAGE };

  const updateSelectedPageColumnTotal = (nextTotalColumns: number) => {
    if (!selectedPrintPage) return;
    const normalizedTotalColumns = Math.max(minColumnsPerPage, Math.min(maxColumnsPerPage, nextTotalColumns));
    setPageColumnCounts((prev) => ({
      ...prev,
      [selectedPrintPage.id]: normalizedTotalColumns,
    }));
  };

  const handlePageSelectionChange = (nextPageIndex: number) => {
    const nextPage = printPages[nextPageIndex];
    if (!nextPage) return;

    suppressPageSyncRef.current = true;
    if (suppressPageSyncTimerRef.current !== null) {
      window.clearTimeout(suppressPageSyncTimerRef.current);
    }
    setSelectedPrintPageIndex(nextPageIndex);
    const pageElement = pageCardRefs.current[nextPage.id];

    pageElement?.scrollIntoView({ block: 'start', behavior: 'auto' });

    suppressPageSyncTimerRef.current = window.setTimeout(() => {
      suppressPageSyncRef.current = false;
      suppressPageSyncTimerRef.current = null;
    }, 300);
  };

  const handlePageSelectionByNumber = (nextPageNumber: number) => {
    const normalizedPageNumber = Math.max(1, Math.min(printPages.length, nextPageNumber));
    handlePageSelectionChange(normalizedPageNumber - 1);
  };

  const commitPageSelectionDraft = () => {
    const nextValue = Number(pageSelectionDraft);
    if (Number.isNaN(nextValue)) {
      setPageSelectionDraft(String(selectedPrintPageIndex + 1));
      return;
    }

    handlePageSelectionByNumber(nextValue);
  };

  // Figure type: simplified layout with chart placeholder + figure metadata panel
  if (selectedItemType === 'figure') {
    return (
      <div className="h-full bg-white flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white h-[40px] shrink-0 w-full flex items-center justify-between px-[12px]">
          <p className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] text-black">
            {selectedItem || 'Figure name'}
          </p>
          {/* Metadata button */}
          <button
            type="button"
            onClick={onMetadataClick}
            className={`relative size-[24px] flex items-center justify-center rounded-[4px] transition-colors duration-[180ms] active:scale-[0.96] ${
              metadataOpen ? 'bg-[#f4e8ee]' : 'hover:bg-black/5'
            }`}
            aria-label="Toggle metadata"
          >
            <FileText className={`size-4 ${metadataOpen ? 'text-[#830051]' : 'text-[#888E8E]'}`} />
          </button>
        </div>

        {/* Content row: figure chart + metadata overlay */}
        <div className="flex flex-1 overflow-hidden relative">
          <FigureShellContent selectedItem={selectedItem} />

          {/* Figure Metadata overlay */}
          {metadataOpen && (
            <>
              <Divider onDrag={handleMetadataDividerDrag} />
              <div
                className="shrink-0 h-full overflow-hidden bg-white pt-[4px] pb-[8px] pl-[4px] pr-[8px]"
                style={{ width: `${metadataWidth}px` }}
              >
                <FigureMetadataPanel onClose={onCloseMetadata} />
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Full-screen Print Preview Portal */}
      {pageSepActive && createPortal(
        <div className="fixed inset-0 z-[9999] flex flex-col overflow-hidden bg-[#f2f3f3]">
          {/* Top Bar */}
          <div className="z-[70] h-[44px] shrink-0 border-b border-[#d8dada] bg-white flex items-center justify-between px-[16px] shadow-[0px_1px_4px_rgba(0,0,0,0.04)]">
            <p className="font-['PingFang_SC:Regular',sans-serif] text-[14px] leading-[20px] text-black">
              {selectedItem || 'Shell preview'}
            </p>
            <button
              type="button"
              onClick={handlePagePreviewToggle}
              className="flex items-center gap-[6px] rounded-[4px] px-[8px] py-[4px] text-[#888E8E] hover:bg-black/5 transition-colors duration-[180ms] active:scale-[0.96]"
              aria-label="Exit page preview"
            >
              <span className="font-['PingFang_SC:Regular',sans-serif] text-[13px] leading-[20px]">
                Exit Preview
              </span>
              <svg className="size-[16px]" viewBox="0 0 16 16" fill="none">
                <path d="M12.6667 4.27331L11.7267 3.33331L8.00001 7.05998L4.27334 3.33331L3.33334 4.27331L7.06001 7.99998L3.33334 11.7266L4.27334 12.6666L8.00001 8.93998L11.7267 12.6666L12.6667 11.7266L8.94001 7.99998L12.6667 4.27331Z" fill="currentColor"/>
              </svg>
            </button>
          </div>

          <div ref={pagePreviewScrollRef} className="flex-1 overflow-auto p-[24px] flex flex-col items-center gap-[18px]">
            {printPages.map((page, pageIndex) => (
              <div
                key={page.id}
                ref={(node) => {
                  pageCardRefs.current[page.id] = node;
                }}
                onClick={() => handlePageSelectionChange(pageIndex)}
                className={`relative overflow-hidden bg-white shadow-[0px_10px_30px_rgba(32,37,37,0.12)] border border-[#cfd2d2] transition-shadow duration-[180ms] cursor-pointer ${selectedPrintPageIndex === pageIndex ? 'ring-2 ring-[#830051]/35' : ''}`}
                style={{ width: `${pageWidthPx}px`, minHeight: `${pageHeightPx}px` }}
              >
                <div style={{ transform: `scale(${pageScale / 100})`, transformOrigin: 'top left' }} className="relative">
                  {/* Page number tag - Tag mini style without icon */}
                  <div className="absolute right-[32px] top-[28px] bg-[#f4e8ee] flex items-center justify-center px-[6px] rounded-[4px]">
                    <p className="font-['PingFang_SC:Regular',sans-serif] text-[13px] leading-[20px] text-[#830051] whitespace-nowrap">
                      {pageIndex + 1}/{printPages.length}
                    </p>
                  </div>
                  <div className="p-[48px] pt-[64px]">
                    <div className="border-b-2 border-black pb-[14px] mb-[10px] text-center">
                      <h1 className="font-['Inter',sans-serif] text-[13px] leading-[18px] font-bold tracking-[-0.01em]">
                        Appendix 16.2.4 Demographic and baseline characteristics (ITT analysis set)
                      </h1>
                      <p className="mt-[4px] font-['Inter',sans-serif] text-[10px] leading-[14px] text-[#6f7676]">
                        Rows {page.rowPageIndex * PRINT_ROWS_PER_PAGE + 1}-{page.rowPageIndex * PRINT_ROWS_PER_PAGE + page.pageRows.length} · Columns {page.pageScrollColumns[0] ? columns.findIndex(column => column.key === page.pageScrollColumns[0].key) + 1 : 1}-{page.pageScrollColumns.length ? columns.findIndex(column => column.key === page.pageScrollColumns[page.pageScrollColumns.length - 1].key) + 1 : frozenPrintColumns.length}{frozenPrintColumns.length > 0 ? ` · frozen 1-${frozenPrintColumns.length} repeated` : ''}
                      </p>
                    </div>

                    <table className="w-full table-fixed border-collapse font-['Inter',sans-serif] text-black">
                      <colgroup>
                        {page.pageColumns.map((column) => (
                          <col key={column.key} style={{ width: `${(column.widthPx / page.pageColumns.reduce((sum, item) => sum + item.widthPx, 0)) * 100}%` }} />
                        ))}
                      </colgroup>
                      <thead>
                        <tr className="border-b-2 border-black">
                          {page.pageColumns.map((column) => (
                            <th key={column.key} className="border-r border-[#d9d9d9] px-[4px] py-[6px] text-left align-middle text-[10px] leading-[14px] font-bold whitespace-normal break-words last:border-r-0">
                              {column.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {page.pageRows.map((row) => (
                          <tr key={row.subject} className="border-b border-[#d9d9d9] last:border-b-2 last:border-black">
                            {page.pageColumns.map((column) => (
                              <td key={`${row.subject}-${column.key}`} className="border-r border-[#d9d9d9] px-[4px] py-[6px] align-middle text-[10px] leading-[15px] font-normal whitespace-normal break-words last:border-r-0">
                                {row[column.key]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>,
        document.body
      )}

      <div className="h-full bg-white flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white h-[40px] shrink-0 w-full flex items-center justify-between px-[12px]">
          <p className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] text-black font-[Inter]">
            {selectedItem || 'Shell preview'}
          </p>
          <div className="flex items-center gap-[10px]">
            <div className="flex items-center gap-[8px]">
            {/* Page separator button */}
            <button
              type="button"
              onClick={handlePagePreviewToggle}
              className={`h-[24px] flex items-center justify-center gap-[4px] rounded-[4px] px-[4px] transition-colors duration-[180ms] active:scale-[0.96] ${
                pageSepActive ? 'bg-[#f4e8ee] text-[#830051]' : 'text-[#888E8E] hover:bg-black/5'
              }`}
              aria-label={pageSepActive ? 'Exit page preview' : 'Enter page preview'}
              aria-pressed={pageSepActive}
              title={pageSepActive ? 'Exit Preview' : 'Preview'}
            >
              <span className="[word-break:break-word] font-['PingFang_SC:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[12px] whitespace-nowrap">
                Preview
              </span>
              <span className="relative shrink-0 size-[16px]" data-name="page-separator">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                  <g id="page-separator">
                    <path d="M11.3333 14V11.3333H4.66667V14H3.33333V10.6667C3.33333 10.2985 3.63181 10 4 10H12C12.3682 10 12.6667 10.2985 12.6667 10.6667V14H11.3333ZM4.66667 2V4.66667H11.3333V2H12.6667V5.33333C12.6667 5.70152 12.3682 6 12 6H4C3.63181 6 3.33333 5.70152 3.33333 5.33333V2H4.66667ZM1.33333 6L4 8L1.33333 10V6ZM14.6667 6V10L12 8L14.6667 6Z" fill="currentColor" id="Vector" />
                  </g>
                </svg>
              </span>
            </button>

            {/* Metadata button */}
            <button
              type="button"
              disabled={pageSepActive}
              onClick={(event) => {
                if (pageSepActive) {
                  event.preventDefault();
                  return;
                }
                onMetadataClick();
              }}
              className={`relative size-[24px] flex items-center justify-center rounded-[4px] transition-colors duration-[180ms] active:scale-[0.96] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 ${
              pageSepActive ? 'text-[#c4c8c8]' : metadataOpen ? 'bg-[#f4e8ee]' : 'hover:bg-black/5'
            }`}
              aria-label="Toggle metadata"
              aria-disabled={pageSepActive}
              title={pageSepActive ? '分页预览模式下不可用' : 'Toggle metadata'}
            >
              <FileText className={`size-4 ${pageSepActive ? 'text-[#c4c8c8]' : metadataOpen ? 'text-[#830051]' : 'text-[#888E8E]'}`} />
              {metadataPending && (!pageSepActive || (() => {
                const areColumnCountsEqual = (a: Record<string, number>, b: Record<string, number>) => {
                  const keysA = Object.keys(a);
                  const keysB = Object.keys(b);
                  if (keysA.length !== keysB.length) return false;
                  return keysA.every(key => a[key] === b[key]);
                };

                const load = <T,>(key: string, fallback: T): T => {
                  try {
                    const raw = sessionStorage.getItem(key);
                    return raw ? (JSON.parse(raw) as T) : fallback;
                  } catch {
                    return fallback;
                  }
                };

                const blocks = load<{ fields: { status: string }[] }[]>('metadataBlocks', []);
                const blockFields = load<{ status: string }[]>('metadataBlockFields', []);
                const groupStatus = load<string>('metadataGroupStatus', 'unconfirmed');
                const hasEditedField =
                  groupStatus === 'edited' ||
                  blocks.some(b => b.fields.some(f => f.status === 'edited')) ||
                  blockFields.some(f => f.status === 'edited');

                const hasIdpageContentChange = idpageBaseline !== null && (
                  idpageBaseline.frozenUntilIndex !== frozenUntilIndex ||
                  !areColumnCountsEqual(idpageBaseline.pageColumnCounts, pageColumnCounts)
                );

                const hasIdlistContentChange = idlistBaseline !== null && (
                  idlistBaseline.frozenUntilIndex !== frozenUntilIndex ||
                  !areColumnCountsEqual(idlistBaseline.pageColumnCounts, pageColumnCounts)
                );

                return hasEditedField || hasIdpageContentChange || hasIdlistContentChange;
              })()) && <span className="absolute top-[2px] right-[2px] w-[4px] h-[4px] rounded-full bg-[#D0006F] z-10" />}
            </button>

            {/* AI Copilot button */}
            
          </div>
          </div>
        </div>

        {/* Content row: shell image + metadata overlay */}
        <div className="flex flex-1 overflow-hidden relative">
          {/* Shell content */}
          <div
            className="relative flex-1 overflow-auto bg-white"
          >
            <div className="min-w-max p-[16px]">
              <div className="w-max bg-white text-black">
                <div
                  ref={tableContainerRef}
                  className="relative"
                  onClick={() => setSelectedPageBreak(null)}
                >
                  <div className="h-[72px] min-w-max border-b-2 border-black flex items-start justify-center px-[16px] pt-[24px]">
                    <h1 className="font-['Inter',sans-serif] text-[14px] leading-[20px] font-bold text-center tracking-[-0.01em]">
                      Appendix 16.2.4 Demographic and baseline characteristics (ITT analysis set)
                    </h1>
                  </div>

                  <table className="table-auto border-collapse min-w-max font-['Inter',sans-serif] text-black">
                    <thead>
                      <tr className="border-b-2 border-black">
                        {columns.map((column, columnIndex) => {
                          const frozen = isColumnFrozen(columnIndex);
                          const frozenBoundary = frozenUntilIndex === columnIndex;
                          const freezeActive = frozenUntilIndex !== null && columnIndex <= frozenUntilIndex;

                          const shadows: string[] = [];
                          if (frozenBoundary) {
                            shadows.push('4px 0 0 rgba(0,0,0,0.08)');
                          }

                          const cellStyle: React.CSSProperties = {};
                          if (frozen) {
                            cellStyle.left = `${getFrozenLeft(columnIndex)}px`;
                            cellStyle.zIndex = 50;
                          }
                          if (shadows.length) cellStyle.boxShadow = shadows.join(', ');

                          return (
                          <th
                            key={column.key}
                            ref={(node) => { thRefs.current[columnIndex] = node; }}
                            style={cellStyle}
                            className={`relative ${column.width} border-r px-[4px] py-[6px] text-left align-middle text-[12px] leading-[18px] font-bold whitespace-normal break-words select-none pointer-events-auto transition-[border-color,box-shadow,background-color,outline-color] duration-[180ms] group ${
                              frozen ? 'sticky bg-white' : ''
                            }`}
                            onMouseEnter={() => setHoveredColumn(columnIndex)}
                            onMouseLeave={() => setHoveredColumn(null)}
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              if (pageSepActive) return;
                              // Toggle freeze to this column
                              setFrozenUntilIndex((current) => (current === columnIndex ? null : columnIndex));
                            }}
                          >
                            {/* Gap hit zone for page break insertion */}
                            {columnIndex < columns.length - 1 && isGapInteractive(columnIndex) && (
                              <div
                                className="absolute top-0 bottom-0 z-50"
                                style={{ right: '-6px', width: '12px', cursor: 'col-resize' }}
                                onMouseEnter={(e) => { e.stopPropagation(); setHoveredGap(columnIndex); setHoveredColumn(null); }}
                                onMouseLeave={() => setHoveredGap(null)}
                                onClick={(e) => { e.stopPropagation(); addPageBreak(columnIndex); }}
                              />
                            )}
                            <button
                              type="button"
                              onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                onBlockClick();
                              }}
                              className="w-full rounded-[3px] text-left transition-colors duration-[180ms] hover:bg-black/[0.03] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#830051] focus-visible:outline-offset-1"
                              aria-label={`打开 ${column.label} metadata`}
                            >
                              {column.label}
                            </button>
                          </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, rowIndex) => (
                        <tr key={row.subject} className="border-b border-[#d9d9d9] last:border-b-2 last:border-black">
                          {columns.map((column, columnIndex) => {
                            const cellId = `${row.subject}-${column.key}`;
                            const frozen = isColumnFrozen(columnIndex);
                            const frozenBoundary = frozenUntilIndex === columnIndex;

                            const shadows: string[] = [];
                            if (frozenBoundary) {
                              shadows.push('4px 0 0 rgba(0,0,0,0.08)');
                            }

                            const cellStyle: React.CSSProperties = {};
                            if (frozen) {
                              cellStyle.left = `${getFrozenLeft(columnIndex)}px`;
                              cellStyle.zIndex = 48;
                            }
                            if (shadows.length) cellStyle.boxShadow = shadows.join(', ');

                            return (
                              <td
                                key={cellId}
                                style={cellStyle}
                                className={`${column.width} border-r border-[#d9d9d9] px-[4px] py-[6px] align-middle text-[12px] leading-[18px] font-normal whitespace-normal break-words transition-[border-color,box-shadow,background-color] duration-[180ms] ${
                                  frozen ? 'sticky bg-white' : ''
                                }`}
                              >
                                {row[column.key]}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Frozen zone tint — purple wash over the locked columns area */}
                  {frozenUntilIndex !== null && (
                    <div
                      className="absolute bottom-0 pointer-events-none"
                      style={{
                        top: `${TABLE_TOP}px`,
                        left: 0,
                        width: `${gapXPositions[frozenUntilIndex] ?? getGapX(frozenUntilIndex)}px`,
                        backgroundColor: 'rgba(216, 207, 221, 0.08)',
                        zIndex: 5,
                      }}
                    />
                  )}

                  {/* Column hover tooltip for freeze */}
                  {hoveredColumn !== null && frozenUntilIndex !== hoveredColumn && (
                    <div
                      className="absolute pointer-events-none z-[60]"
                      style={{ 
                        left: `${
                          hoveredColumn === 0 
                            ? (columnXPositions[0] ?? columns[0].widthPx) / 2
                            : ((columnXPositions[hoveredColumn - 1] ?? getGapX(hoveredColumn - 1)) + (columnXPositions[hoveredColumn] ?? getGapX(hoveredColumn))) / 2
                        }px`, 
                        top: `${PILL_BOTTOM_Y}px`, 
                        transform: 'translateX(-50%) translateY(-100%)' 
                      }}
                    >
                      <div className="flex items-center gap-[2px] bg-[#3C4242] text-[#F8F7F7] rounded-[4px] px-[4px] py-[4px] whitespace-nowrap shadow-[0px_2px_4px_rgba(0,0,0,0.08)]">
                        <svg className="size-[16px]" viewBox="0 0 16 16" fill="none">
                          <path d="M8.00037 4.13303L9.08719 3.40797L9.58023 4.14757L8.44485 4.90451V7.23013L10.4589 6.06733L10.5467 4.70554L11.4337 4.7628L11.3497 6.06621L12.5205 6.64515L12.1266 7.44193L10.9033 6.83713L8.88947 7.99979L10.9035 9.16266L12.1268 8.55779L12.5207 9.3546L11.3498 9.93354L11.4339 11.237L10.5469 11.2942L10.459 9.93246L8.44485 8.76951V11.0954L9.58023 11.8524L9.08719 12.592L8.00037 11.8675L6.91355 12.592L6.42051 11.8524L7.55589 11.0954V8.76984L5.54169 9.93268L5.45379 11.2944L4.56681 11.2372L4.65074 9.93376L3.47987 9.35481L3.87383 8.55801L5.09707 9.16282L7.11127 7.99979L5.09739 6.83701L3.87415 7.44182L3.48019 6.64502L4.65106 6.06607L4.56713 4.76259L5.45411 4.70533L5.54201 6.067L7.55589 7.23013V4.90451L6.42051 4.14757L6.91355 3.40797L8.00037 4.13303Z" fill="white" />
                        </svg>
                        <span className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px]">Repeat Every Page</span>
                      </div>
                    </div>
                  )}

                  {/* Freeze divider (when freeze is active) */}
                  {frozenUntilIndex !== null && (
                    <FreezeDivider
                      columnIndex={frozenUntilIndex}
                      columnX={columnXPositions[frozenUntilIndex] ?? getGapX(frozenUntilIndex)}
                      columnLabel={columns[frozenUntilIndex]?.label.split(' ')[0] ?? `C${frozenUntilIndex + 1}`}
                      isDragging={draggingFreeze !== null}
                      dragColumnX={
                        draggingFreeze
                          ? (columnXPositions[draggingFreeze.currentIdx] ?? getGapX(draggingFreeze.currentIdx))
                          : (columnXPositions[frozenUntilIndex] ?? getGapX(frozenUntilIndex))
                      }
                      onRemove={() => setFrozenUntilIndex(null)}
                      onDragStart={handleFreezeDragStart}
                    />
                  )}

                  {/* Page break insertion preview (while hovering a gap) */}
                  {hoveredGap !== null && !pageBreakColumns.includes(hoveredGap) && (
                    <>
                      <div
                        className="absolute bottom-0 pointer-events-none"
                        style={{ left: `${(gapXPositions[hoveredGap] ?? getGapX(hoveredGap)) - 1}px`, top: `${TABLE_TOP}px`, width: '2px', borderLeft: '2px dashed rgba(240,171,0,0.65)', zIndex: 35 }}
                      />
                      <div
                        className="absolute pointer-events-none z-[60]"
                        style={{ left: `${gapXPositions[hoveredGap] ?? getGapX(hoveredGap)}px`, top: `${PILL_BOTTOM_Y}px`, transform: 'translateX(-50%) translateY(-100%)' }}
                      >
                        <div className="flex items-center gap-[4px] bg-[#3C4242] text-[#F8F7F7] rounded-[4px] px-[6px] py-[4px] whitespace-nowrap shadow-[0px_2px_4px_rgba(0,0,0,0.08)]">
                          <span className="text-[12px] leading-[16px] font-bold">+</span>
                          <span className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[16px]">Add page break</span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Permanent page break dividers */}
                  {[...pageBreakColumns].sort((a, b) => a - b).map((colIdx, i) => {
                    const measuredX = gapXPositions[colIdx] ?? getGapX(colIdx);
                    const isDragging = draggingBreak?.colIdx === colIdx;
                    const dragGapX = isDragging
                      ? (gapXPositions[draggingBreak!.currentGap] ?? getGapX(draggingBreak!.currentGap))
                      : measuredX;
                    return (
                      <PageBreakDivider
                        key={colIdx}
                        gapX={measuredX}
                        label={`P${i + 1}`}
                        isSelected={selectedPageBreak === colIdx}
                        isDragging={isDragging}
                        dragGapX={dragGapX}
                        onSelect={(e) => { e.stopPropagation(); setSelectedPageBreak(colIdx); }}
                        onRemove={() => {
                          setPageBreakColumns(prev => prev.filter(c => c !== colIdx));
                          setSelectedPageBreak(null);
                        }}
                        onDragStart={handlePageBreakDragStart(colIdx)}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Metadata overlay */}
          {metadataOpen && (
            <>
              <Divider onDrag={handleMetadataDividerDrag} />
              <div
                className="shrink-0 h-full overflow-hidden bg-white pt-[4px] pb-[8px] pl-[4px] pr-[8px]"
                style={{ width: `${metadataWidth}px` }}
              >
                <MetadataPanel
                  onClose={onCloseMetadata}
                  isLocked={isLocked}
                  frozenUntilIndex={frozenUntilIndex}
                  pageSepActive={pageSepActive}
                  pageColumnCounts={pageColumnCounts}
                  idpageBaseline={idpageBaseline}
                  idlistBaseline={idlistBaseline}
                  onIdpageBaselineChange={setIdpageBaseline}
                  onIdlistBaselineChange={setIdlistBaseline}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}