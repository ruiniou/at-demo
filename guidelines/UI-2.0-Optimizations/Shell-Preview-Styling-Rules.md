# Shell Preview Styling Rules

**What it is:** Shell Preview 视图（Table、Figure、Listing）的统一排版、颜色与自适应规范。
**Scope:** AI Copilot 的 Shell Preview 容器及其内部内容渲染。
**Date:** 2026-07-31

## 1. 业务排版与 Token 规范 (Typography & Colors)

| 元素 | Token | Color | 规则细节 |
|---|---|---|---|
| **主标题 (编号)** | `t-body-medium` (14px) | `text-text-primary` | 切勿混用 font-bold，仅显示编号 (如 Table 14.1.1)。 |
| **正文数据内容** | `t-small` 或继承 | `text-text-primary` | 表格内部数据、Figure图表内容本身保持深色高对比度。 |
| **副标题及上下文** | `t-small` (12px) | `text-text-secondary` | 除大标题和图表正文以外的所有说明文字一律强制降维为 Secondary。包含：副标题、分析集说明 (Population)、页眉、页脚、子标题。 |

## 2. 核心自适应与布局机制 (Layout Handling)

### A. 横向滚动与 A4 纸排版 (Table / Listing)

遇到超宽表格的横向滚动时，必须严格通过硬编码像素宽度模拟真实的 A4 纸排版体验。

* **Do**:
  * 通过 JS 动态计算出当前表格网格的绝对像素总宽度。
  * 将该宽度反向硬编码给包含页眉、表格、注脚的父级 Wrapper (`<div style={{ width: totalTableWidth }}>`)。
  * 使用 `table-fixed`。
  * 配合 `<colgroup>` 为每一列指定精确的绝对像素宽度。

* **Don't**:
  * 绝对禁止在外层容器使用 `w-max` 控制外层容器，这会导致底部的长注脚无法自动换行。
  * 绝对禁止使用 `table-auto` 或百分比列宽，这会导致跨视图切换时宽度严重抖动。

### B. 图表响应与缩放 (Figure Zoom Logic)

* **Do**:
  * **默认状态 (100%)**：Figure 外壳必须使用 `w-full`，自适应拉伸填满屏幕。不触发默认横向滚动条。
  * **放大状态 (>100%)**：自动切换为 `min-w-max`，允许被放大的图表撑破屏幕并触发横向滚动条。
  * `transform: scale` 必须绑定在包裹白纸的中介容器上（即带有 padding 的外壳容器），确保 Padding 同步缩放不越界。

* **Don't**:
  * 绝对禁止将 `transform: scale` 直接绑定在白纸容器上。

## 3. 业务交互与间距 (Interaction & Spacing)

* **Do**:
  * **居中**: 侧边栏关闭时，Shell Preview 内部的白纸容器整体居中显示 (`mx-auto`)；侧边栏打开时，平滑让出右侧空间。
  * **背景与边界**: 外层容器统一使用 `bg-graphite-15` (`#E6E8E8`)，内部“白纸”统一 `bg-white p-[16px] rounded-[4px]`。顶部工具条需增加 `border-b border-graphite-10` 分界线。
  * **纵向留白**: Header (Study Info) 到大标题距离严格为 `16px`；大标题/副标题区到底部图表区距离严格为 `12px`；标题块内部主副标题间距为 `gap-[4px]`。

* **Don't**:
  * 严禁在白纸容器上使用任何阴影 (`shadow`)，强制要求极简扁平切割。
