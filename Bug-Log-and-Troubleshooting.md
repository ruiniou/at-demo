# Bug 记录与排查指南 (Bug Log & Troubleshooting)

这份文档旨在记录项目开发过程中遇到的重大或典型的 Bug，并沉淀解决思路，方便后续复盘与查阅。同时，文档开篇提供了一份“向 AI 提交 Bug”的最佳实践指南，以提高我们结对编程解决问题的效率。

---

## 💡 如何更好地向 AI 描述 Bug？

在遇到问题时，如果你能提供以下维度的信息，将能极大帮助我（AI）在第一次回答时就精准定位问题：

1. **预期行为 vs. 实际行为**：
   * *预期*：向右滚动时，冻结的列应该像一堵墙一样挡住后面的列。
   * *实际*：第三列从底部穿出，覆盖在了第五列上。
2. **触发条件与边界（非常关键）**：
   * 比如：“冻结 1-3 列时没问题，**一旦超过 3 列**就会出现错位”。这种“阈值”信息能直接引导我去排查**累积误差**或特定循环索引的问题。
3. **视觉特征描述**：
   * 如果是 UI/排版问题，描述一些视觉关键字，如：“被截断 (clipped)”、“穿透 (overlap)”、“背景变透明了”、“边框消失了”、“挤在一堆”。这些词能让我立刻联想到 `z-index`、`overflow`、`border-collapse` 或 `width` 计算等特定的 CSS 机制。
4. **配合截图/视频**：
   * 像你之前提供截图一样，对于布局和视觉 Bug，截图胜过千言万语，能让我直观看到 DOM 树可能存在的渲染层级问题。

---

## 📝 重大 Bug 复盘记录

### 记录格式参考
* **日期**：[YYYY-MM-DD]
* **Bug 简述**：一句话描述问题表现
* **现象与触发条件**：具体的错误表现
* **根本原因 (Root Cause)**：为什么会发生这个错误
* **解决方案 (Solution)**：最终如何修复的
* **经验教训 (Takeaways)**：从中学到了什么

---

### [2026-06-30] `position: sticky` 冻结列水平滚动时的重叠与穿透错位

* **现象与触发条件**：
  在设置表格水平滚动的固定列（冻结列）时，如果冻结的列数较少（1-3列），滚动基本正常；但当冻结列数增多（如4列），向右滑动时，靠后的冻结列（如第三列）会越界从底部穿出，覆盖在后续的正常列之上，且列的右侧边框（stroke）会消失。
* **根本原因 (Root Cause)**：
  1. **布局约束失效**：表格 `<table>` 配置了 `w-max` (max-content)，导致 `table-layout: fixed` 无法严格限制列宽。当遇到类似 "Geographical region/..." 的长文本时，单元格的实际渲染宽度会被长文本撑开，大于代码中配置的 `widthPx`。
  2. **累积误差**：表格使用了 `border-collapse: collapse`（边框折叠）。相邻单元格共用边框会导致浏览器渲染列宽时吃掉亚像素（0.5px - 1px）。
  3. **定位计算偏移**：控制冻结列的 CSS `left` 偏移量 `getFrozenLeft()` 纯粹是通过简单的数学累加 `widthPx` 得来的。当**实际渲染宽度 > 静态计算的 `left` 定位**时，就出现了后面的列在布局上还没走完，但前一列的 `left` 已经强行把它定位在了半中间，最终导致重叠和越界穿透。
* **解决方案 (Solution)**：
  1. 在 JS 中计算出所有列 `widthPx` 的确切总和（`totalListingWidth`），并将其作为强制的像素 `width` 赋予 `<table>`。在有了明确的绝对宽度后，`table-layout: fixed` 就能百分百压制内部内容，严格遵守每个 `<col>` 的宽度，阻止长文本偷偷撑宽列。
  2. 将表格的合并边框改为分离边框：`border-separate border-spacing-0`。并将原本 `<tr>` 上的底边框样式拆解下放到了每个独立的 `<th>` 和 `<td>` 上。从而彻底消除了边框折叠带来的像素累积误差。
* **经验教训 (Takeaways)**：
  处理包含长文本的自定义 `sticky` 表格时，绝不能依赖浏览器的自适应列宽机制。必须通过**独立边框 (border-separate)** 和 **强行指定外层表格总宽度**，才能确保 JS 计算的偏移量与 DOM 渲染的尺寸做到完美的像素级对齐。


---

### [2026-07-16] 局部状态下沉导致的 ReferenceError 白屏崩溃

* **现象与触发条件**：
  在最近加入 Figure RTF Preview 功能时，点击主页的“Event”卡片或侧边树的“Figure”节点后，界面完全白屏（崩溃）。这是由于 React 渲染在遇到致命错误且没有局部 ErrorBoundary 捕获时，卸载了整棵组件树。
* **根本原因 (Root Cause)**：
  在 `ShellPreview` 组件内增加控制 RTF 展开的 `rtfOpen` 逻辑时，我错误地在 TypeScript 的 Props 接口中添加了 `rtfOpen?: boolean`，但**在实际函数参数解构中遗漏了它**。
  因此，组件内部引用的 `rtfOpen` 是 `undefined` 且未声明（Undeclared）。当执行到 `{rtfOpen && (...) }` 时，触发了 `ReferenceError: rtfOpen is not defined`，导致组件渲染崩溃。由于打包工具 (Vite/esbuild) 默认只做类型剥离，不抛出强类型错误，构建阶段也没有暴露出这个致命问题。
* **解决方案 (Solution)**：
  1. 将 `rtfOpen` 的状态从组件局部状态提升 (Hoist) 到了外层的 `WorkspaceContent` 中进行统一管理，并将 `rtfOpen` 和控制开关的 `onToggleRtf` 作为 Props 正确传递并解构到 `ShellPreview` 中。
  2. 利用提升后的 `rtfOpen` 状态，传递 `hideToolbar={docType === 'figure' && rtfOpen}` 给同级的 `CodePanel` 组件，实现了需求中“切到 RTF Preview 时隐藏 CodePanel 右侧工具条”的跨组件联动控制。
* **经验教训 (Takeaways)**：
  1. TypeScript 中定义了 Interface 不代表运行时有解构该变量。要确保解构的完整性。
  2. **Vite 的默认 `npm run build` 不包含 Type Check！** 它只会剥离类型。在需要严格检查时，应配置 `tsc --noEmit` 进行类型验证。
  3. 当需要跨并级组件（`ShellPreview` 和 `CodePanel`）联动状态时，不要在内部随意 `useState`，要及时将状态提升到共同的最近父节点，或者使用 Context/状态管理。

---

### [2026-07-20] 布局组件间异步 ResizeObserver 触发的闭环状态震荡与白屏崩溃 (Maximum update depth exceeded)

* **现象与触发条件**：
  当用户点击悬浮的 AI Copilot 按钮以打开 AI 面板时，如果屏幕剩余空间有限，页面会瞬间崩溃并呈现完全白屏。
* **根本原因 (Root Cause)**：
  1. **空间不足触发折叠**：当 AI 面板展开（占用 360px）导致其余主面板（Code / Shell）宽度低于其设定的 Minimum 约束时，系统会触发自动收起左侧 `TreeList` 导航树的动作 (`setTreeListOpen(false)`)。
  2. **Resize 触发与状态滞后**：`TreeList` 收起后，DOM 重排释放了其原本占用的空间，右侧主内容区（由 `contentAreaRef` 绑定）宽度增加，随后异步触发 `ResizeObserver` 回调以更新 `contentAreaWidth`。
  3. **竞态震荡 (Race Condition State Jitter)**：在 `TreeList` 变为 `false` 的那一瞬间，React 触发了重新渲染，但此时 `ResizeObserver` 尚未运行完（`contentAreaWidth` 依然是旧的小宽度）。这就导致 `useEffect` 在这一帧中认为可用空间依旧极度匮乏，转而开始强行压缩 AI 面板宽度（`setAiCopilotWidth` 变小）。
  4. **震荡死锁**：在下一帧中，`ResizeObserver` 完成回调使 `contentAreaWidth` 变大，`useEffect` 发现空间重新变得富余，从而又将 `TreeList` 重新展开 (`setTreeListOpen(true)`)。展开后 `contentAreaWidth` 再次缩小，再次触发折叠。
  由此，`treeListOpen` 在 `true` 和 `false` 之间陷入永无止境的死循环，最终耗尽 React 调用栈抛出 `Maximum update depth exceeded` 崩溃白屏。
* **解决方案 (Solution)**：
  1. 建立一个全新的 `workspaceContainerRef` 绑定在整个工作区（包含 TreeList）的最外层容器上，并通过 `ResizeObserver` 独立测量其静态总宽度 `workspaceWidth`。因为该容器宽度只受外部浏览器尺寸影响，内部面板的相互挤压/收缩不会对其造成任何变动，从而使其成为一个绝对稳定的基准。
  2. 在 `useEffect` 压缩逻辑中，不直接使用会发生状态滞后的 `contentAreaWidth`。而是用静态稳定的 `workspaceWidth` 与当前最新的 `treeListOpen` 状态进行**同步计算**：`const expectedContentAreaWidth = workspaceWidth - (treeListOpen ? (treeListWidth + 1) : 0);`。
  3. 这种同步计算使得在 `treeListOpen` 发生变更的同一帧渲染里，宽度数值能够瞬间计算并更新到位，完美避开了等待 `ResizeObserver` 异步回调所产生的滞后空窗期，从根源上打破了状态震荡环路。
* **经验教训 (Takeaways)**：
  在使用 `ResizeObserver` 观察 DOM 尺寸并驱动 React 内部复杂联动布局（如多面板挤压、自动折叠）时，一定要警惕“**组件状态变更 -> 改变 DOM 尺寸 -> ResizeObserver 运行 -> 重新计算并触发二次状态变更**”所形成的潜在循环反馈链。
  若要保证多面板自适应收缩的稳定，应当尽可能基于**包含所有自适应元素的外部固定容器总宽度**去进行同步数学计算，而不是让各组件各自观察自己的 DOM 变化并互相影响。

---

### [2026-07-20] 嵌套 Flexbox 缺少 `min-w-0` 导致右侧面板被挤出屏幕

* **现象**：
  Stack view 模式下，如果主视图（如 Figure 或 Table）内容很宽，右侧的 Metadata 面板会被整个挤出可视区域。
* **根本原因 (Root Cause)**：
  典型的 Flexbox 尺寸溢出（Flexbox blow-out）。
  在 Flex 布局中，子容器的 `min-width` 默认是 `auto`（即内部内容的实际宽度）。如果底层元素极宽（比如两张 `540px` 并排的图表），这个巨大的尺寸要求会顺着 DOM 树逐层向外传递，强行撑开沿途所有没有尺寸限制的父级 Flex 容器。最终导致主容器宽度越过屏幕边界，把排在它右边的 Metadata 面板推了出去。
* **解决方案 (Solution)**：
  从最外层 `Main.tsx` 到内层 `ShellPreview`，在DOM链路上的每个 Flex wrapper 上统一补充 `min-w-0`。这能强行重置浏览器的 `min-w: auto` 默认行为，斩断子元素宽度向上“挟持”父容器的链条。保证父容器严格贴合屏幕宽度，超宽的内部内容则通过 `overflow-auto` 产生滚动条。
* **经验教训 (Takeaways)**：
  1. **防御性 CSS**：在深层嵌套的 Flex 布局中包裹宽内容（如大表格、画布）时，**务必在沿途的 Flex 容器上习惯性加上 `min-w-0` / `min-h-0`**，防止尺寸级联失控。
  2. **不要滥用 Absolute**：排查“元素被挤飞”问题时，千万别用 `position: absolute` 去强行打补丁（这会引发拖拽失效、遮挡等二次 Bug）。正解是从内向外检查，揪出那个漏写了 `min-w-0` 或 `overflow-hidden` 的中间层容器。

---

### [2026-07-29] 自定义 WebKit 滚动条导致 overlay 失效及列表宽度抖动挤压

* **现象**：
  在 Metadata 面板右侧，当点击左侧不同的 Component 项时，由于右侧内容长短变化引起垂直滚动条的出现与消失。这使得右侧列表在带有滚动条和不带滚动条的状态间来回切换，反复占用和释放 10px 的物理宽度，导致列表内容发生令人不悦的宽度抖动与挤压。
* **根本原因 (Root Cause)**：
  项目全局 CSS (`globals.css`) 中使用了 `::-webkit-scrollbar { width: 10px; }` 覆盖了浏览器原生的滚动条样式。这导致 WebKit 浏览器下原生的 `overflow-y: overlay` 特性失效，滚动条从“悬浮不占位（Overlay）”退化为了“占据实际排版宽度的普通块（Auto）”。
  因此，当通过 `overflow-y-overlay` (实际上退化为了 auto) 来控制长列表时，滚动条的显隐就会牵连整个 Flex 容器内容区的可用宽度，引发 Layout Shift。
* **解决方案 (Solution)**：
  1. 放弃在容易引发抖动的具体业务列表容器上使用 `overflow-y-auto` 或 `overflow-y-overlay`。
  2. **在特定组件局部**（例如 `MetadataPanel` 的长列表外层），将其 CSS 类名精准替换为 `overflow-y-scroll`。
  3. 由于全局已经配置了 `::-webkit-scrollbar-track { background: transparent; }`，即使内容很短不需要滚动时，局部强制保留的 10px 滚动条轨道也是完全透明不可见的，不会影响视觉美观，却完美地永久预留了滚动条的空间，彻底消除了抖动。
* **经验教训 (Takeaways)**：
  1. **自定义滚动条的代价**：一旦在 Web 项目中自定义了 `::-webkit-scrollbar` 宽度，就会破坏 Mac 系统自带的原生 zero-width overlay 浮动特性。
  2. **警惕“全局防抖”的副作用**：**绝对不要**试图在 `globals.css` 中用 `* { overflow-y: scroll !important; }` 去做全局防抖！这会导致页面中原本完美贴合的静态 Flex 容器和网格布局莫名其妙被吃掉 10px 宽度，从而引发全站大面积的排版破坏。
  3. **防抖动（Layout Shift）最佳实践**：针对长短高度会发生剧烈变化的**具体业务列表区**，最优解是在**局部组件**上直接使用 `overflow-y-scroll`（或 `scrollbar-gutter: stable`）常驻预留空间，配合透明的 Track 背景色即可兼顾美观与极度稳定的排版体验。

---

### [2026-08-13] Props 接口新增属性未在组件参数中解构引发的 `ReferenceError` 白屏

* **现象 (Symptom)**：
  控制台报错 `Uncaught ReferenceError: submitDisabled is not defined at ChatBox (ChatBox.tsx:482)`，导致包含 ChatBox 的界面组件崩溃。
* **根本原因 (Root Cause)**：
  在扩展 `ChatBoxProps` 接口添加 `submitDisabled?: boolean` 属性后，`ChatBox.tsx` 函数参数解构处漏写了 `submitDisabled`。因此，在 JSX 内部引用 `submitDisabled` 变量时，试图访问一个未解构且未声明的标识符，触发运行时 `ReferenceError`。
* **解决方案 (Solution)**：
  在 `ChatBox({ ... })` 函数参数解构中补全 `submitDisabled = false`。
* **经验教训 (Takeaways)**：
  1. TypeScript 接口类型添加新字段时，必须同步核对组件函数形参列表，确保所有在函数体或 JSX 中使用的 Prop 均已明确解构。
  2. 构建阶段 `npm run build` 通过只能保证语法（Syntax）无误，运行前需检查形参作用域绑定。
