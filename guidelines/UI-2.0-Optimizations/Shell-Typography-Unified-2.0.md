# Shell Preview 统一排版规范 2.0

> 更新日期：2026-07-31  
> 适用范围：Table / Listing / Figure 三种 Shell Preview 视图的头部、尾部、数据表格排版

---

## 1. Panel Header（工具栏标题行）

所有视图统一使用：

```
t-small text-text-primary truncate
```

| 属性 | 值 |
|------|-----|
| Font Family | Inter (via `--font-body`) |
| Font Size | 12px |
| Font Weight | 400 |
| Line Height | 18px |
| Color | `text-text-primary` (`#3F4444`) |
| Overflow | `truncate` |

---

## 2. Study Info & Page Info

```
t-body text-[12px] leading-[18px] text-text-secondary
```

| 属性 | 值 |
|------|-----|
| Font Family | Inter |
| Font Size | 12px |
| Line Height | 18px |
| Color | `text-text-secondary` (`#8C8F8F`) |
| Study Info | 左对齐，允许 `whitespace-pre-wrap` 换行 |
| Page Info | 右对齐 |
| 容器 | `flex justify-between items-end w-full mb-[24px]` |

---

## 3. Title Block

### Title / Number

```
t-body text-[14px] leading-[20px] font-bold text-center tracking-[-0.01em]
```

| 属性 | 值 |
|------|-----|
| Font Family | Inter |
| Font Size | 14px |
| Font Weight | 700 (`font-bold`) |
| Line Height | 20px |
| Letter Spacing | -0.01em |
| Color | 继承 `text-black` / `text-text-primary` |
| 对齐 | 居中 |

### Subtitle / Population

```
t-body text-[12px] leading-[18px] text-text-secondary text-center
```

| 属性 | 值 |
|------|-----|
| Font Size | 12px |
| Line Height | 18px |
| Color | `text-text-secondary` |
| 对齐 | 居中 |

---

## 4. Footnotes（尾部脚注）

```
t-body text-[12px] leading-[18px] text-text-secondary whitespace-pre-wrap
```

| 属性 | 值 |
|------|-----|
| Font Size | 12px |
| Line Height | 18px |
| Color | `text-text-secondary` |
| 上边距 | `mt-[16px]` |
| 行间距 | `gap-[4px]` |
| 对齐 | 左对齐 |
| 换行 | `whitespace-pre-wrap` |

---

## 5. 数据表格

### 通用样式（Table & Listing 共用）

| 区域 | 样式 |
|------|------|
| 表格上边框 | `border-t-2 border-text-primary` |
| 表头下边框 | `border-b-2 border-text-primary` |
| 最后一行下边框 | `group-last:border-b-2 group-last:border-b-text-primary` |
| 列分隔边框 | `border-r border-border-default` |
| 表头字号 | `t-table font-bold`（见下方「表头 Token」） |
| 单元格字号 | `text-[12px] leading-[18px]` |
| 单元格 padding | `px-[8px] py-[6px]` |

### 表头 Token（全项目统一）

所有表头标题统一使用 `small/text/table` token，并叠加 `font-bold` 保留层级：

```
t-table font-bold
```

| 属性 | 值 | 来源 |
|------|-----|------|
| Font Family | Inter (via `--font-body`) | `fontFamily.body` |
| Font Size | 13px | `fontSize.base` |
| Font Weight | 700 (`font-bold` 叠加) | 覆盖 token 默认 400 |
| Line Height | 16px | `lineHeight.16px` |

> **为何叠加 `font-bold`：** `t-table` token 默认 `font-weight: 400`。表头若直接使用会与单元格字重相同，仅靠 1px 字号差无法建立层级，因此必须叠加 `font-bold`。
>
> **与单元格的关系：** Shell Preview 单元格保持 `text-[12px] leading-[18px]`（12px/400）。表头 13px/700 与单元格 12px/400 通过**字重**建立主要层级，字号差为辅。

#### `t-table` 的消费方

`t-table` 共有两个消费方，**表头一律 Bold（700）**：

| 消费方 | 位置 | 表头 | 单元格 |
|--------|------|------|--------|
| Shell Preview | Table 4 处 + Listing 2 处 | 13px / **700** | 12px / 400（不使用 `t-table`） |
| Markdown 表格 | AI 聊天区（`MarkdownTable`） | 13px / **700** | 13px / 400 |

> Markdown 表格表头原为 `font-semibold`（600），受 TBD-1 影响实际渲染为 400，与单元格无视觉差别。现已统一为 700。
>
> Markdown 表格的单元格与表头**同为 13px**，层级仅靠字重区分；Shell Preview 则为字号 + 字重双重区分。
>
> **不使用 `t-table` 的表头：** Figure 的 At-risk 表头字号为 10px（从图表容器继承），不属于本 token 范围，不受此规则约束。

#### 当前实现方式（临时）

由于下方 TBD-1 描述的 CSS 分层问题，`font-bold` 工具类目前**无法**覆盖 `t-table`。因此所有 10 处表头（Shell Preview 6 处 + Markdown 表格 4 处）均额外附加内联样式：

```jsx
style={{ fontWeight: 700 }}
```

待 TBD-1 解决后，应移除这些内联样式，回归到纯工具类实现。

#### Listing 表头的特殊处理

Listing 屏幕表头标题包在 `<button>` 内（用于点击打开 Metadata）。`theme.css` 的 `@layer base` 中存在：

```css
button { font-size: var(--text-base); font-weight: 500; line-height: 1.5; }
```

该规则**直接命中** `<button>`，优先级高于从 `<th>` 的**继承**，会将标题渲染为 500 字重 / 19.5px 行高。因此 button 上必须显式声明完整三项：

```jsx
style={{ fontWeight: 700, fontSize: '13px', lineHeight: '16px' }}
```

> ⚠️ 任何包在 `<button>` / `<label>` / `<input>` 内的表格文本都会遇到同类问题，不能仅靠父元素继承。

### Table 独有

| 区域 | 样式 |
|------|------|
| 列分组头背景 | `bg-bg-panel` |
| 列分组头字重 | `font-semibold` |
| 标准列头颜色 | `text-text-secondary` |

### Listing 独有

| 区域 | 说明 |
|------|------|
| 冻结列 | `sticky` 定位，右侧 `boxShadow` 分割 |
| 分页线 | 通过 `pageBreakColumns` 管理 |
| 列宽 | 固定 px，由 `listingColumns` 定义 |
| 表头列宽/排版 | **请勿修改** — 由交互逻辑决定 |

---

## 6. 内容容器

| 属性 | Table / Listing | Figure |
|------|----------------|--------|
| 外层 padding | `p-[24px]` | `p-[24px]` |
| 内容宽度 | `w-max`（自然宽度） | `w-full max-w-[90%]`（比例自适应） |
| 居中逻辑 | Metadata 关闭时 `mx-auto` | Metadata 和 RTF 都关闭时 `mx-auto` |
| 滚动行为 | `overflow-auto scrollbar-code` | `overflow-y-auto overflow-x-hidden scrollbar-code` |

---

## 7. 颜色 Token 规范

> **禁止硬编码颜色值。** 所有颜色必须使用 Design Token。

| 用途 | Token | 色值 |
|------|-------|------|
| 主文本 | `text-text-primary` | `#3F4444` |
| 次文本 | `text-text-secondary` | `#8C8F8F` |
| 边框 | `border-border-default` | `#D9DADA` |
| 面板背景 | `bg-bg-panel` | `#F8F7F7` |
| 品牌色 | `text-brand-1` | `#830051` |
| 表格粗边框 | `border-text-primary` | `#3F4444` |

> **禁止纯黑：** 不得使用 `text-black` / `border-black`（`#000000`）。表格的三道 2px 粗边框（顶 / 表头下 / 末行下）使用 `border-text-primary`，文本使用 `text-text-primary`。
>
> 例外：hover 底色与阴影等**半透明黑**（如 `bg-black/[0.03]`、`rgba(0,0,0,0.08)`）属于效果层，不在此限制内。

### 行头层级配色（Table）

表格第一列（行头）按层级区分颜色，右侧数值列**不随行头变色**：

| 层级 | 示例 | 行头颜色 | 数值颜色 |
|------|------|---------|---------|
| Parent 级（无缩进） | `Age (years)`、`Sex` | `text-text-primary` | `text-text-primary` |
| 非 Parent 级（有缩进） | `n`、`Mean`、`SD`、`Median` | `text-text-secondary` | `text-text-primary` |

> 所有非 Parent 级统一为 `text-text-secondary`，缩进更深不再继续降低层级。

---

## 8. 待解决问题（TBD）

### TBD-1：`globals.css` 未分层导致 `t-*` token 无法被工具类覆盖

**优先级：** 中（当前已有内联样式绕过，不阻塞）

**现象：** 在元素上同时使用 `t-table` 和 `font-bold` 时，`font-bold` 不生效，实际渲染为 `font-weight: 400`。

**根因：** `src/styles/index.css` 的引入顺序为：

```css
@import './fonts.css';
@import './tailwind.css';   /* Tailwind 工具类在 @layer utilities 内 */
@import './theme.css';
@import './globals.css';    /* t-* 类定义，无 @layer 包裹 */
```

`globals.css` 中的 `.t-*` 类**未包在任何 `@layer` 内**。根据 CSS Cascade Layers 规范，unlayered 样式的优先级**高于所有 `@layer`**。因此在同为单类选择器的情况下，`.t-table { font-weight: 400 }` 会击败 `@layer utilities` 内的 `.font-bold`，与它们在文件中的先后顺序无关。

**影响范围：** 全项目所有同时使用 `t-*` token 和 Tailwind 排版工具类（`font-*`、`text-[Npx]`、`leading-*`）的位置，不仅限于 Shell Preview。

**建议方案：** 将 `globals.css` 的排版类包进 `@layer components`：

```css
@layer components {
  .t-table { ... }
  .t-body { ... }
  /* … */
}
```

这样 `@layer utilities` 优先级更高，工具类可正常覆盖 token。

**风险：** 为全局改动，需回归全部使用 `t-*` 的页面。部分位置可能已**依赖**当前的错误优先级（即本意希望工具类生效、但实际被 token 覆盖后反而符合预期），修复后这些地方的渲染会发生变化。

**修复后需同步清理：** 本文§5「当前实现方式（临时）」中的 10 处 `style={{ fontWeight: 700 }}` 内联样式（`Main.tsx` 6 处 + `MarkdownTable.tsx` 4 处）。

> 注：Listing button 上的内联样式是**独立问题**（`@layer base` 的 button 规则直接命中 vs 继承），不会因 TBD-1 修复而自动解决，需保留。
