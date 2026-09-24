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

---

### [2026-08-13] `Cancel update` 按钮未重置草稿数据导致无法回归默认初始态

* **现象 (Symptom)**：
  在 Metadata 面板进入 `To be updated` 待更新视图后，点击 `Cancel update` 按钮毫无响应，面板无法恢复到包含默认字段且无差分的初始状态。
* **根本原因 (Root Cause)**：
  1. **数据与视图解耦缺失**：最初 `onMetaCancel` 仅将控制视图模式的布尔标识 `metaUpdateActive` 设为 `false`，但没有撤销/重置 `figureBlocks` 与 `figureComponents` 中已被修改的字段草稿值 (`f.value`)。
  2. **组件解构断链**：中间容器组件 `WorkspaceContent` 漏写了 `onMetaCancel` 的参数解构，导致传递给 `<MetadataPanel>` 的回调实际上是 `undefined`。
  因此，即使关闭了 `metaUpdateActive`，底层差分比较逻辑 `metaDiffItems` 依然包含改动项（`length > 0`），导致 Header 浮框、Update Code 按钮与编辑态文本依然常驻，未能真正回到无改动的初始态。
* **解决方案 (Solution)**：
  1. 在 `WorkspaceContent` 参数解构中补齐 `onMetaCancel`，修复事件透传链条。
  2. 在 `MetadataPanel` 内部实现 `handleCancelUpdate` 方法，点击时遍历 `figureBlocks` 和 `figureComponents`，将所有字段的 `value` 恢复至 baseline 初始基线，并移除临时新增的 Component 节点，最后触发 `onMetaCancel?.()`。
* **经验教训 (Takeaways)**：
  1. **取消/回退操作必须兼顾“视图”与“状态数据”**：对于带 Track Changes / 差分对比的面板，Cancel 操作不仅是关闭对比视图，更必须将数据 model 还原至对比基线（Baseline）。
  2. **多层组件 Props 传递防御**：深层嵌套组件中传递回调函数时，需要沿着组件树检查每一层 wrapper 的解构，确保回调不会在半路丢失。

---

### [2026-08-13] 内部组件错误引用父层 `setMetaUpdateActive` 抛出 `ReferenceError` 导致按钮点击失败

* **现象 (Symptom)**：
  控制台报错 `Uncaught ReferenceError: setMetaUpdateActive is not defined at onMetaCancel (Main.tsx:4310)`，点击 `Cancel update` 按钮报错崩溃。
* **根本原因 (Root Cause)**：
  在 `WorkspaceContent` 组件内部（行 4310），向 `<MetadataPanel>` 传递 `onMetaCancel` 时，误写成了 `onMetaCancel={() => setMetaUpdateActive(false)}`。由于 `setMetaUpdateActive` 状态定义在顶层 `WorkspaceShell` / `Main` 中，`WorkspaceContent` 局部作用域并没有 `setMetaUpdateActive` 标识符，导致调用时抛出 `ReferenceError`。
* **解决方案 (Solution)**：
  将行 4310 的 `onMetaCancel={() => setMetaUpdateActive(false)}` 修正为直接传递 `onMetaCancel={onMetaCancel}`，正确消费从顶层逐层透传进来的回调函数。
* **经验教训 (Takeaways)**：
  在 React 多层嵌套组件中，深层 Element 挂载回调时切勿凭感觉直接调用父级 State setter，必须严格透传 Props 形参 `onMetaCancel`。

---

### [2026-08-13] `WorkspaceShell` 中渲染 `<ShellPreview>` 遗漏 `onQuoteField` Prop 导致悬浮 Quote 按钮无法显示

* **现象 (Symptom)**：
  用户在 Metadata 面板任意字段或组件上悬浮鼠标，双引号 Quote 按钮始终不显示，无法触发引用。
* **根本原因 (Root Cause)**：
  顶层组件 `WorkspaceShell` 在渲染 `<ShellPreview>` 时（行 8044），只传了 `onReviewItemsChange` 和 `onMetaCancel`，遗漏了 `onQuoteField={handleQuoteField}` 的传递。导致 `ShellPreview` 内部收到的 `onQuoteField` 始终为 `undefined`，进而透传给 `MetadataPanel` 的 `onQuoteField` 也是 `undefined`。由于条件判断 `{onQuoteField && (...)}` 评估为 `false`，组件未向 DOM 渲染任何 Quote 按钮。
* **解决方案 (Solution)**：
  在 `WorkspaceShell` 中渲染 `<ShellPreview>` 时补全 `onQuoteField={handleQuoteField}`。
* **经验教训 (Takeaways)**：
  当深层组件中的条件渲染按钮 (`{fn && <button />}`) 持续不露显时，第一排查要点应当是检查最上层 state/handler 闭包是否在最外层 JSX 调用的地方被遗漏传递。

---

### [2026-08-27] FilterChip 漏解构 multiSelect 等 Props 导致 ReferenceError 白屏与嵌套 Button DOM 警告

* **现象 (Symptom)**：
  1. 控制台抛出 `Uncaught ReferenceError: multiSelect is not defined at FilterChip.tsx:247/139`，导致依赖 FilterChip 的 BlocksTabContent / InlineVariableList / MetadataPanel 渲染崩溃白屏。
  2. 控制台伴随 `Warning: validateDOMNesting(...): <button> cannot appear as a descendant of <button>` DOM 结构非法嵌套警告。
* **根本原因 (Root Cause)**：
  1. 在扩展 `FilterChipProps` 接口支持多选属性（`multiSelect`、`values`、`onChangeMulti`）时，`FilterChip.tsx` 的函数形参解构列表中遗漏了这三个字段，导致组件内部直接访问自由变量 `multiSelect` 时触发运行时 `ReferenceError`。
  2. `BrowseVariablesModal.tsx` 中 `InlineVariableList` 的单行变量条目采用了 `<button>` 作为最外层容器，而内部包含的 `<Checkbox>` 组件本身亦渲染为 `<button type="button" role="checkbox">`，违反了 HTML 语义标准规范（`<button>` 内部禁止嵌套 `<button>`），触发 React DOM 嵌套警告。
* **解决方案 (Solution)**：
  1. 在 `FilterChip.tsx` 参数解构中补齐 `multiSelect, values, onChangeMulti`。
  2. 在 `BrowseVariablesModal.tsx` 中将 `InlineVariableList` 行容器由 `<button>` 改为具备键盘可访问性支持的 `<div role="button" tabIndex={0} ...>`。
* **经验教训 (Takeaways)**：
  1. **严格对照 Props 接口与形参解构**：在为通用 UI 组件扩展属性时，必须确保 Interface 与函数签名解构字段 100% 对应，避免由于 `...props` 收集而导致内部访问未声明变量。
  2. **避免容器 Button 嵌套交互元素**：当列表整行可点击且内部包含 Checkbox、Switch 或子按钮时，行容器应使用 `<div role="button">` 并补充键盘事件响应，防止浏览器与 React 的 `<button>` 嵌套校验异常。

---

### [2026-09-04] Figure AI 对话流被非预期混入原型期 Warning 卡片及生硬 To be Reviewed 框导致样式异常

* **现象 (Symptom)**：
  用户发现 AI Copilot 在 Figure 视图下的首条完整推理对话流中，突兀出现了未曾见过的黄色警示卡片（`⚠️ AI Inferences & Potential Discrepancies`）、手写的灰色 `To be Reviewed` 卡片（内含 4 个带紫色圆点的按钮链接）、以及组件标题右侧未遵循系统规范的 `Chart`、`Table` 标签，严重破坏了原有对话流的干净一致性。
* **根本原因 (Root Cause)**：
  在 commit `8140b8f`（`fix(ui): decouple in-card panels into 3 discrete rounded cards...`）中，在重构 In-Card 离散面板的同时，顺带将历史草案文档中未定稿的 3 组件原型文本与实验性卡片硬编码写入了 `Main.tsx`（行 1029-1153），包含写死的非法 Token 颜色（`#FFF8E6`, `#FFE58F`）、原生 Emoji 及与系统 `MetadataEntryBlock` 严重重叠的手写跳转列表。
* **解决方案 (Solution)**：
  1. 精确回滚 `Main.tsx` 中 `docType === 'figure'` 对应的 `ai_complete` 消息体，完全剔除新增的 Warning 卡片、手写 To be Reviewed 框以及右侧未规范的 Chart/Table 标记。
  2. 恢复最初清晰规范的 Component 1 / Component 2 结构与统一的 `<MetadataEntryBlock>` 入口。
  3. 同步将 `DEFAULT_FIGURE_REVIEW_ITEMS` 恢复为对应的 6 项标准检查项。
* **经验教训 (Takeaways)**：
  1. **禁止在无关提交中混入原型级业务内容**：架构与容器层重构（如面板解耦、滚动遮罩等）必须保持改动原子性，严禁顺手掺杂未确认的原型期 UI 文本或临时样式。
  2. **对话流组件化统一约束**：对话消息内需强化语义层级规范，严禁直接手写硬编码十六进制色值的临时外挂卡片，所有辅助提示统一通过标准卡片组件呈现。

---

### [2026-09-09] Code Editor 工具栏 Lock Code 按钮点击无响应异常

* **现象 (Symptom)**：
  点击代码编辑器工具栏上的 Lock Code 图标按钮后，页面无任何响应，既没有展示只读警告 Banner，代码区域也没有被锁定，按钮状态未发生切换。
* **根本原因 (Root Cause)**：
  1. `WorkspaceContent` 中初始化的 `selectedId` 值为 `'t4'`，但 `programs.tables` 列表中缺失了 `{ id: 't4', name: 'Table 14.1.4' }`，导致初始状态下 `selectedTable` 和 `selectedTableProgram` 均为 `undefined`。
  2. `handleCodePanelToggleLock` 仅在 `selectedTableProgram && selectedTable` 均存在时才触发 `handleToggleLock`，因未做空保护或默认回退，导致点击回调静默退出。
  3. `CodePanel` 内部完全依赖上层异步传递的单一只读 prop `isLocked`，缺少即时本地响应与同步机制，在上层状态链路中断或空值时失去防抖兜底能力。
* **解决方案 (Solution)**：
  1. 在 `programs.tables` 中补齐初始条目 `t4`，并在 `getSelectedTable` 与 `selectedTableProgram` 中补充安全回退机制（兜底使用 `programs[0]?.tables[0]`）。
  2. 在 `CodePanel` 内部引入即时同步的受控状态 `isLockedLocal` 与点击调度函数 `handleToolbarToggleLock`，点击时先做同步状态翻转，再向上分发 `onToggleLock`，确保按钮点击始终具备 100% 确定性响应。
* **经验教训 (Takeaways)**：
  1. **初始状态有效性校验**：组件内部维护的默认选择项 ID（如 `selectedId`）必须与 Mock 列表保持强一致，避免野指针状态。
  2. **关键交互操作的双向防御**：对于高频切换的核心开关操作（如 Lock/Unlock），子组件应具备即时乐观更新（Optimistic UI）能力，并配合父级健全的回退容错逻辑。

---

### [2026-09-16] AICopilotPanel 组件形参解构漏写 onJumpToTfl 引发运行时 ReferenceError 白屏

* **现象 (Symptom)**：
  控制台报错 `Uncaught ReferenceError: onJumpToTfl is not defined at AICopilotPanel (Main.tsx:2498:15)`，导致 AI Copilot 面板在渲染对话流（ChatConversation）时组件树崩溃白屏。
* **根本原因 (Root Cause)**：
  在扩展 `AICopilotPanel` 的 Props 接口类型时增加了 `onJumpToTfl?: (tflId: string) => void`，并在 JSX 中将其传递给 `<ChatConversation onJumpToTfl={onJumpToTfl} />`。但由于函数签名的对象解构参数 `{ ... }` 列表中漏填了 `onJumpToTfl`，导致在函数体内访问未在作用域内声明的变量，触发运行时 `ReferenceError`。
* **解决方案 (Solution)**：
  在 `AICopilotPanel` 的形参解构列表中补齐 `onJumpToTfl`。
* **经验教训 (Takeaways)**：
  1. **Props 扩展双向核对**：在 TypeScript 中向带有内联类型注解的组件形参添加新属性时，必须同时检查左侧解构形参列表与右侧类型定义，确保两者完全镜像匹配。
  2. **避免未声明变量直接下发**：传递回调时可先检查局部作用域绑定，必要时配合 ESLint `no-undef` 规则在保存时即时捕获解构漏写的变量。

---

### [2026-09-17] 锁定表解锁函数 `handleToggleLock` 错误将状态置为 `pending` 导致解锁后误现待定变更状态

* **现象 (Symptom)**：
  在左侧 Tree List 或代码工具栏中对锁定状态的交付物（如 `14.1.8 Medical History by SOC`）执行解锁后，该表并没有恢复为正常的已完成（`completed`）状态，反而意外变成了 `pending` 状态（目录树中显示黄色待办圆点、AI Copilot 输入框出现 Pending Changes 操作条、Event Copilot 的 Target TFLs 卡片中显示黄色「Pending」标签）。
* **根本原因 (Root Cause)**：
  在 `Main.tsx` 的 `handleToggleLock` 函数中，对锁定状态的切换逻辑直接使用了二值三元表达式：
  `status: table.status === 'locked' ? 'pending' : 'locked'`
  这导致只要对任何处于 `locked` 状态的表格执行解锁操作，其状态都会被硬编码赋予 `'pending'`。进而引发系统级级联反应（`liveTable.status === 'pending'`），使得工作区、输入框和 Event Copilot 全部误判该表存在待人工审查的变更。
* **解决方案 (Solution)**：
  修正 `handleToggleLock` 中的状态流转逻辑：
  当解除锁定时，优先检查该表是否原本存在未处理的待定改动（`table.pendingChanges > 0`），若有则恢复为 `'pending'`，否则恢复为正常的已完成状态 `'completed'`：
  `status: table.status === 'locked' ? (table.pendingChanges && table.pendingChanges > 0 ? 'pending' : 'completed') : 'locked'`
  同步将 program 层级的解锁逻辑由 `'pending'` 修正为 `'completed'`。
* **经验教训 (Takeaways)**：
  1. **多态状态机流转严禁简化为布尔二值开关**：当实体具备多种状态（`completed` / `pending` / `locked` / `error` 等）时，不可随意用 `a ? b : c` 做二元翻转，必须明确每个状态被切换时的前置条件与预期归宿。
  2. **锁定（Freeze/Lock）的本质是冻结而非待定**：业务心智中代码锁定通常发生于交付物已定稿/已完成之后，解锁操作恢复的应是其基线正常态（`completed`），不应凭空制造“待定变更”。

---

### [2026-09-20] TreeList 与 Events 表格行 Hover 导致名称文字错误变为品牌色

* **现象 (Symptom)**：
  鼠标移入 TreeList 的 Recent/Event 条目或 Events 表格的 Event 行时，名称文字由 `text-primary` 变为品牌色；预期仅显示行背景反馈，文字颜色保持不变。
* **根本原因 (Root Cause)**：
  名称文本节点显式添加了 Tailwind 规则 `group-hover:text-brand-1`。父级行使用 `group` 后，任意行 Hover 都会触发该规则，覆盖名称原有的 `text-text-primary`。
* **解决方案 (Solution)**：
  移除 TreeList Recent、TreeList Event 和 Events 表格 Event 名称上的 `group-hover:text-brand-1`，保留父级行的 `hover:bg-*` 背景反馈。
* **经验教训 (Takeaways)**：
  1. 列表行 Hover 应优先通过容器背景表达，除非设计规范明确要求，否则不要同时改变主标签文字颜色。
  2. 使用 Tailwind `group-hover` 前应检查其作用域，避免父级整行状态意外覆盖子元素的语义色。

---

### [2026-09-20] Events 页开启 Assigned to me 筛选后因变量暂时性死区导致白屏

* **现象 (Symptom)**：
  点击 Events 页的 `Assigned to me` 筛选器后页面白屏，用户无法查看空结果或恢复筛选条件。
* **根本原因 (Root Cause)**：
  `hierarchicalProjects` 的 `useMemo` 在 `assignedToMeOnly` 分支中通过 `owner` 计算 Study Owner，但 `owner` 使用 `const` 声明在该分支之后。开启筛选时访问处于 Temporal Dead Zone 的变量，触发运行时 `ReferenceError`。
* **解决方案 (Solution)**：
  在每个 Event 开始过滤前先计算 `studyOwner`，筛选判断、搜索匹配和分组数据统一使用该变量；同时将筛选器重命名为无图标的 `My Events`，并为零结果增加 `Reset Filters` 空状态。
* **经验教训 (Takeaways)**：
  1. `useMemo` 内的过滤和分组应先集中派生共享字段，再进入条件分支，避免 `const` 暂时性死区与重复计算。
  2. 所有可能返回零结果的筛选器都应提供明确空状态和恢复入口，不能依赖空白容器表达结果。

---

### [2026-09-20] Tree List 折叠后详情页左上角 Event Settings 下拉箭头消失

* **现象 (Symptom)**：
  在详情页折叠 Tree List 后，Study/Event 标题仍显示，但标题旁的 Event Settings 下拉箭头随 Tree List 一起消失，无法从折叠态进入 Event Information 或 Event Team。
* **根本原因 (Root Cause)**：
  Event Settings 按钮只渲染在宽度由 `treeListOpen` 控制的 Tree List 容器内；折叠态使用独立的 `ViewToggleBar` 标题结构，但该分支仅补充了 `Open tree list` 按钮，没有透传 `eventMenuOpen`、`eventMenuButtonRef` 和菜单切换回调，因此功能入口被遗漏。
* **解决方案 (Solution)**：
  为 `ViewToggleBar` 增加 Event Settings 状态、切换回调和定位 ref，并在 Tree List 折叠分支的标题旁渲染同规格下拉按钮；展开态与折叠态互斥挂载按钮，共用原有菜单状态与 Portal 定位逻辑。
* **经验教训 (Takeaways)**：
  1. 同一工具栏存在展开/折叠两套 DOM 分支时，应建立功能入口对照清单，避免只复制标题而遗漏附属操作。
  2. 两个互斥视图复用同一浮层定位 ref 时，按钮也应互斥挂载，避免同一个 ref 同时绑定多个 DOM 节点。

---

### [2026-09-21] 功能分支提交后 GitHub Pages 演示站未同步更新

* **现象 (Symptom)**：
  Event Copilot 修改已经在本地提交，但 `https://ruiniou.github.io/at-demo/` 仍加载旧版 JavaScript 和 CSS 资源，线上看不到最新交互与文案。
* **根本原因 (Root Cause)**：
  仓库的 Pages 站点直接发布独立的 `gh-pages` 分支；功能提交仅存在于 `sprint7/event-copilot-style2`，且该分支一度领先远端，项目也没有自动将功能分支构建产物同步到 `gh-pages` 的 workflow。
* **解决方案 (Solution)**：
  推送功能分支，从提交后的干净 worktree 执行 Vite production build，再将 `dist` 静态产物提交并推送到 `gh-pages`；通过远端分支 SHA、线上带缓存参数的 `index.html` 和新资源文件名确认发布生效。
* **经验教训 (Takeaways)**：
  1. 功能代码提交与 Pages 发布是两个独立步骤；交付演示前应同时核对功能分支和 `gh-pages` 的远端 SHA。
  2. 发布应始终从干净提交构建，避免将工作区中未提交的其他修改混入静态站点；后续可增加自动部署 workflow 消除人工同步遗漏。

---

### [2026-09-21] 登录页左右分栏交界处出现多余灰色 Divider

* **现象 (Symptom)**：
  登录页桌面端左侧表单与右侧图片之间出现一条灰色竖线，但设计不需要分栏 Divider。
* **根本原因 (Root Cause)**：
  `SSOPlaceholderVisual` 根容器包含 `border-l border-graphite-20/60`，同时 full-bleed 图片上又叠加了 `inset 0 0 0 1px rgba(0,0,0,0.10)`，两种边缘样式在左右分栏交界处叠加形成灰线。
* **解决方案 (Solution)**：
  移除根容器左边框与图片 inset shadow，让 thumbnail 直接无边缘填满右侧容器。
* **经验教训 (Takeaways)**：
  1. Full-bleed 图片分栏不应沿用卡片图片的 outline 规则，边缘处理需要根据容器语义决定。
  2. 排查分栏接缝时，应同时检查容器 border 和子元素 inset shadow，避免只移除其中一层。

---

### [2026-09-21] Tree List 的 Section 错误显示 Pending 状态圆点

* **现象 (Symptom)**：
  Tree List 中 `14.1 Demographic Data` 等 Section 标题右侧出现橙色 Pending 圆点，但 Pending 只属于具体 TFL，Section 不存在该状态。
* **根本原因 (Root Cause)**：
  三个 `ProgramItem` mock 数据的 `status` 被直接设置为 `'pending'`，且 `ProgramItem.status` 复用了包含 Pending 的 `ItemStatus` 联合类型；`TreeStatusControl` 因此按通用规则为 Section 渲染了 Pending 圆点。
* **解决方案 (Solution)**：
  将 Section 初始状态统一改为 `'completed'`，并把 `ProgramItem.status` 类型收窄为 `'completed' | 'locked'`，从数据与类型层同时阻止 Section 进入 Pending。
* **经验教训 (Takeaways)**：
  1. 父级容器和叶子项的状态机不同，不应为复用渲染组件而共享过宽的状态联合类型。
  2. 业务上不存在的状态应在 TypeScript 类型层排除，而不只是依赖 UI 条件隐藏。

---

### [2026-09-21] 本地预览不可访问但项目代码仍可正常构建

* **现象 (Symptom)**：
  Localhost 页面突然无法访问，看起来像前端页面或最新样式修改导致应用崩溃。
* **根本原因 (Root Cause)**：
  Vite 开发服务进程已经退出，常用开发端口没有监听服务。项目执行 `npm run build` 仍能通过，说明不是 React 编译错误；在受限沙箱内直接重新监听 `127.0.0.1:5173` 会触发 Node.js `listen EPERM`。
* **解决方案 (Solution)**：
  在允许本地端口监听的环境中重新执行 `npm run dev -- --host 127.0.0.1`，恢复 Vite 服务，并通过 `curl -I http://127.0.0.1:5173/` 返回 `HTTP 200` 验证页面可访问。
* **经验教训 (Takeaways)**：
  1. Localhost 不可访问时先区分“服务进程退出”和“应用运行时崩溃”：检查端口监听并运行 production build，不要直接回滚最近的 UI 修改。
  2. 在沙箱环境启动开发服务器若出现 `listen EPERM`，应使用获准的端口监听权限启动，而不是反复更换端口掩盖权限问题。

---

### [2026-09-22] Vite 开发进程中断导致 Localhost 再次不可访问

* **现象 (Symptom)**：
  Localhost 突然无法打开，用户看到的效果与前端应用崩溃相同。
* **根本原因 (Root Cause)**：
  `127.0.0.1:5173` 上没有可用的 Vite 开发服务；重新启动后 Vite 正常完成编译，登录页和主工作区均能渲染，确认最近的 React/JSX 修改没有引发编译或运行时崩溃。受限沙箱内监听该端口会产生 Node.js `listen EPERM`，需要使用获准的本地端口权限。
* **解决方案 (Solution)**：
  使用 `npm run dev -- --host 127.0.0.1` 重新启动并保持 Vite 进程运行；随后实际打开 Localhost，并进入主工作区验证页面可用。
* **经验教训 (Takeaways)**：
  1. Localhost 不可用时，先重启并观察 Vite 编译日志，再判断是否需要改代码。
  2. 恢复服务后应至少验证登录页与主工作区两个层级，避免只以端口可访问代替应用可用性检查。

---

### [2026-09-22] 错误的 Localhost 工作目录导致 Event Owner 仍显示旧版 Single Select

* **现象 (Symptom)**：
  Study Owner 从 Study 行新建 Event 时，Create New Event 的 Event Owner 仍显示左侧 Check、无头像和无搜索的旧版 Single Select。
* **根本原因 (Root Cause)**：
  浏览器中的 5173 预览由主目录 `/Users/ruini.ou/Downloads/AI Copilot` 启动，该目录的 `CreateEventModal.tsx` 仍使用 `<Dropdown>`；实际修改位于 Codex worktree，已经使用 `<MemberSingleSelect>`，但没有被当前开发服务器加载。
* **解决方案 (Solution)**：
  为当前 worktree 恢复依赖并在 5174 启动 Vite；读取实际服务模块确认包含 `MemberSingleSelect`，随后按 Study Owner → Add Event 路径验证头像触发框、搜索框和成员头像列表均已渲染。
* **经验教训 (Takeaways)**：
  1. 多 worktree 开发时，视觉验收前必须确认 Vite 的工作目录与实际修改目录一致。
  2. 当截图与源码结构明显不符时，应优先核对服务来源和浏览器加载模块，而不是继续修改已经正确的组件代码。

---

### [2026-09-22] No Assignee 空头像显示为破图

* **现象 (Symptom)**：
  TFL Programmer Picker 的 `No Assignee` 选项显示浏览器破图标识，而不是灰色空成员图标。
* **根本原因 (Root Cause)**：
  `Avatar` 在没有 `name` 时通过 `<img>` 直接加载 `empty-assignee.svg`；该旧 SVG 包含兼容性不稳定的 `lch()` 填色声明，一旦浏览器无法正常解码就会暴露 `<img>` 的破图状态。
* **解决方案 (Solution)**：
  保留原 SVG 轮廓资源，改用 `mask` / `-webkit-mask` 配合 `background-color` 渲染空成员图标，避免图片解码失败时出现破图占位。
* **经验教训 (Takeaways)**：
  1. 单色功能图标统一使用 mask 渲染，不要混用普通 `<img>`，以便稳定继承设计 Token 颜色。
  2. 从外部设计工具导出的 SVG 应在入库前清理非标准或兼容性有限的颜色声明。

---

### [2026-09-24] Tree List 未排除当前用户自身导致 Take over 接管后错误显示本人头像

* **现象 (Symptom)**：
  用户在工作区顶栏对离线用户的交付物执行 Take over（接管为自己编辑）后，左侧 Tree List 中该交付物条目右侧错误展示了当前用户本人的头像，遮挡了原本的交付物状态图标（如 Modified / Locked）。
* **根本原因 (Root Cause)**：
  1. `WorkspaceContent` 在遍历渲染 `filteredPrograms` 调用 `<TreeItem ... />` 时，漏传了 `currentUserName={CURRENT_USER}` prop。
  2. `TreeItem` 内部对 `occupant` 的推导逻辑原本为 `const occupant = tflOccupancy?.isOccupied ? table.assignee : undefined;`，未对占用者是否为当前登录用户（`table.assignee === currentUserName`）进行排除。因此只要当前用户自身占用了页面锁，组件就将当前用户识别为协同冲突占用者并渲染头像。
* **解决方案 (Solution)**：
  1. 在 `TreeItem` 的 Props 声明中补充 `currentUserName?: string`，并在 `WorkspaceContent` 调用 `<TreeItem ... />` 处传入 `currentUserName={CURRENT_USER}`。
  2. 在 `TreeItem` 内部计算 `occupant` 时引入自身排除判断：
     `const isSelf = Boolean(currentUserName && table.assignee === currentUserName);`
     `const occupant = tflOccupancy?.isOccupied && !isSelf ? table.assignee : undefined;`
     确保仅在「其他用户处于占用编辑中」时才展示头像，当前用户自己编辑时保留其原本的状态图标。
* **经验教训 (Takeaways)**：
  1. **协同冲突防范中的视角区分（Self vs. Others）**：列表级协同头像的目的是「提示其他协作者正在编辑以防止碰撞冲突」，因此自己的头像在当前工作区列表中属于冗余信息，且会覆盖对编辑者至关重要的状态图标（Status Icon）。
  2. **多层组件参数透传严防断漏**：当为子组件增加了过滤依赖（如 `currentUserName`）时，必须同步核对其在父级 JSX 实例化位置的传参，避免空值兜底掩盖逻辑失效。

---

### [2026-09-24] 工作区顶栏自身头像与他人头像外盒尺寸不一致导致微妙位置位移

* **现象 (Symptom)**：
  在右上角工作区顶栏中，切换查看不同 TFL 时，用户自己的头像（`own-occupied`）或未分配头像（`unassigned`）与他人头像（`other-occupied` / `other-away`）在位置上存在微妙的水平与垂直偏差，且右侧邻近的 `Group Code` 按钮发生跳动。
* **根本原因 (Root Cause)**：
  在 `AssigneeOccupancyButton.tsx` 中：
  1. 他人头像状态（在线或离线）渲染为带有 `p-[2px]` 与 1px 边框的 `<button>`，由于内含 24px（`size-6`）的 Avatar，计算得到的外盒尺寸为 `24 + 4 + 2 = 30px`。
  2. 自身头像状态与未分配状态渲染为无任何 padding 和边框的 `<span>`，直接沿用 Avatar 的 `24px × 24px`。
  两者在顶栏 `flex items-center gap-[6px]` 容器中存在 6px（30px vs 24px）的外盒宽度差，导致自身头像中心点相较于他人头像发生 3px 水平偏移与 3px 垂直微偏，并导致邻近按钮位置移动 6px。
* **解决方案 (Solution)**：
  对 `AssigneeOccupancyButton.tsx` 的所有状态统一外层容器基准类：
  `baseSlotClasses = "relative size-[28px] inline-flex shrink-0 items-center justify-center rounded-full select-none"`
  使四个状态（`unassigned`、`own-occupied`、`other-occupied`、`other-away`）均采用严格固定的 `28px × 28px` 圆形盒模型与 1px 边框占位，内部 24px Avatar 完美居中对齐，与顶栏同级 28px 图标按钮（如 Group Code、Download）形成像素级一致的视觉网格。
* **经验教训 (Takeaways)**：
  1. **同一插槽多状态尺寸强等价原则**：同一逻辑占位槽在不同业务状态间切换时（只读 vs 可交互、自身 vs 他人），最外层容器的 `width`、`height`、`padding`、`border` 盒模型必须完全等价，避免依赖内部子元素尺寸自适应导致布局跳动（Layout Shift）。
  2. **工具栏图标按钮统一网格基准**：应用顶栏操作项应统一遵循 28px（或 32px）的固定几何基准，禁止出现 24px、30px 等杂乱尺寸混排。

---

### [2026-09-24] Input 重传完成后 Tree List 保留过期的 TFL 分析状态

* **现象 (Symptom)**：
  Event 完成 Input 重传并进入 To do 后，Tree List 仍可能显示某一条 TFL 的 AI Processing 或 Pending changes 状态。
* **根本原因 (Root Cause)**：
  `WorkspaceContent` 仅在 Event 为 `ai-processing` 时覆盖 Tree List 图标，没有在状态转为 `to-do` 时重置 `programs` 中每个 TFL 的内部 `status`，因此旧的 `analyzing` / `pending` 状态继续渲染。
* **解决方案 (Solution)**：
  在 Event 转为 `to-do` 时，将所有 TFL 的内部状态设为 `idle`，使 Tree List 无状态显示；在 metadata 或 code 产生修改时，通过 `onEventWorkStarted` 将 Event 状态更新为 `in-progress`。同时在删除 Event 成功后显示 3 秒的确认 Toast。
* **经验教训 (Takeaways)**：
  1. Event 生命周期状态变化时，应同时定义并更新其派生的 TFL 列表状态，不能只依赖视觉覆盖。
  2. 删除后发生页面跳转时，应提供非阻断式结果确认，避免用户无法判断操作是否成功。

---

### [2026-09-24] 进入 Event 详情页会无操作地刷新首页状态

* **现象 (Symptom)**：
  从首页进入一个 Event 详情页后，不进行 metadata 或 code 修改便直接返回，首页中的 Event 状态仍被改成 In Progress。
* **根本原因 (Root Cause)**：
  `AIContent` 在挂载时会通过 `onCodeDiffChange` 上报 Mock 会话中已有的 `hasCodeDiff`。`WorkspaceContent` 将这次初始化同步误判为用户新产生的 Diff，并立即调用 `onEventWorkStarted` 更新共享 `events` 状态；内联回调在重渲染时还会重复触发该 Effect。
* **解决方案 (Solution)**：
  按 TFL 上下文记录 Code Diff 是否已完成首次同步，跳过每个 TFL 的初始上报，仅在进入详情后发生 `false → true` 的新 Diff 时将 Event 改为 In Progress。同时让状态更新保持幂等，目标状态未变化时复用原数组。
* **经验教训 (Takeaways)**：
  1. 组件初始化时上报的派生状态不能直接等同于用户操作，需要区分 hydration 与 interaction。
  2. 由子组件 Effect 驱动的共享状态更新必须保持幂等，并避免因回调引用变化重复触发。

---

### [2026-09-24] Stopped Event 误改非 Processing TFL 状态并出现 Modal 次操作样式回归

* **现象 (Symptom)**：
  停止 Event 后，Pending 与 Locked TFL 也被改写；Event Information 及二次确认 Modal 的 Cancel / Keep Editing 显示为填充按钮，详情页还出现了多余的 Read-only Banner。
* **根本原因 (Root Cause)**：
  `WorkspaceContent` 的停止状态 Effect 将 `analyzing`、`pending` 和 `locked` 一并转换；`EventInformationModal` 与 `MaintainOwnerModal` 的次操作错误使用了填充型 `secondary` variant；Code Panel 在 `effectiveIsLocked` 时额外渲染提示 Banner。
* **解决方案 (Solution)**：
  停止状态仅执行 `analyzing → stopped`，其余 TFL 和分组状态保持原值；Modal footer 的 Cancel / Keep Editing 改用无填充 `ghost` variant；移除 Code Panel 的 Read-only Banner，保留原有禁用与 Take over 行为。
* **经验教训 (Takeaways)**：
  1. Event 状态向 TFL 状态映射必须按精确源状态转换，禁止用宽泛条件覆盖未参与 Processing 的项目。
  2. Modal footer 的次操作应统一复用无填充 variant，填充型 Secondary 仅用于 Re-upload 等页面级操作。

---

### [2026-09-24] Update Inputs 的 Event Owner 呈可编辑态且删除 Toast 样式位置不符

* **现象 (Symptom)**：
  Update Inputs 使用的 Event Information Modal 中，Event Owner 仍以白底、无禁用边框的可编辑外观显示；删除 Event 成功提示使用深色样式并从页面底部出现。
* **根本原因 (Root Cause)**：
  Event Information Modal 向 `OwnerPicker` 传入了组件未声明的 `disabled` 与 `compact` 属性，因此禁用状态没有进入 OwnerPicker 的样式及交互逻辑；删除提示则沿用了固定在底部的深色 Toast 实现。
* **解决方案 (Solution)**：
  为 `OwnerPicker` 增加真实的 `disabled` 能力，并让原有 `disabledAppearance` 同样关闭交互；Disabled 状态复用 Member Selector 的 32px 高度、面板底色、表单边框和 Graphite-40 内容色。删除成功 Toast 改为页面顶部居中、白底浅色边框与阴影，并增加从顶部进入的动画。
* **经验教训 (Takeaways)**：
  1. 复用业务组件时应先核对其公开属性，TypeScript 未参与构建检查时，未声明的 JSX 属性可能静默失效。
  2. Disabled 既是视觉状态也是交互状态；字段外观、原生 `disabled` 属性和弹层打开条件必须由同一个状态控制。
  3. 跨页面操作完成提示应遵循统一的 Toast 位置与明暗模式，避免局部实现沿用旧样式。

---

### [2026-09-24] To do Event 错误显示 Stop Generation 操作

* **现象 (Symptom)**：
  Input 更新完成、Event 回到 To do 后，Event Settings 菜单中仍显示 `Stop Generation`。
* **根本原因 (Root Cause)**：
  操作可见性条件同时允许 `ai-processing` 与 `to-do` 状态，未按照“只有正在生成的 Event 才能停止”的状态边界限制。
* **解决方案 (Solution)**：
  将 `Stop Generation` 的显示条件收紧为：当前用户是 Event Owner，且 Event 状态严格等于 `ai-processing`。
* **经验教训 (Takeaways)**：
  状态操作的可见性应由可执行该动作的精确源状态控制；完成状态迁移后，应同步复核菜单操作、按钮和快捷入口。
