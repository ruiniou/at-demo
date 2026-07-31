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
| 表格上边框 | `border-t-2 border-black` |
| 表头下边框 | `border-b-2 border-black` |
| 最后一行下边框 | `group-last:border-b-2 group-last:border-b-black` |
| 列分隔边框 | `border-r border-border-default` |
| 表头字号 | `text-[14px] leading-[20px] font-bold` |
| 单元格字号 | `text-[12px] leading-[18px]` |
| 单元格 padding | `px-[8px] py-[6px]` |

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
| 黑粗边框 | `border-black` | `#000000` |
