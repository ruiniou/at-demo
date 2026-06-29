import { FileText } from 'lucide-react';
import Union from '../../imports/Union';
import MetadataPanel from './MetadataPanel';
import Divider from './Divider';
import { useState, useRef, useEffect, useMemo } from 'react';
import type React from 'react';
import { Input } from './ui/input';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';

interface ShellPreviewProps {
  selectedItem: string | null;
  onBlockClick: () => void;
  onMetadataClick: () => void;
  metadataOpen: boolean;
  onCloseMetadata: () => void;
  isLocked?: boolean;
  onPagePreviewChange?: (active: boolean) => void;
  onOpenAICopilot?: () => void;
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
    subject: 'E0001001',
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
    subject: 'E0001002',
    age: '30/F/White',
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
    subject: 'E0001003',
    age: '31/F/White',
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
    subject: 'E0001004',
    age: '32/F/White',
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
] as const;

export default function ShellPreview({
  selectedItem,
  onBlockClick,
  onMetadataClick,
  metadataOpen,
  onCloseMetadata,
  isLocked,
  onPagePreviewChange,
  onOpenAICopilot,
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

  const previousPageSepActiveRef = useRef(pageSepActive);
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

  return (
    <div className="h-full bg-white flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="bg-white h-[40px] shrink-0 w-full flex items-center justify-between px-[12px]">
        <p className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] text-black">
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
            {metadataPending && <span className="absolute top-[2px] right-[2px] w-[4px] h-[4px] rounded-full bg-[#D0006F] z-10" />}
          </button>

          {/* AI Copilot button */}
          <button
            type="button"
            onClick={onOpenAICopilot}
            className="size-[24px] flex items-center justify-center rounded-[4px] hover:bg-black/5 transition-colors duration-[180ms] active:scale-[0.96]"
            aria-label="Open AI Copilot"
            title="AI Copilot"
          >
            <div className="size-[16px]" style={{ '--fill-0': '#888E8E' } as React.CSSProperties}>
              <Union />
            </div>
          </button>
        </div>
        </div>
      </div>

      {/* Content row: shell image + metadata overlay */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Shell content */}
        <div
          className={`relative flex-1 overflow-auto ${pageSepActive ? 'bg-[#f2f3f3]' : 'bg-white'}`}
        >
          {pageSepActive && (
            <div className="absolute inset-0 z-[60] flex flex-col overflow-hidden bg-[#f2f3f3]">
              <div className="z-[70] h-[44px] shrink-0 border-b border-[#d8dada] bg-white/95 backdrop-blur-sm px-[16px] flex items-center justify-center shadow-[0px_1px_4px_rgba(0,0,0,0.04)]">
                {selectedPrintPage && (
                  <div className="flex items-center justify-center gap-[18px]">
                    <div className="flex items-center gap-[6px]">
                      <span className="font-['Inter',sans-serif] text-[12px] leading-[18px] text-[#3c4242] whitespace-nowrap">Page</span>
                      <div className="flex items-center overflow-hidden rounded-[4px] border border-[#d8dada] bg-white">
                        <button
                          type="button"
                          onClick={() => handlePageSelectionByNumber(selectedPrintPageIndex)}
                          disabled={selectedPrintPageIndex <= 0}
                          className="h-[24px] w-[24px] border-r border-[#d8dada] text-[#3c4242] transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:text-[#c4c8c8] disabled:hover:bg-transparent"
                          aria-label="Previous page"
                        >
                          -
                        </button>
                        <Input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={pageSelectionDraft}
                          onFocus={(event) => event.currentTarget.select()}
                          onChange={(event) => {
                            const nextValue = event.target.value.replace(/\D/g, '');
                            setPageSelectionDraft(nextValue);
                          }}
                          onBlur={commitPageSelectionDraft}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              event.currentTarget.blur();
                            }
                          }}
                          className="h-[24px] w-[40px] rounded-none border-0 px-[8px] py-0 text-center text-[12px] leading-[18px] shadow-none focus-visible:ring-0"
                        />
                        <button
                          type="button"
                          onClick={() => handlePageSelectionByNumber(selectedPrintPageIndex + 2)}
                          disabled={selectedPrintPageIndex >= printPages.length - 1}
                          className="h-[24px] w-[24px] border-l border-[#d8dada] text-[#3c4242] transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:text-[#c4c8c8] disabled:hover:bg-transparent"
                          aria-label="Next page"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-[6px]">
                      <span className="font-['Inter',sans-serif] text-[12px] leading-[18px] text-[#3c4242] whitespace-nowrap">Columns</span>
                      <div className="flex items-center overflow-hidden rounded-[4px] border border-[#d8dada] bg-white">
                        <button
                          type="button"
                          onClick={() => updateSelectedPageColumnTotal(selectedPageColumnTotal - 1)}
                          disabled={selectedPageColumnTotal <= minColumnsPerPage}
                          className="h-[24px] w-[24px] border-r border-[#d8dada] text-[#3c4242] transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:text-[#c4c8c8] disabled:hover:bg-transparent"
                          aria-label="Decrease columns per page"
                        >
                          -
                        </button>
                        <Input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={selectedPageColumnTotal}
                          onFocus={(event) => event.currentTarget.select()}
                          onChange={(event) => {
                            const nextValue = event.target.value.replace(/\D/g, '');
                            if (nextValue === '') return;
                            updateSelectedPageColumnTotal(Number(nextValue));
                          }}
                          className="h-[24px] w-[40px] rounded-none border-0 px-[8px] py-0 text-center text-[12px] leading-[18px] shadow-none focus-visible:ring-0"
                        />
                        <button
                          type="button"
                          onClick={() => updateSelectedPageColumnTotal(selectedPageColumnTotal + 1)}
                          disabled={selectedPageColumnTotal >= maxColumnsPerPage}
                          className="h-[24px] w-[24px] border-l border-[#d8dada] text-[#3c4242] transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:text-[#c4c8c8] disabled:hover:bg-transparent"
                          aria-label="Increase columns per page"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div ref={pagePreviewScrollRef} className="flex-1 overflow-auto p-[24px] flex flex-col items-center gap-[18px]">
              {printPages.map((page, pageIndex) => (
                <div
                  key={page.id}
                  ref={(node) => {
                    pageCardRefs.current[page.id] = node;
                  }}
                  onClick={() => handlePageSelectionChange(pageIndex)}
                  className={`relative overflow-hidden bg-white shadow-[0px_10px_30px_rgba(32,37,37,0.12)] border border-[#cfd2d2] transition-shadow duration-[180ms] ${selectedPrintPageIndex === pageIndex ? 'ring-2 ring-[#830051]/35' : ''}`}
                  style={{ width: `${pageWidthPx}px`, minHeight: `${pageHeightPx}px` }}
                >
                  <div style={{ transform: `scale(${pageScale / 100})`, transformOrigin: 'top left' }} className="relative">
                  <div className="absolute right-[32px] top-[28px] rounded-full bg-[#f4e8ee] px-[8px] py-[2px] font-['JetBrains_Mono',monospace] text-[10px] leading-[14px] text-[#830051]">
                    Page {pageIndex + 1}
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
            </div>
          )}
          <div className={`min-w-max p-[16px] ${pageSepActive ? 'hidden' : ''}`}>
            <div className="w-max bg-white text-black">
              <div className="relative">
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
                          cellStyle.zIndex = 22;
                        }
                        if (shadows.length) cellStyle.boxShadow = shadows.join(', ');

                        return (
                        <th
                          key={column.key}
                          style={cellStyle}
                          className={`${column.width} border-r px-[4px] py-[6px] text-left align-middle text-[12px] leading-[18px] font-bold whitespace-normal break-words select-none pointer-events-auto transition-[border-color,box-shadow,background-color,outline-color] duration-[180ms] group ${
                            frozen ? 'sticky bg-white' : ''
                          } ${
                            frozenBoundary ? 'relative' : ''
                          } ${
                            frozenBoundary ? "after:content-[''] after:absolute after:top-[-2px] after:bottom-[-2px] after:right-[-2px] after:w-[2px] after:bg-[#830051] after:z-[40] after:pointer-events-none" : ''
                          }`}
                        >
                          <div className="flex w-full items-center justify-between gap-[4px] rounded-[3px]">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                onBlockClick();
                              }}
                              className="flex-1 rounded-[3px] text-left transition-colors duration-[180ms] hover:bg-black/[0.03] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#830051] focus-visible:outline-offset-1"
                              aria-label={`打开 ${column.label} metadata`}
                            >
                              {column.label}
                            </button>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    if (pageSepActive) return;
                                    setFrozenUntilIndex((current) => (current === columnIndex ? null : columnIndex));
                                  }}
                                  className={`size-[24px] shrink-0 transition-opacity duration-[180ms] ${frozenBoundary ? 'opacity-100 text-[#830051]' : 'opacity-0 group-hover:opacity-100 text-[#888E8E]'}`}
                                  aria-label={freezeActive ? `取消冻结到 ${column.label}` : `冻结到 ${column.label}`}
                                >
                                  <svg className="size-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.0006 6.19875L13.6308 5.11195L14.3704 6.22135L12.6673 7.35677V10.8452L15.6884 9.10099L15.8201 7.05831L17.1506 7.14413L17.0246 9.09932L18.7808 9.96772L18.1899 11.1629L16.355 10.2557L13.3342 11.9997L16.3552 13.744L18.1901 12.8367L18.7811 14.0319L17.0248 14.9003L17.1509 16.8555L15.8203 16.9413L15.6886 14.8987L12.6673 13.1543V16.6432L14.3704 17.7786L13.6308 18.888L12.0006 17.8012L10.3705 18.888L9.63086 17.7786L11.334 16.6432V13.1546L8.31272 14.8989L8.18098 16.9416L6.85041 16.8557L6.97651 14.9005L5.22021 14.0322L5.81118 12.8369L7.64605 13.7442L10.6675 11.9997L7.64631 10.2555L5.81143 11.1627L5.22047 9.96749L6.97676 9.09909L6.85067 7.14389L8.18123 7.05808L8.31298 9.10075L11.334 10.8449V7.35677L9.63086 6.22135L10.3705 5.11195L12.0006 6.19875Z" fill="currentColor" />
                                  </svg>
                                </button>
                              </TooltipTrigger>
                              <TooltipContent
                                side="bottom"
                                sideOffset={2}
                                className="bg-[#3C4242] text-[#F8F7F7] text-[12px] rounded-[4px] px-[6px] py-[4px] font-normal"
                              >
                                freeze
                              </TooltipContent>
                            </Tooltip>
                          </div>
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
                            cellStyle.zIndex = 20;
                          }
                          if (shadows.length) cellStyle.boxShadow = shadows.join(', ');

                          return (
                            <td
                              key={cellId}
                              style={cellStyle}
                              className={`${column.width} border-r border-[#d9d9d9] px-[4px] py-[6px] align-middle text-[12px] leading-[18px] font-normal whitespace-normal break-words transition-[border-color,box-shadow,background-color] duration-[180ms] ${
                                frozen ? 'sticky bg-white' : ''
                              } ${
                                frozenBoundary ? "relative after:content-[''] after:absolute after:top-[-2px] after:bottom-[-2px] after:right-[-2px] after:w-[2px] after:bg-[#830051] after:z-[40] after:pointer-events-none" : ''
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
  );
}
