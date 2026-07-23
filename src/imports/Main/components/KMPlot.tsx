import React, { useState } from 'react';
import figureIconUrl from '../../../icons/Figure.svg';
import tableIconUrl from '../../../icons/Table.svg';

const filterBrand = "brightness(0) saturate(100%) invert(13%) sepia(85%) saturate(2902%) hue-rotate(309deg) brightness(77%) contrast(111%)";

interface KMPlotProps {
  mode: 'shell' | 'runtime';
  timeUnit?: 'Days' | 'Weeks' | 'Months';
  showCI: boolean;
  showCensorMarks: boolean;
  showMedianLines: boolean;
  showRiskTable: boolean;
  title?: string;
  figureNumber?: string;
  onBlockClick?: () => void;
}

export function KMPlot({
  mode,
  timeUnit = 'Months',
  showCI,
  showCensorMarks,
  showMedianLines,
  showRiskTable,
  title,
  figureNumber = 'Figure 15.1.1',
  onBlockClick,
}: KMPlotProps) {
  // Chart dimensions
  const width = 520;
  const height = 280;
  const paddingLeft = 55;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 40;

  const plotWidth = width - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;

  // Data ranges
  const maxTime = 50;
  const maxSurvival = 1.0;

  // Scale functions
  const getX = (t: number) => paddingLeft + (t / maxTime) * plotWidth;
  const getY = (s: number) => paddingTop + plotHeight - (s / maxSurvival) * plotHeight;

  // Group 1: Active Treatment
  const group1 = {
    label: 'Active Treatment',
    color: '#830051', // Brand magenta / raspberry
    points: [
      { t: 0, s: 1.0 },
      { t: 8, s: 0.94 },
      { t: 15, s: 0.88 },
      { t: 24, s: 0.78 },
      { t: 32, s: 0.69 },
      { t: 40, s: 0.58 },
      { t: 50, s: 0.51 },
    ],
    ciUpper: [
      { t: 0, s: 1.0 },
      { t: 8, s: 0.99 },
      { t: 15, s: 0.96 },
      { t: 24, s: 0.88 },
      { t: 32, s: 0.81 },
      { t: 40, s: 0.71 },
      { t: 50, s: 0.65 },
    ],
    ciLower: [
      { t: 0, s: 1.0 },
      { t: 8, s: 0.88 },
      { t: 15, s: 0.78 },
      { t: 24, s: 0.67 },
      { t: 32, s: 0.56 },
      { t: 40, s: 0.44 },
      { t: 50, s: 0.36 },
    ],
    censors: [12, 20, 35, 45],
    risk: [40, 37, 33, 27, 22, 18], // at 0, 10, 20, 30, 40, 50
    medianTime: 50,
  };

  // Group 2: Placebo
  const group2 = {
    label: 'Placebo',
    color: '#D97706', // Brand amber / gold
    points: [
      { t: 0, s: 1.0 },
      { t: 6, s: 0.86 },
      { t: 12, s: 0.72 },
      { t: 18, s: 0.59 },
      { t: 25, s: 0.46 },
      { t: 35, s: 0.33 },
      { t: 45, s: 0.22 },
      { t: 50, s: 0.18 },
    ],
    ciUpper: [
      { t: 0, s: 1.0 },
      { t: 6, s: 0.94 },
      { t: 12, s: 0.83 },
      { t: 18, s: 0.72 },
      { t: 25, s: 0.59 },
      { t: 35, s: 0.47 },
      { t: 45, s: 0.35 },
      { t: 50, s: 0.30 },
    ],
    ciLower: [
      { t: 0, s: 1.0 },
      { t: 6, s: 0.76 },
      { t: 12, s: 0.59 },
      { t: 18, s: 0.45 },
      { t: 25, s: 0.32 },
      { t: 35, s: 0.19 },
      { t: 45, s: 0.09 },
      { t: 50, s: 0.06 },
    ],
    censors: [10, 22, 30, 41],
    risk: [40, 32, 23, 16, 9, 5],
    medianTime: 22.4, // crosses 0.5 here
  };

  // Helper to build step-function path
  const buildStepPath = (points: { t: number; s: number }[]) => {
    if (points.length === 0) return '';
    let path = `M ${getX(points[0].t)} ${getY(points[0].s)}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      path += ` H ${getX(curr.t)} V ${getY(curr.s)}`;
    }
    return path;
  };

  // Helper to build filled CI band step path
  const buildCIBandPath = (upper: { t: number; s: number }[], lower: { t: number; s: number }[]) => {
    if (upper.length === 0 || lower.length === 0) return '';
    
    // Top edge (left to right)
    let path = `M ${getX(upper[0].t)} ${getY(upper[0].s)}`;
    for (let i = 1; i < upper.length; i++) {
      path += ` H ${getX(upper[i].t)} V ${getY(upper[i].s)}`;
    }
    
    // Connect to bottom edge (right to left)
    const lastLower = lower[lower.length - 1];
    path += ` L ${getX(lastLower.t)} ${getY(lastLower.s)}`;
    
    for (let i = lower.length - 2; i >= 0; i--) {
      const nextLower = lower[i];
      path += ` V ${getY(nextLower.s)} H ${getX(nextLower.t)}`;
    }
    
    path += ' Z';
    return path;
  };

  // Find y value on curve at time t for placing censor ticks
  const getYOnCurve = (points: { t: number; s: number }[], t: number) => {
    for (let i = 1; i < points.length; i++) {
      if (t <= points[i].t) {
        return points[i - 1].s;
      }
    }
    return points[points.length - 1].s;
  };

  const gridYValues = [0.2, 0.4, 0.6, 0.8, 1.0];
  const ticksX = [0, 10, 20, 30, 40, 50];

  const defaultTitle = 'PFS (Progression-Free Survival) by Treatment Group';
  const displayTitle = title || defaultTitle;

  const [selectedBlock, setSelectedBlock] = useState<'chart' | 'table'>('chart');

  if (mode === 'runtime') {
    const isChartSelected = selectedBlock === 'chart';
    const isTableSelected = selectedBlock === 'table';

    return (
      <div className="flex flex-col gap-[16px] w-full text-text-primary">
        {/* Chart Component Spatial Box */}
        <div 
          className={`w-full rounded-[4px] border border-dashed bg-transparent p-[16px] cursor-pointer transition-all duration-180 ${
            isChartSelected 
              ? 'border-[#830051] shadow-[0_0_0_4px_#F4E8EE]' 
              : 'border-[#E8EAEB] border-graphite-10 shadow-none hover:border-[#830051]/50'
          }`}
          onClick={() => {
            setSelectedBlock('chart');
            onBlockClick?.();
          }}
        >
          <div className="flex items-center gap-[8px] mb-[16px]">
            <img src={figureIconUrl} alt="" className="w-[16px] h-[16px] shrink-0" style={{ filter: filterBrand }} />
            <span className="text-[12px] font-medium text-[#888E8E]">Chart</span>
          </div>
          <div className="flex justify-center p-[8px]">
            {/* Extremely simple schematic SVG chart */}
            <svg viewBox="0 0 200 100" className="w-full max-w-[300px] h-auto overflow-visible opacity-50">
              {/* Axes */}
              <line x1="10" y1="90" x2="190" y2="90" stroke="#E8EAEB" strokeWidth="2" />
              <line x1="10" y1="10" x2="10" y2="90" stroke="#E8EAEB" strokeWidth="2" />
              {/* Step lines */}
              <path d="M10 20 H50 V40 H100 V60 H140 V80 H190" fill="none" stroke="#830051" strokeWidth="2" />
              <path d="M10 30 H60 V50 H110 V70 H150 V85 H190" fill="none" stroke="#D97706" strokeWidth="2" strokeDasharray="4,4" />
            </svg>
          </div>
        </div>

        {/* Risk Table Component Spatial Box */}
        {showRiskTable && (
          <div 
            className={`w-full rounded-[4px] border border-dashed bg-transparent p-[16px] cursor-pointer transition-all duration-180 ${
              isTableSelected 
                ? 'border-[#830051] shadow-[0_0_0_4px_#F4E8EE]' 
                : 'border-[#E8EAEB] border-graphite-10 shadow-none hover:border-[#830051]/50'
            }`}
            onClick={() => {
              setSelectedBlock('table');
              onBlockClick?.();
            }}
          >
            <div className="flex items-center gap-[8px] mb-[16px]">
              <img src={tableIconUrl} alt="" className="w-[16px] h-[16px] shrink-0" style={{ filter: filterBrand }} />
              <span className="text-[12px] font-medium text-[#888E8E]">At-risk Table</span>
            </div>
            <table className="w-full text-center text-[10px] text-[#A6AAAA] border-collapse">
              <tbody>
                {[1, 2, 3].map((row) => (
                  <tr key={row}>
                    {[1, 2, 3].map((col) => (
                      <td key={col} className="border border-[#E8EAEB] py-[8px] w-1/3">
                        —
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col select-none font-sans w-full text-text-primary cursor-pointer hover:bg-black/5 p-[8px] rounded-[4px] transition-colors"
      onClick={onBlockClick}
    >


      {/* SVG Plot */}
      <div className="flex justify-center p-[12px]">
        <svg width={width} height={height} className="overflow-visible">
          {/* Grid Lines */}
          {gridYValues.map((val) => (
            <line
              key={val}
              x1={getX(0)}
              y1={getY(val)}
              x2={getX(maxTime)}
              y2={getY(val)}
              stroke="#E8EAEB"
              strokeWidth="0.6"
              strokeDasharray="3,3"
            />
          ))}

          {/* X Axis Ticks */}
          {ticksX.map((val) => (
            <g key={val}>
              <line
                x1={getX(val)}
                y1={getY(0)}
                x2={getX(val)}
                y2={getY(0) + 4}
                stroke="#888E8E"
                strokeWidth="1"
              />
              <text
                x={getX(val)}
                y={getY(0) + 16}
                textAnchor="middle"
                className="text-[9px] fill-[#656969] font-mono"
              >
                {val}
              </text>
            </g>
          ))}

          {/* Y Axis Ticks */}
          {[0.0, 0.2, 0.4, 0.6, 0.8, 1.0].map((val) => (
            <g key={val}>
              <line
                x1={getX(0) - 4}
                y1={getY(val)}
                x2={getX(0)}
                y2={getY(val)}
                stroke="#888E8E"
                strokeWidth="1"
              />
              <text
                x={getX(0) - 8}
                y={getY(val) + 3}
                textAnchor="end"
                className="text-[9px] fill-[#656969] font-mono"
              >
                {mode === 'runtime' ? `${Math.round(val * 100)}%` : val.toFixed(1)}
              </text>
            </g>
          ))}

          {/* Axes Lines */}
          <line
            x1={getX(0)}
            y1={getY(0)}
            x2={getX(maxTime)}
            y2={getY(0)}
            stroke="#888E8E"
            strokeWidth="1"
          />
          <line
            x1={getX(0)}
            y1={getY(0)}
            x2={getX(0)}
            y2={getY(1.0)}
            stroke="#888E8E"
            strokeWidth="1"
          />

          {/* Axis Titles */}
          <text
            x={getX(maxTime / 2)}
            y={getY(0) + 32}
            textAnchor="middle"
            className="text-[10px] fill-text-primary font-medium"
          >
            Time ({timeUnit})
          </text>
          
          <text
            x={getX(0) - 36}
            y={getY(0.5)}
            textAnchor="middle"
            transform={`rotate(-90, ${getX(0) - 36}, ${getY(0.5)})`}
            className="text-[10px] fill-text-primary font-medium"
          >
            Survival Probability
          </text>

          {/* Median Reference Lines */}
          {showMedianLines && (
            <>
              <line
                x1={getX(0)}
                y1={getY(0.5)}
                x2={getX(group2.medianTime)}
                y2={getY(0.5)}
                stroke={group2.color}
                strokeWidth="1"
                strokeDasharray="2,2"
                opacity="0.6"
              />
              <line
                x1={getX(group2.medianTime)}
                y1={getY(0.5)}
                x2={getX(group2.medianTime)}
                y2={getY(0)}
                stroke={group2.color}
                strokeWidth="1"
                strokeDasharray="2,2"
                opacity="0.6"
              />
              <circle
                cx={getX(group2.medianTime)}
                cy={getY(0.5)}
                r="3"
                fill={group2.color}
              />
            </>
          )}

          {/* CI Bands */}
          {showCI && (
            <>
              <path
                d={buildCIBandPath(group1.ciUpper, group1.ciLower)}
                fill={group1.color}
                fillOpacity="0.12"
                stroke="none"
              />
              <path
                d={buildCIBandPath(group2.ciUpper, group2.ciLower)}
                fill={group2.color}
                fillOpacity="0.12"
                stroke="none"
              />
            </>
          )}

          {/* KM Curves */}
          <path
            d={buildStepPath(group1.points)}
            fill="none"
            stroke={group1.color}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d={buildStepPath(group2.points)}
            fill="none"
            stroke={group2.color}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeDasharray="5,4"
          />

          {/* Censor Marks */}
          {showCensorMarks && (
            <>
              {group1.censors.map((t) => {
                const s = getYOnCurve(group1.points, t);
                return (
                  <line
                    key={t}
                    x1={getX(t)}
                    y1={getY(s) - 4}
                    x2={getX(t)}
                    y2={getY(s) + 4}
                    stroke={group1.color}
                    strokeWidth="1.2"
                  />
                );
              })}
              {group2.censors.map((t) => {
                const s = getYOnCurve(group2.points, t);
                return (
                  <line
                    key={t}
                    x1={getX(t)}
                    y1={getY(s) - 4}
                    x2={getX(t)}
                    y2={getY(s) + 4}
                    stroke={group2.color}
                    strokeWidth="1.2"
                  />
                );
              })}
            </>
          )}

          {/* Legend */}
          <g transform={`translate(${width - 150}, ${paddingTop + 10})`}>
            <g transform="translate(0, 0)">
              <line x1="0" y1="6" x2="20" y2="6" stroke={group1.color} strokeWidth="2" />
              <text x="26" y="10" className="text-[10px] fill-text-primary">{group1.label}</text>
            </g>
            <g transform="translate(0, 18)">
              <line x1="0" y1="6" x2="20" y2="6" stroke={group2.color} strokeWidth="2" strokeDasharray="4,3" />
              <text x="26" y="10" className="text-[10px] fill-text-primary">{group2.label}</text>
            </g>
          </g>
        </svg>
      </div>

      {/* Risk Table */}
      {showRiskTable && (
        <div className="mt-[12px] w-full overflow-x-auto">
          <table className="w-full text-[10px] border-collapse font-sans">
            <thead>
              <tr className="border-b border-border-default">
                <th className="text-left font-bold py-[4px] px-[8px] text-text-primary w-[110px]">
                  Number at Risk
                </th>
                {ticksX.map((tick) => (
                  <th key={tick} className="text-center font-semibold py-[4px] px-[4px] text-text-secondary">
                    {tick}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border-default last:border-0">
                <td className="text-left font-semibold py-[4px] px-[8px]" style={{ color: group1.color }}>
                  <span className="font-mono font-bold mr-[4px]">──</span> {group1.label}
                </td>
                {group1.risk.map((val, idx) => (
                  <td key={idx} className="text-center py-[4px] px-[4px] text-text-primary">
                    {val}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="text-left font-semibold py-[4px] px-[8px]" style={{ color: group2.color }}>
                  <span className="font-mono font-bold mr-[4px]">- -</span> {group2.label}
                </td>
                {group2.risk.map((val, idx) => (
                  <td key={idx} className="text-center py-[4px] px-[4px] text-text-primary">
                    {val}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
