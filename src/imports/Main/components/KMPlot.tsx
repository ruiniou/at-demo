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

  // Full Shell View: the plot and its risk table are one static figure.
  const shellWidth = 900;
  const shellHeight = 516;
  const shellLeft = 50;
  const shellRight = 850;
  const shellTop = 15;
  const shellBottom = 355;
  const shellX = (month: number) => shellLeft + (month / 99) * (shellRight - shellLeft);
  const shellY = (survival: number) => shellBottom - survival * (shellBottom - shellTop);
  const shellGroups = [
    { label: 'Group A', color: 'var(--color-brand-1)', points: [[0, 1], [8, 1], [8, .83], [18, .83], [18, .78], [33, .78], [33, .65], [42, .65], [42, .52], [50, .52], [50, .41], [58, .41], [58, .36], [68, .36], [68, .32], [75, .32], [75, .26], [82, .26], [82, .21], [91, .21], [91, .20]] },
    { label: 'Group B', color: '#D5A442', points: [[0, 1], [6, 1], [6, .83], [19, .83], [19, .67], [33, .67], [33, .62], [40, .62], [40, .55], [55, .55], [55, .49], [64, .49], [64, .46], [77, .46], [77, .39], [88, .39], [88, .33]] },
  ] as const;
  const shellTicks = [0, 17, 33, 50, 66, 83, 99];
  return (
    <div className="w-[900px] max-w-full bg-white text-text-primary" aria-label="Kaplan-Meier plot with number at risk">
      <svg viewBox={`0 0 ${shellWidth} ${shellHeight}`} className="block w-full h-auto" role="img" aria-label="Kaplan-Meier survival curves for Group A and Group B, with number at risk below">
        {[0, .2, .4, .6, .8, 1].map((value) => (
          <g key={value}>
            <line x1={shellLeft} x2={shellRight} y1={shellY(value)} y2={shellY(value)} stroke="var(--color-border-default)" strokeWidth="1" />
            <text x={shellLeft - 8} y={shellY(value) + 4} textAnchor="end" className="fill-text-secondary text-[10px]">{Math.round(value * 100)}%</text>
          </g>
        ))}
        {shellTicks.map((tick) => (
          <text key={tick} x={shellX(tick)} y={shellBottom + 18} textAnchor="middle" className="fill-text-secondary text-[10px]">{tick}</text>
        ))}
        <text x={(shellLeft + shellRight) / 2} y={shellBottom + 42} textAnchor="middle" className="fill-text-primary text-[11px]">Time ({timeUnit})</text>
        {shellGroups.map((group) => (
          <polyline key={group.label} points={group.points.map(([month, survival]) => `${shellX(month)},${shellY(survival)}`).join(' ')} fill="none" stroke={group.color} strokeWidth="2" strokeLinejoin="miter" />
        ))}
        {shellGroups.map((group, index) => (
          <g key={group.label} transform={`translate(${shellRight - 115}, ${shellTop + 20 + index * 20})`}>
            <line x1="0" x2="16" y1="0" y2="0" stroke={group.color} strokeWidth="2" />
            <text x="22" y="4" className="fill-text-primary text-[10px]">{group.label}</text>
          </g>
        ))}
        {showRiskTable && (
          <g>
            <line x1="0" x2={shellWidth} y1="424" y2="424" stroke="var(--color-border-default)" strokeWidth="1" />
            <text x="0" y="440" fill="var(--color-text-primary)" className="text-[10px]">Number at</text>
            <text x="0" y="452" fill="var(--color-text-primary)" className="text-[10px]">risk</text>
            {shellTicks.map((tick) => <text key={tick} x={shellX(tick)} y="440" textAnchor="middle" fill="var(--color-text-secondary)" className="text-[10px]">{tick}</text>)}
            <text x="0" y="474" fill="var(--color-brand-1)" className="text-[10px]">Group A</text>
            {[39, 32, 21, 16, 11, 10, 10].map((value, index) => <text key={index} x={shellX(shellTicks[index])} y="474" textAnchor="middle" fill="var(--color-brand-1)" className="text-[10px]">{value}</text>)}
            <text x="0" y="496" fill="#D5A442" className="text-[10px]">Group B</text>
            {[30, 28, 26, 20, 17, 14, 14].map((value, index) => <text key={index} x={shellX(shellTicks[index])} y="496" textAnchor="middle" fill="#D5A442" className="text-[10px]">{value}</text>)}
          </g>
        )}
      </svg>
    </div>
  );
}
