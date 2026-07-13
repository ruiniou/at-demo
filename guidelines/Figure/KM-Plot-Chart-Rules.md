# KM Plot — Chart Generation Rules

> For use by Antigravity to generate Shell Preview and Runtime chart components.
> Colors and typography inherit from the existing design system — do not hardcode values.

---

## 1. Data Mode

| Mode | Data Source | Purpose |
|---|---|---|
| **Shell Preview** | Mock data (randomly generated) | Placeholder shown in Shell design before SAS runs |
| **Runtime** | Real SAS output | Actual result rendered after code execution |

The component layout and style rules are **identical** in both modes.
The only difference is where data comes from.

### Mock Data Generation (Shell Preview only)

```ts
// Generate one KM curve per group
function generateMockCurve(groupIndex: number): Point[] {
  const points: Point[] = [{ t: 0, s: 1.0 }]
  let t = 0, s = 1.0
  const steps = randomInt(8, 12)
  for (let i = 0; i < steps; i++) {
    t += randomInt(5, 15)
    s *= random(0.75, 0.95)
    points.push({ t, s })
  }
  return points  // s ends between ~0.2–0.6
}

// Censor marks: 1–2 random points per interval, s stays flat
// CI bands: ±random(0.05, 0.10) around each s value, clamped to [0, 1]
// Risk table numbers: start random(20, 40), decrease by random(2, 6) each column
```

---

## 2. Component Structure

```
<KMPlot>
  ├── <Title>               // Figure title + subtitle
  ├── <PlotArea>
  │     ├── <GridLines>
  │     ├── <CIBands>       // optional
  │     ├── <KMCurves>
  │     ├── <CensorMarks>   // optional
  │     ├── <MedianLines>   // optional
  │     ├── <XAxis>
  │     ├── <YAxis>
  │     └── <Legend>
  └── <RiskTable>           // optional
```

---

## 3. Layout & Spacing

All spacing values reference design system tokens. Use `spacing.md` or `spacing.lg` as the base unit — do not hardcode pixel values.

```
Outer frame:
  width:   container width (fluid)
  padding: spacing.lg on all sides

Plot area:
  left offset:   enough for Y-axis labels (~15% of width)
  right offset:  spacing.lg
  top offset:    spacing.md (below title)
  bottom offset: enough for X-axis labels (~48px equivalent)

Plot area height: fixed at a comfortable reading height (~340px equivalent).
                  Do not shrink below this.

If RiskTable is shown:
  gap between PlotArea bottom and RiskTable top: spacing.md
```

---

## 4. KM Curves

```
Shape:    Step function (horizontal then vertical segments)
          For each adjacent pair (t_i, s_i) → (t_{i+1}, s_{i+1}):
            Draw horizontal: (t_i, s_i) → (t_{i+1}, s_i)
            Draw vertical:   (t_{i+1}, s_i) → (t_{i+1}, s_{i+1})

Stroke:   color.chart.line[groupIndex]   // from design system
          strokeWidth: border.width.md

Fill:     none
```

---

## 5. Confidence Interval Bands (optional)

```
Shape:  Closed polygon — upper boundary (left→right) + lower boundary (right→left)
Fill:   color.chart.line[groupIndex] at opacity 15–20%
Stroke: none
```

---

## 6. Censor Marks (optional)

```
Shape:   Short vertical tick on the curve at each censor time point
         Height: ~8px equivalent, centered on the curve
Stroke:  color.chart.censor   // design system token
         strokeWidth: border.width.sm
```

---

## 7. Median Reference Lines (optional)

```
Trigger: drawn only when curve crosses s = 0.5

Shape:
  Horizontal dashed line: from Y-axis to the crossing point at s=0.5
  Vertical dashed line:   from the crossing point down to X-axis

Style:
  stroke:      color.chart.line[groupIndex]
  strokeWidth: border.width.sm
  dashArray:   [3, 3]
  opacity:     70%
```

---

## 8. Axes

### X-Axis

```
Line:   full width of plot area, bottom edge
        stroke: color.border.default

Ticks:  6 evenly spaced
        Tick line height: 4px
        stroke: color.border.default

Labels: formatted time values (e.g. 0, 10, 20...)
        typography: text.xs / text.secondary

Title:  "Time ({unit})"  — unit = Days | Weeks | Months
        typography: text.sm / text.primary
        position: centered below X-axis
```

### Y-Axis

```
Line:   full height of plot area, left edge
        stroke: color.border.default

Ticks:  0.0 / 0.2 / 0.4 / 0.6 / 0.8 / 1.0
Labels: decimal format (Shell) or percentage format (Runtime)
        typography: text.xs / text.secondary

Title:  "Survival Probability"
        typography: text.sm / text.primary
        rotated -90°, centered on Y-axis
```

---

## 9. Grid Lines

```
5 horizontal lines at s = 0.2 / 0.4 / 0.6 / 0.8 / 1.0
stroke:    color.border.subtle
strokeWidth: border.width.hairline
dashArray: [4, 4]
```

---

## 10. Legend

```
Position:
  1–2 groups → top-right corner inside plot area
  3 groups   → bottom center, below plot area

Each item:
  [line swatch 24px wide] [group label]
  swatch stroke: color.chart.line[groupIndex], strokeWidth: border.width.md

Typography: text.sm / text.primary
Item spacing: spacing.sm (vertical) or spacing.md (horizontal)
```

---

## 11. Risk Table (optional)

```
Columns: match X-axis tick positions (6 columns)
Rows:    1 header row + 1 row per group

Header row:
  label:      "Number at Risk"
  background: color.surface.subtle
  typography: text.sm / bold / text.primary

Data rows:
  Left label:  group name, color: color.chart.line[groupIndex], bold
  Cell values: numbers, centered
               typography: text.sm / text.primary

Row dividers: color.border.subtle, hairline stroke
Column alignment: center
```

---

## 12. Title Area

```
Line 1 (Figure title):
  Shell:   "[Figure Title]"   — italic, color: text.secondary
  Runtime: actual title text  — regular weight, color: text.primary
  typography: text.lg / bold

Line 2 (Figure number):
  content:    "Figure X.X"
  typography: text.sm / text.secondary

Position: top of component, left-aligned or centered (follow design system page layout)
```

---

## 13. Props Interface

```ts
interface KMPlotProps {
  mode: 'shell' | 'runtime'

  // Data
  groups: {
    label: string
    curve: { t: number; s: number }[]
    ciUpper?: { t: number; s: number }[]
    ciLower?: { t: number; s: number }[]
    censorPoints?: { t: number; s: number }[]
    riskCounts?: number[]   // one value per X-axis tick
  }[]

  // Config
  timeUnit: 'Days' | 'Weeks' | 'Months'
  showCI: boolean
  showCensorMarks: boolean
  showMedianLines: boolean
  showRiskTable: boolean

  // Labels
  title?: string
  figureNumber?: string
}
```

> In `shell` mode, ignore all data props and generate mock data internally using the rules in Section 1.
