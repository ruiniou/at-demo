# Shell Preview 样式与排版规范 (Shell Preview Styling Rules)

本文档记录了在 Table、Figure、Listing 视图中统一沉淀的排版规则，以及在处理复杂横向滚动和自适应时总结的核心“避坑指南”。

## 1. 业务排版与 Token 规范 (Typography & Colors)

为了确保设计稿在代码中的高保真还原，且不被 Tailwind 基础类意外覆盖，请严格使用指定的 Design System Token：

* **主标题 (Table / Figure / Listing Title)**
  * **Token**: `t-body-medium` (14px, Medium 500)
  * **Color**: `text-text-primary` (`#3F4444`)
  * *注意：切勿混用 `font-bold` 或手动设置字号，直接使用原生 Token。*
* **分析集说明 (Population)**
  * **Token**: `t-body` (14px, Normal 400)
  * **Color**: `text-text-secondary` (`#8C8F8F`)
* **外围元信息 (页眉 AstraZeneca/Page、页脚 Footnotes、副标题)**
  * **Token**: `t-small` (12px)
  * **Color**: `text-text-secondary` (`#8C8F8F`)

## 2. 核心自适应与布局机制 (Critical Layout Handling)

在处理超宽表格的横向滚动（如 Listing 和大 Table）时，为了模拟真实的 A4 纸排版体验，请**务必避免常规前端开发中的直觉性写法**，严格遵循以下两条特殊机制：

### 🚨 核心避坑 1：绝对禁止使用 `w-max` 控制外层容器
* **常见误区**：遇到横向滚动表格，前端通常会在最外层加上 `w-max` 以防止表格被压缩。
* **业务踩坑点**：在 Shell Preview 中，如果外层容器设为 `w-max`，底部的长注脚 (Footnotes) 将无法自动换行，会无限向右延伸，导致出现**“横向滚动条极长、表格右侧出现巨大留白”**的严重 Bug。
* **强制规范 (模拟 A4 排版边界)**：
  必须通过 JS 动态计算出当前表格网格的绝对像素总宽度（如 `totalTableWidth = 首列宽 + 数据列数 * 数据列宽`）。
  然后，将该宽度**反向硬编码**给包含页眉、表格、注脚的父级 Wrapper (`<div style={{ width: totalTableWidth }}>`)。
  这使得顶部 Study Info 的 `justify-between` 以及底部长注脚的文本换行，都能**严格对齐表格的左右真实物理边界**。

### 🚨 核心避坑 2：绝对禁止使用 `table-auto` 或百分比列宽
* **常见误区**：习惯性使用 `table-auto` 或百分比宽度，依赖浏览器自身的 CSS 渲染引擎分配列宽。
* **业务踩坑点**：由于外层嵌套了复杂的 Flexbox 与横向滚动容器，浏览器的 `table-auto` 计算极不稳定（曾导致表格第一列在数据切换时被无限拉长）。
* **强制规范**：
  必须使用 `table-fixed`。同时，配合 `<colgroup>` 为每一列指定**精确的绝对像素宽度**（例如首列写死 `280px`，其余数据列写死 `140px`）。这是保障跨组件视图切换时宽度不抖动的唯一方式。

## 3. 业务交互布局 (Interaction Layout)

* **居中响应规则**：
  * **侧边栏 (Metadata Panel) 关闭时**：Shell Preview 主容器整体居中显示。
  * **侧边栏打开时**：Shell Preview 必须自然左对齐，平滑让出右侧空间。
  *(前端实现层面常规处理即可，重点在于保障交互一致性)*
