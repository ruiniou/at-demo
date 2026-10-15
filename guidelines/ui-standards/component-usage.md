# 组件用途速查

定义：在编写页面前，按用途和交互选择现有 UI 组件的检索入口。
范围：`src/components/ui` 中易混用的组件，以及 `src/imports/Main/components` 中的 Dashboard 组件。
日期：2026-10-15。

## 编码前先匹配用途

1. 将页面元素归类为展示、动作、导航、选择、输入或数据概览；先判断它是否真的支持点击、悬停和键盘操作。
2. 查下表、组件 props、相关规范和产品中的同类页面。没有匹配的组件时先记录缺口，再决定是否扩展组件。
3. 参考 HTML 或截图用于确认内容、信息层级和布局；其标签名、Hover 和控件形态不自动成为 Atlas 的组件规范。
4. 沿用组件自身的圆角、字号、间距和状态，不在页面调用处覆盖内部样式来凑参考图。

## 组件匹配表

| 需求 | 组件与适用场景 | Do | Don't | 源码 / 相关规范 |
| --- | --- | --- | --- | --- |
| Owner、Current、TA 等说明性标签 | 不传 `onClose` 的 `Tag` | 作为文本展示；悬停时背景保持不变 | 添加点击、手型光标或暗示操作的 Hover | `src/components/ui/Tag.tsx` |
| 可移除的已选值 | 带 `onClose` 的 `Tag`；分组变量使用启用 `onRemoveItem` 的 `GroupTag` | 显示移除入口及对应反馈 | 用可移除标签展示只读元数据 | `src/components/ui/Tag.tsx` |
| 表格、菜单或页面中的人员身份 | `Avatar` 搭配姓名，按容器选择 `level` | 表格用 `modal`，选项用 `menu`；只读姓名保持文本语义 | 没有真实导航需求时把头像或姓名做成链接 | `src/components/ui/Avatar.tsx`；`avatar.md` |
| 产品操作 | 按语义选择 `Button` 的 variant 和 size | 主要的可用操作用 primary；图标按钮必须有真实操作和可访问名称 | 用 Button 承载说明文字、数字或纯装饰图标 | `src/components/ui/Button.tsx` |
| 已应用的筛选或紧凑选择入口 | `FilterChip`；筛选用 `variant="filter"`，中性选择用 `variant="select"` | 按用途选变体，并提供真实选择行为 | 把静态日期或只读 Tag 一律做成筛选器 | `src/components/ui/FilterChip.tsx` |
| 互斥视图或模式 | `SegmentedControl`，按容器选 `size` | 紧凑面板用 `panel`，紧凑表单用 `sm`，较大的视图切换用 `lg` | 用于独立筛选、页面导航或无关操作 | `src/components/ui/SegmentedControl.tsx` |
| 文本搜索 | `SearchBar`；独立页面搜索用 default，紧凑工具栏或下拉内搜索用 embedded | 根据容器关系选择 `variant`，根据高度选择 `size` | 在调用处覆盖圆角以模仿另一控件 | `src/components/ui/SearchBar.tsx`；`dropdown.md` |
| 浮层菜单或选择列表 | `Popover` 配对应的选项行或菜单行 | 选值使用选择语义，执行操作使用菜单语义；沿用共享浮层样式 | 把 Popover 当成完整下拉组件，或额外添加单页阴影 | `src/components/ui/Popover.tsx`；`dropdown.md` |
| Dashboard 指标 | `MetricCard` | 标题、数值、副文本和图标含义一致；只有真实目的地或筛选行为才传 `onClick` | 仅因参考 HTML 看起来可点就增加导航或 Hover | `src/imports/Main/components/DashboardPrimitives.tsx` |
| Dashboard 表格 | `DashboardTable` | 对照 Projects & Studies、Events 的字号和密度；仅指定列可排序，排序图标预留空间 | 随意给成员姓名加链接，或让所有列都可排序 | `src/imports/Main/components/DashboardPrimitives.tsx` |
| Dashboard 页面框架 | `DashboardFrame` | Study、Event 详情页显示 Close；Home Tree List 收起时保留展开入口 | 给一级菜单 Usage 添加 Close | `src/imports/Main/components/DashboardPrimitives.tsx` |

## 生成前检查

- 每个选用组件都能说明用途、交互、变体和可对照的现有页面；说不清时先检查产品现状。
- 在写新布局前，对照最近似页面的标题层级、字号、内边距和表格密度。
- 参考图的视觉相似性不能授权新增链接、Hover、排序、按钮或导航路径。
