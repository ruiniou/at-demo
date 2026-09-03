import React, { useState } from 'react';
import figureIconUrl from '../../../icons/Figure.svg';
import tableIconUrl from '../../../icons/Table.svg';
import barChartIconUrl from '../../../icons/bar-chart-2-line.svg';

const filterBrand = "brightness(0) saturate(100%) invert(13%) sepia(85%) saturate(2902%) hue-rotate(309deg) brightness(77%) contrast(111%)";

interface KMPlotProps {
  mode: 'shell' | 'runtime';
  timeUnit?: 'Days' | 'Weeks' | 'Months';
  showCI?: boolean;
  showCensorMarks?: boolean;
  showMedianLines?: boolean;
  showRiskTable?: boolean;
  showSubgroupForest?: boolean;
  title?: string;
  figureNumber?: string;
  selectedComponent?: string;
  onBlockClick?: (blockName: string) => void;
}

export function KMPlot({
  mode,
  timeUnit = 'Months',
  showCI = true,
  showCensorMarks = true,
  showMedianLines = true,
  showRiskTable = true,
  showSubgroupForest = true,
  title,
  figureNumber = 'Figure 15.1.1',
  selectedComponent,
  onBlockClick,
}: KMPlotProps) {
  // Chart dimensions
  const width = 640;
  const height = 300;
  const paddingLeft = 55;
  const paddingRight = 30;
  const paddingTop = 24;
  const paddingBottom = 42;

  const plotWidth = width - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;

  // Data ranges
  const maxTime = 36;
  const maxSurvival = 1.0;

  // Scale functions
  const getX = (t: number) => paddingLeft + (t / maxTime) * plotWidth;
  const getY = (s: number) => paddingTop + plotHeight - (s / maxSurvival) * plotHeight;

  // Group 1: AZD999 1 mg/kg (Active Treatment)
  const group1 = {
    label: 'AZD999 1 mg/kg (N=120)',
    shortLabel: 'AZD999 1 mg/kg',
    color: '#830051', // Brand magenta / raspberry
    points: [
      { t: 0, s: 1.0 },
      { t: 3, s: 0.94 },
      { t: 6, s: 0.88 },
      { t: 9, s: 0.81 },
      { t: 12, s: 0.74 },
      { t: 16, s: 0.68 },
      { t: 20, s: 0.61 },
      { t: 24, s: 0.54 },
      { t: 28, s: 0.48 },
      { t: 32, s: 0.42 },
      { t: 36, s: 0.38 },
    ],
    ciUpper: [
      { t: 0, s: 1.0 },
      { t: 3, s: 0.98 },
      { t: 6, s: 0.94 },
      { t: 9, s: 0.89 },
      { t: 12, s: 0.83 },
      { t: 16, s: 0.78 },
      { t: 20, s: 0.72 },
      { t: 24, s: 0.66 },
      { t: 28, s: 0.60 },
      { t: 32, s: 0.55 },
      { t: 36, s: 0.51 },
    ],
    ciLower: [
      { t: 0, s: 1.0 },
      { t: 3, s: 0.88 },
      { t: 6, s: 0.80 },
      { t: 9, s: 0.71 },
      { t: 12, s: 0.63 },
      { t: 16, s: 0.56 },
      { t: 20, s: 0.49 },
      { t: 24, s: 0.41 },
      { t: 28, s: 0.35 },
      { t: 32, s: 0.29 },
      { t: 36, s: 0.25 },
    ],
    censors: [4.5, 8.2, 14.1, 19.5, 23.0, 27.4, 31.8, 35.0],
    risk: [120, 112, 104, 95, 86, 75, 62, 48, 32], // at 0, 3, 6, 9, 12, 18, 24, 30, 36
    medianTime: 26.4,
    medianText: '26.4 mo (95% CI: 21.8, NE)',
  };

  // Group 2: Placebo
  const group2 = {
    label: 'Placebo (N=118)',
    shortLabel: 'Placebo',
    color: '#0284C7', // Slate / clinical blue for control
    points: [
      { t: 0, s: 1.0 },
      { t: 3, s: 0.84 },
      { t: 6, s: 0.70 },
      { t: 9, s: 0.58 },
      { t: 12, s: 0.46 },
      { t: 16, s: 0.35 },
      { t: 20, s: 0.26 },
      { t: 24, s: 0.18 },
      { t: 28, s: 0.12 },
      { t: 32, s: 0.08 },
      { t: 36, s: 0.05 },
    ],
    ciUpper: [
      { t: 0, s: 1.0 },
      { t: 3, s: 0.91 },
      { t: 6, s: 0.79 },
      { t: 9, s: 0.68 },
      { t: 12, s: 0.57 },
      { t: 16, s: 0.46 },
      { t: 20, s: 0.37 },
      { t: 24, s: 0.28 },
      { t: 28, s: 0.21 },
      { t: 32, s: 0.16 },
      { t: 36, s: 0.12 },
    ],
    ciLower: [
      { t: 0, s: 1.0 },
      { t: 3, s: 0.75 },
      { t: 6, s: 0.59 },
      { t: 9, s: 0.47 },
      { t: 12, s: 0.35 },
      { t: 16, s: 0.24 },
      { t: 20, s: 0.16 },
      { t: 24, s: 0.09 },
      { t: 28, s: 0.05 },
      { t: 32, s: 0.02 },
      { t: 36, s: 0.01 },
    ],
    censors: [5.0, 10.5, 15.2, 22.0, 29.5],
    risk: [118, 98, 81, 66, 52, 38, 19, 9, 4],
    medianTime: 11.2,
    medianText: '11.2 mo (95% CI: 8.9, 14.6)',
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
  const ticksX = [0, 3, 6, 9, 12, 18, 24, 30, 36];

  // Subgroup Analysis Data for Forest Plot
  type SubgroupItem = {
    category: string;
    subgroup: string;
    isHeader?: boolean;
    nTrt: string;
    nCtrl: string;
    hr: number;
    ciLow: number;
    ciHigh: number;
    pInt?: string;
    weight: number; // for square size
  };

  const subgroupData: SubgroupItem[] = [
    { category: 'Overall', subgroup: 'All Subjects (ITT)', isHeader: true, nTrt: '46/120 (38.3%)', nCtrl: '78/118 (66.1%)', hr: 0.54, ciLow: 0.38, ciHigh: 0.76, pInt: '—', weight: 1.0 },
    
    { category: 'Age', subgroup: 'Age Category', isHeader: true, nTrt: '', nCtrl: '', hr: 0, ciLow: 0, ciHigh: 0, weight: 0 },
    { category: 'Age', subgroup: '  < 65 years', nTrt: '28/76 (36.8%)', nCtrl: '48/72 (66.7%)', hr: 0.51, ciLow: 0.32, ciHigh: 0.81, pInt: '0.68', weight: 0.62 },
    { category: 'Age', subgroup: '  ≥ 65 years', nTrt: '18/44 (40.9%)', nCtrl: '30/46 (65.2%)', hr: 0.59, ciLow: 0.33, ciHigh: 1.05, pInt: '', weight: 0.38 },

    { category: 'Sex', subgroup: 'Sex', isHeader: true, nTrt: '', nCtrl: '', hr: 0, ciLow: 0, ciHigh: 0, weight: 0 },
    { category: 'Sex', subgroup: '  Male', nTrt: '26/68 (38.2%)', nCtrl: '44/66 (66.7%)', hr: 0.52, ciLow: 0.32, ciHigh: 0.84, pInt: '0.84', weight: 0.57 },
    { category: 'Sex', subgroup: '  Female', nTrt: '20/52 (38.5%)', nCtrl: '34/52 (65.4%)', hr: 0.56, ciLow: 0.32, ciHigh: 0.98, pInt: '', weight: 0.43 },

    { category: 'ECOG', subgroup: 'ECOG Performance Status', isHeader: true, nTrt: '', nCtrl: '', hr: 0, ciLow: 0, ciHigh: 0, weight: 0 },
    { category: 'ECOG', subgroup: '  0', nTrt: '24/70 (34.3%)', nCtrl: '42/68 (61.8%)', hr: 0.49, ciLow: 0.30, ciHigh: 0.80, pInt: '0.55', weight: 0.58 },
    { category: 'ECOG', subgroup: '  1', nTrt: '22/50 (44.0%)', nCtrl: '36/50 (72.0%)', hr: 0.60, ciLow: 0.35, ciHigh: 1.02, pInt: '', weight: 0.42 },

    { category: 'Prior Lines', subgroup: 'Prior Systemic Therapy Lines', isHeader: true, nTrt: '', nCtrl: '', hr: 0, ciLow: 0, ciHigh: 0, weight: 0 },
    { category: 'Prior Lines', subgroup: '  1 Line', nTrt: '29/80 (36.3%)', nCtrl: '53/78 (67.9%)', hr: 0.48, ciLow: 0.31, ciHigh: 0.75, pInt: '0.38', weight: 0.66 },
    { category: 'Prior Lines', subgroup: '  ≥ 2 Lines', nTrt: '17/40 (42.5%)', nCtrl: '25/40 (62.5%)', hr: 0.66, ciLow: 0.36, ciHigh: 1.21, pInt: '', weight: 0.34 },

    { category: 'Biomarker', subgroup: 'PD-L1 Expression (CPS)', isHeader: true, nTrt: '', nCtrl: '', hr: 0, ciLow: 0, ciHigh: 0, weight: 0 },
    { category: 'Biomarker', subgroup: '  CPS ≥ 1', nTrt: '25/74 (33.8%)', nCtrl: '52/70 (74.3%)', hr: 0.41, ciLow: 0.25, ciHigh: 0.67, pInt: '0.08', weight: 0.61 },
    { category: 'Biomarker', subgroup: '  CPS < 1', nTrt: '21/46 (45.7%)', nCtrl: '26/48 (54.2%)', hr: 0.78, ciLow: 0.44, ciHigh: 1.39, pInt: '', weight: 0.39 },
  ];

  // Forest Plot Scale Helper: Log scale mapping to x-coordinate
  const fpWidth = 240;
  const logMin = Math.log(0.15);
  const logMax = Math.log(3.5);
  const getFpX = (val: number) => {
    const clamped = Math.max(0.15, Math.min(3.5, val));
    const logVal = Math.log(clamped);
    return ((logVal - logMin) / (logMax - logMin)) * fpWidth;
  };

  const [activeSpatialBlock, setActiveSpatialBlock] = useState<'chart' | 'table' | 'forest'>('chart');

  // Runtime schematic mode
  if (mode === 'runtime') {
    const isChartSelected = activeSpatialBlock === 'chart';
    const isTableSelected = activeSpatialBlock === 'table';
    const isForestSelected = activeSpatialBlock === 'forest';

    return (
      <div className="flex flex-col gap-[16px] w-full text-text-primary">
        {/* Component 1: KM Plot Chart Spatial Box */}
        <div 
          className={`w-full rounded-[4px] border border-dashed bg-transparent p-[16px] cursor-pointer transition-all duration-180 ${
            isChartSelected 
              ? 'border-[#830051] shadow-[0_0_0_4px_#F4E8EE]' 
              : 'border-[#E8EAEB] shadow-none hover:border-[#830051]/50'
          }`}
          onClick={() => {
            setActiveSpatialBlock('chart');
            onBlockClick?.('Component 1: KM Plot Chart');
          }}
        >
          <div className="flex items-center justify-between mb-[16px]">
            <div className="flex items-center gap-[8px]">
              <img src={figureIconUrl} alt="" className="w-[16px] h-[16px] shrink-0" style={{ filter: filterBrand }} />
              <span className="text-[12px] font-semibold text-text-primary">Component 1: Kaplan-Meier Survival Curves</span>
            </div>
            <span className="text-[11px] text-text-secondary font-mono">Dataset: adam.adtte</span>
          </div>
          <div className="flex justify-center p-[8px]">
            <svg viewBox="0 0 300 120" className="w-full max-w-[420px] h-auto overflow-visible opacity-75">
              {/* Axes */}
              <line x1="20" y1="105" x2="280" y2="105" stroke="#D8DADA" strokeWidth="1.5" />
              <line x1="20" y1="15" x2="20" y2="105" stroke="#D8DADA" strokeWidth="1.5" />
              {/* Step lines */}
              <path d="M20 20 H60 V35 H110 V52 H170 V68 H220 V82 H280" fill="none" stroke="#830051" strokeWidth="2.5" />
              <path d="M20 20 H50 V48 H95 V70 H150 V88 H200 V98 H280" fill="none" stroke="#0284C7" strokeWidth="2" strokeDasharray="4,3" />
              {/* Median Line */}
              <line x1="20" y1="62" x2="150" y2="62" stroke="#830051" strokeWidth="1" strokeDasharray="2,2" opacity="0.6" />
              <line x1="150" y1="62" x2="150" y2="105" stroke="#830051" strokeWidth="1" strokeDasharray="2,2" opacity="0.6" />
            </svg>
          </div>
        </div>

        {/* Component 2: Risk Table Spatial Box */}
        {showRiskTable && (
          <div 
            className={`w-full rounded-[4px] border border-dashed bg-transparent p-[16px] cursor-pointer transition-all duration-180 ${
              isTableSelected 
                ? 'border-[#830051] shadow-[0_0_0_4px_#F4E8EE]' 
                : 'border-[#E8EAEB] shadow-none hover:border-[#830051]/50'
            }`}
            onClick={() => {
              setActiveSpatialBlock('table');
              onBlockClick?.('Component 2: Number at Risk Table');
            }}
          >
            <div className="flex items-center justify-between mb-[16px]">
              <div className="flex items-center gap-[8px]">
                <img src={tableIconUrl} alt="" className="w-[16px] h-[16px] shrink-0" style={{ filter: filterBrand }} />
                <span className="text-[12px] font-semibold text-text-primary">Component 2: Number at Risk Table</span>
              </div>
              <span className="text-[11px] text-text-secondary font-mono">Dataset: adam.adtte</span>
            </div>
            <table className="w-full text-center text-[10px] text-[#A6AAAA] border-collapse">
              <thead>
                <tr className="border-b border-[#E8EAEB]">
                  <th className="py-[4px] text-left text-[10px] font-medium text-text-secondary">Treatment Arm</th>
                  <th className="py-[4px]">0</th>
                  <th className="py-[4px]">6</th>
                  <th className="py-[4px]">12</th>
                  <th className="py-[4px]">24</th>
                  <th className="py-[4px]">36</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-[6px] text-left text-[#830051] font-medium">AZD999 1 mg/kg</td>
                  <td>120</td><td>104</td><td>86</td><td>62</td><td>32</td>
                </tr>
                <tr>
                  <td className="py-[6px] text-left text-[#0284C7] font-medium">Placebo</td>
                  <td>118</td><td>81</td><td>52</td><td>19</td><td>4</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Component 3: Subgroup Analysis Forest Plot Spatial Box */}
        {showSubgroupForest && (
          <div 
            className={`w-full rounded-[4px] border border-dashed bg-transparent p-[16px] cursor-pointer transition-all duration-180 ${
              isForestSelected 
                ? 'border-[#830051] shadow-[0_0_0_4px_#F4E8EE]' 
                : 'border-[#E8EAEB] shadow-none hover:border-[#830051]/50'
            }`}
            onClick={() => {
              setActiveSpatialBlock('forest');
              onBlockClick?.('Component 3: Subgroup Analysis Forest Plot');
            }}
          >
            <div className="flex items-center justify-between mb-[16px]">
              <div className="flex items-center gap-[8px]">
                <img src={barChartIconUrl} alt="" className="w-[16px] h-[16px] shrink-0" style={{ filter: filterBrand }} />
                <span className="text-[12px] font-semibold text-text-primary">Component 3: Subgroup Analysis (Forest Plot)</span>
              </div>
              <span className="text-[11px] text-text-secondary font-mono">Dataset: adam.adtte, adam.adsl</span>
            </div>
            <div className="flex flex-col gap-[6px] text-[10px] text-text-secondary">
              <div className="flex justify-between border-b border-[#EBECEC] pb-[4px]">
                <span>Subgroup (Age, Sex, ECOG, Lines, PD-L1)</span>
                <span>Hazard Ratio (95% CI)</span>
              </div>
              <div className="flex items-center justify-between py-[2px]">
                <span className="font-semibold text-text-primary">Overall (ITT)</span>
                <span className="font-mono text-text-primary">0.54 (0.38, 0.76)</span>
              </div>
              <div className="flex items-center justify-between py-[2px]">
                <span>Age &lt; 65 vs ≥ 65</span>
                <span className="font-mono">0.51 vs 0.59</span>
              </div>
              <div className="flex items-center justify-between py-[2px]">
                <span>PD-L1 CPS ≥ 1 vs &lt; 1</span>
                <span className="font-mono">0.41 vs 0.78</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full Shell View
  return (
    <div className="flex flex-col select-none font-sans w-full max-w-[800px] mx-auto text-text-primary gap-[16px]">
      {/* ================= COMPONENT 1: KM SURVIVAL PLOT ================= */}
      <div 
        className="flex flex-col w-full cursor-pointer hover:ring-1 hover:ring-[#830051]/30 p-[12px] rounded-[6px] transition-all bg-white border border-[#EBECEC]"
        onClick={(e) => {
          e.stopPropagation();
          onBlockClick?.('Component 1: KM Plot Chart');
        }}
      >
        <div className="flex items-center justify-between px-[8px] pb-[8px] border-b border-[#F0F1F1] mb-[8px]">
          <div className="flex items-center gap-[6px]">
            <img src={figureIconUrl} alt="" className="w-[14px] h-[14px]" style={{ filter: filterBrand }} />
            <span className="text-[12px] font-semibold text-text-primary">Kaplan-Meier Progression-Free Survival (PFS) Curves</span>
          </div>
          <div className="flex items-center gap-[12px] text-[11px] text-text-secondary">
            <span>Stratified Log-rank <strong className="text-text-primary">p &lt; 0.0001</strong></span>
            <span>Unstratified HR = <strong className="text-text-primary">0.54</strong> (95% CI: 0.38, 0.76)</span>
          </div>
        </div>

        {/* SVG Plot */}
        <div className="flex justify-center p-[4px] overflow-x-auto">
          <svg width={width} height={height} className="overflow-visible">
            {/* Grid Lines */}
            {gridYValues.map((val) => (
              <line
                key={val}
                x1={getX(0)}
                y1={getY(val)}
                x2={getX(maxTime)}
                y2={getY(val)}
                stroke="#F0F1F1"
                strokeWidth="1"
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
                  {val.toFixed(1)}
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
              strokeWidth="1.2"
            />
            <line
              x1={getX(0)}
              y1={getY(0)}
              x2={getX(0)}
              y2={getY(1.0)}
              stroke="#888E8E"
              strokeWidth="1.2"
            />

            {/* Axis Titles */}
            <text
              x={getX(maxTime / 2)}
              y={getY(0) + 34}
              textAnchor="middle"
              className="text-[11px] fill-text-primary font-medium"
            >
              Time from Randomization ({timeUnit})
            </text>
            
            <text
              x={getX(0) - 38}
              y={getY(0.5)}
              textAnchor="middle"
              transform={`rotate(-90, ${getX(0) - 38}, ${getY(0.5)})`}
              className="text-[11px] fill-text-primary font-medium"
            >
              Progression-Free Survival Probability
            </text>

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

            {/* Median Reference Lines */}
            {showMedianLines && (
              <>
                {/* Group 1 Median Line */}
                <line
                  x1={getX(0)}
                  y1={getY(0.5)}
                  x2={getX(group1.medianTime)}
                  y2={getY(0.5)}
                  stroke={group1.color}
                  strokeWidth="1"
                  strokeDasharray="3,3"
                  opacity="0.75"
                />
                <line
                  x1={getX(group1.medianTime)}
                  y1={getY(0.5)}
                  x2={getX(group1.medianTime)}
                  y2={getY(0)}
                  stroke={group1.color}
                  strokeWidth="1"
                  strokeDasharray="3,3"
                  opacity="0.75"
                />
                <circle cx={getX(group1.medianTime)} cy={getY(0.5)} r="3" fill={group1.color} />

                {/* Group 2 Median Line */}
                <line
                  x1={getX(0)}
                  y1={getY(0.5)}
                  x2={getX(group2.medianTime)}
                  y2={getY(0.5)}
                  stroke={group2.color}
                  strokeWidth="1"
                  strokeDasharray="3,3"
                  opacity="0.75"
                />
                <line
                  x1={getX(group2.medianTime)}
                  y1={getY(0.5)}
                  x2={getX(group2.medianTime)}
                  y2={getY(0)}
                  stroke={group2.color}
                  strokeWidth="1"
                  strokeDasharray="3,3"
                  opacity="0.75"
                />
                <circle cx={getX(group2.medianTime)} cy={getY(0.5)} r="3" fill={group2.color} />
              </>
            )}

            {/* KM Curves */}
            <path
              d={buildStepPath(group1.points)}
              fill="none"
              stroke={group1.color}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d={buildStepPath(group2.points)}
              fill="none"
              stroke={group2.color}
              strokeWidth="2.0"
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
                      strokeWidth="1.5"
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
                      strokeWidth="1.5"
                    />
                  );
                })}
              </>
            )}

            {/* Legend & Stats Overlay Box */}
            <g transform={`translate(${width - 240}, ${paddingTop + 8})`}>
              <rect
                x="0"
                y="0"
                width="225"
                height="62"
                rx="4"
                fill="#FFFFFF"
                stroke="#E8EAEB"
                strokeWidth="1"
                opacity="0.95"
              />
              <g transform="translate(10, 14)">
                <line x1="0" y1="4" x2="20" y2="4" stroke={group1.color} strokeWidth="2.5" />
                <text x="26" y="8" className="text-[10px] fill-text-primary font-medium">{group1.shortLabel}</text>
                <text x="135" y="8" className="text-[9px] fill-[#656969] font-mono">Med: 26.4 mo</text>
              </g>
              <g transform="translate(10, 34)">
                <line x1="0" y1="4" x2="20" y2="4" stroke={group2.color} strokeWidth="2" strokeDasharray="4,3" />
                <text x="26" y="8" className="text-[10px] fill-text-primary font-medium">{group2.shortLabel}</text>
                <text x="135" y="8" className="text-[9px] fill-[#656969] font-mono">Med: 11.2 mo</text>
              </g>
              <text x="10" y="54" className="text-[8.5px] fill-[#888E8E]">
                + Censored observation (vertical tick)
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* ================= COMPONENT 2: AT-RISK TABLE ================= */}
      {showRiskTable && (
        <div 
          className="w-full overflow-x-auto cursor-pointer hover:ring-1 hover:ring-[#830051]/30 p-[12px] rounded-[6px] transition-all bg-white border border-[#EBECEC]"
          onClick={(e) => {
            e.stopPropagation();
            onBlockClick?.('Component 2: Number at Risk Table');
          }}
        >
          <div className="flex items-center gap-[6px] pb-[6px] mb-[6px] border-b border-[#F0F1F1]">
            <img src={tableIconUrl} alt="" className="w-[14px] h-[14px]" style={{ filter: filterBrand }} />
            <span className="text-[12px] font-semibold text-text-primary">Number of Subjects at Risk</span>
          </div>
          <table className="w-full text-[10px] border-collapse font-sans">
            <thead>
              <tr className="border-b border-[#E8EAEB]">
                <th className="text-left font-semibold py-[4px] px-[8px] text-text-primary w-[160px]">
                  Treatment Arm
                </th>
                {ticksX.map((tick) => (
                  <th key={tick} className="text-center font-semibold py-[4px] px-[4px] text-text-secondary">
                    {tick}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#F0F1F1]">
                <td className="text-left font-medium py-[5px] px-[8px]" style={{ color: group1.color }}>
                  <span className="font-mono font-bold mr-[4px]">──</span> {group1.shortLabel}
                </td>
                {group1.risk.map((val, idx) => (
                  <td key={idx} className="text-center py-[5px] px-[4px] text-text-primary font-mono">
                    {val}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="text-left font-medium py-[5px] px-[8px]" style={{ color: group2.color }}>
                  <span className="font-mono font-bold mr-[4px]">- -</span> {group2.shortLabel}
                </td>
                {group2.risk.map((val, idx) => (
                  <td key={idx} className="text-center py-[5px] px-[4px] text-text-primary font-mono">
                    {val}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* ================= COMPONENT 3: SUBGROUP ANALYSIS FOREST PLOT ================= */}
      {showSubgroupForest && (
        <div 
          className="w-full overflow-x-auto cursor-pointer hover:ring-1 hover:ring-[#830051]/30 p-[12px] rounded-[6px] transition-all bg-white border border-[#EBECEC]"
          onClick={(e) => {
            e.stopPropagation();
            onBlockClick?.('Component 3: Subgroup Analysis Forest Plot');
          }}
        >
          <div className="flex items-center justify-between pb-[8px] mb-[8px] border-b border-[#F0F1F1]">
            <div className="flex items-center gap-[6px]">
              <img src={barChartIconUrl} alt="" className="w-[14px] h-[14px]" style={{ filter: filterBrand }} />
              <span className="text-[12px] font-semibold text-text-primary">Subgroup Analysis: Hazard Ratio for Progression-Free Survival</span>
            </div>
            <span className="text-[11px] text-text-secondary">
              Cox Proportional Hazards Model (Unstratified)
            </span>
          </div>

          <table className="w-full text-[10px] border-collapse font-sans">
            <thead>
              <tr className="border-b border-[#3C4242] text-[10px] text-text-primary font-semibold">
                <th className="text-left py-[6px] px-[6px] w-[150px]">Subgroup</th>
                <th className="text-center py-[6px] px-[4px] w-[95px]">AZD999 (n/N)</th>
                <th className="text-center py-[6px] px-[4px] w-[95px]">Placebo (n/N)</th>
                <th className="text-center py-[6px] px-[4px] w-[260px]">
                  <span>Hazard Ratio (95% CI)</span>
                  <div className="flex justify-between text-[8px] text-[#888E8E] font-normal px-[12px] pt-[2px]">
                    <span>← Favors AZD999</span>
                    <span>Favors Placebo →</span>
                  </div>
                </th>
                <th className="text-center py-[6px] px-[4px] w-[90px]">HR (95% CI)</th>
                <th className="text-right py-[6px] px-[6px] w-[60px]">P-int</th>
              </tr>
            </thead>
            <tbody>
              {subgroupData.map((item, idx) => {
                if (item.isHeader && item.hr === 0) {
                  return (
                    <tr key={idx} className="bg-[#FAFBFB] border-t border-[#EBECEC]">
                      <td colSpan={6} className="py-[4px] px-[6px] font-semibold text-text-primary text-[10px]">
                        {item.subgroup}
                      </td>
                    </tr>
                  );
                }

                const isOverall = item.category === 'Overall';
                const rowBg = isOverall ? 'bg-[#F4E8EE]/40 font-semibold' : 'hover:bg-black/5';

                return (
                  <tr key={idx} className={`border-b border-[#F0F1F1] ${rowBg} transition-colors`}>
                    <td className={`py-[5px] px-[6px] text-left text-text-primary ${isOverall ? 'font-bold text-[#830051]' : ''}`}>
                      {item.subgroup}
                    </td>
                    <td className="py-[5px] px-[4px] text-center font-mono text-[#656969] text-[9.5px]">
                      {item.nTrt}
                    </td>
                    <td className="py-[5px] px-[4px] text-center font-mono text-[#656969] text-[9.5px]">
                      {item.nCtrl}
                    </td>
                    
                    {/* SVG Forest Bar */}
                    <td className="py-[2px] px-[4px] text-center align-middle">
                      <div className="flex items-center justify-center">
                        <svg width={fpWidth} height="20" className="overflow-visible">
                          {/* Background Overall CI Band */}
                          <rect
                            x={getFpX(0.38)}
                            y="0"
                            width={Math.max(2, getFpX(0.76) - getFpX(0.38))}
                            height="20"
                            fill="#830051"
                            opacity="0.06"
                          />

                          {/* Reference vertical line at HR = 1.0 */}
                          <line
                            x1={getFpX(1.0)}
                            y1="0"
                            x2={getFpX(1.0)}
                            y2="20"
                            stroke="#B2B4B4"
                            strokeWidth="1"
                            strokeDasharray="2,2"
                          />

                          {/* Horizontal CI Whisker Line */}
                          <line
                            x1={getFpX(item.ciLow)}
                            y1="10"
                            x2={getFpX(item.ciHigh)}
                            y2="10"
                            stroke={isOverall ? '#830051' : '#3C4242'}
                            strokeWidth={isOverall ? '1.8' : '1.2'}
                          />
                          {/* Left tick */}
                          <line
                            x1={getFpX(item.ciLow)}
                            y1="7"
                            x2={getFpX(item.ciLow)}
                            y2="13"
                            stroke={isOverall ? '#830051' : '#3C4242'}
                            strokeWidth="1"
                          />
                          {/* Right tick */}
                          <line
                            x1={getFpX(item.ciHigh)}
                            y1="7"
                            x2={getFpX(item.ciHigh)}
                            y2="13"
                            stroke={isOverall ? '#830051' : '#3C4242'}
                            strokeWidth="1"
                          />

                          {/* Point Estimate Marker (Diamond for Overall, Square for subgroups) */}
                          {isOverall ? (
                            <polygon
                              points={`
                                ${getFpX(item.hr)},6 
                                ${getFpX(item.hr) + 5},10 
                                ${getFpX(item.hr)},14 
                                ${getFpX(item.hr) - 5},10
                              `}
                              fill="#830051"
                            />
                          ) : (
                            <rect
                              x={getFpX(item.hr) - (2 + item.weight * 2)}
                              y={10 - (2 + item.weight * 2)}
                              width={4 + item.weight * 4}
                              height={4 + item.weight * 4}
                              fill="#3C4242"
                              rx="0.5"
                            />
                          )}
                        </svg>
                      </div>
                    </td>

                    {/* HR Text */}
                    <td className="py-[5px] px-[4px] text-center font-mono text-text-primary text-[9.5px]">
                      {item.hr.toFixed(2)} ({item.ciLow.toFixed(2)}, {item.ciHigh.toFixed(2)})
                    </td>

                    {/* P-interaction */}
                    <td className="py-[5px] px-[6px] text-right font-mono text-[#888E8E] text-[9px]">
                      {item.pInt || ''}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Scale Axis at bottom of Forest Plot */}
          <div className="flex justify-between items-center px-[8px] pt-[8px] mt-[4px] border-t border-[#E8EAEB] text-[9px] text-text-secondary">
            <span>Log scale: 0.2, 0.5, 1.0 (Neutral), 2.0</span>
            <span className="italic">Point estimate size is proportional to subgroup sample size</span>
          </div>
        </div>
      )}
    </div>
  );
}
