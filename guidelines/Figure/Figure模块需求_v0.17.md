# Figure 模块需求 v0.17

---

## 0. 本轮设计范围（v0.17 重大调整：AI Understanding 升级为主线）

本轮设计以 **AI Understanding** 为主要方向——**不再是备选方案**，是当前版本的核心设计。核心交付：

1. **Shell Preview + Metadata（三态来源标注 + Checkbox 确认）+ AI Copilot（结构化推理 + 坐标轴 Brief + To be Reviewed 清单）**：这是用户在生成/确认代码前，审核"AI 理解得对不对"的主体验
2. **新增 Component**：用户手动补充 AI 遗漏识别的 Component
3. **弃用 Component**：用户可将不需要的 Component 标记弃用，可复原（**删除操作是否仍保留，待与你确认**，见文末说明）
4. **AI 写回 Metadata 的能力**：用户在 Copilot/新增 Component 里提供的自由文本，AI 需要能解析并写回 Metadata 结构化字段

**Runtime 移出本轮设计范围**，本文档不再保留 Runtime 相关详细设计内容（如需参考此前设计，见第9节附录说明）——AI Understanding 是先解决"确保理解正确"这个问题的中间态，Runtime 能力属于后续阶段。

**Spatial View（空间关系视图）已移除**，不做这个视图和切换开关；此前设计里"点击 Shell 线框查看空间关系"这类交互一并作废。

---

## 1. 处理架构与输入设计（背景）

**整体框架参照 Table/Listing**：输入先转换为 Blueprint（`figurableparameter`）。

| 维度 | Figure | 对比 Table/Listing |
|---|---|---|
| 新增字段 | **URI**（图片地址）、**Type**（图片类型） | 无 |
| 行列字段 | 无 | Table/Listing 有 |
| 保留字段 | Title、FullNote、StandardNote、ProgrammerNote、PageBud | 相同 |
| ADM/STM/SAP | 均需要，SAP 可能在 String7 中引入 | 相同 |
| P code | **不使用** | Table 使用 |

- **Figure 类型可枚举**：已与韩确认覆盖常见 study 场景；极特殊类型客户接受暂不支持，列为二期。
- **多组件拼合建模，Component 是最小单元**：Figure 通常由多个 **Component** 拼合（如 KM 图 = At-risk Table + Chart 两个 Component）。建模方式：按大类划块，主图排第一层，子 table 依次嵌套，内部结构与 Listing 相同。Component 也是 **Full-scope Review 的审核颗粒度**（见第2节）。

### 1.1 Metadata 结构草案（已用 Atlas 实际界面截图核对）

**Basic（只读，见第2节三态标注规则）：**
- Figure Type（KM/Forest/Spider/Swimmer 等）
- Input Dataset(s)
- Page by
- Program Name（生成该 Figure 的程序/宏名称，**与 P code 机制无关**）
- Macro(s)
- General Filter
- Group（分组变量相关字段，与 Table 的 Group Code 概念是否相同仍不确定）

**Components（可编辑，见第2节三态标注规则）：**
- Component Label：非可编辑，用于定位和导航
- Component Type
- Source Dataset(s)
- Source Variable(s)

> Component 结构与第1节"多组件拼合建模"、第2节"Full-scope Review"的设计是对齐的。
> **StandardNote / ProgrammerNote 展示在 Shell Preview 下方**，不放在 Metadata 面板里，是独立的展示位置。

---

## 2. AI Understanding 主流程（v0.17 升级为主线，原备选方案内容整体并入并重写）

### 2.1 背景与流程

用户原来自己用大模型生成图时，是"人工输入 Shell + 数据结构 → AI 直接产出结果"，理解过程是黑盒。Atlas 设想反过来：先确保 AI 真的理解对了 Shell/需求，并且让用户看懂 AI 理解了什么。

**流程**：
1. AI 先生成一版 Code（基于对 Shell 的解析），**Figure 默认是上下视图，Code 直接展开，不做默认隐藏/折叠**
2. 用户打开 Figure，看到 **Shell Preview + Metadata + AI Copilot** 同时展开
3. 用户对照 Shell、Metadata、Copilot 的推理说明做 **Full-scope Review**（逐项完整检查，不是抽查）
4. 用户可以在 Metadata 里直接编辑字段（Components 视图开放编辑），也可以通过 Copilot 对话调整理解（比如坐标轴设置）
5. 用户如果对代码本身有疑问，可以主动展开查看（Review 阶段：先确认理解没问题，再看代码有没有问题，不强制先看代码）

**与"先看理解再批准生成"流程的区别**：这是一个折中方案——代码生成本身不需要用户批准（先斩后奏），但"理解是否正确"这件事，用户仍然可以确认/迭代，没有完全跳过审核。

### 2.2 三个面板各自的职责

- **Shell Preview**：展示 Shell 本身（图表占位模板：标题、坐标轴、图例、脚注等）。**本轮不做视图切换**（无 Spatial View、无 RTF Preview，因为 Runtime 不在本轮范围）。
- **Metadata 面板**：三态来源标注、Checkbox 确认、Confirm All 联动等交互**已在 Demo 中实现**，此处不再重复说明。
- **AI Copilot（常驻右侧）**：结构化推理呈现方式已在 Demo 中实现，此处只新增一点：**坐标轴设置的 Brief，放在推理内容里对应 Component 区块的下方**（即每个 Component 的字段列表之后，跟这个 Component 的坐标轴说明放在一起，不是单独放在整条推理的最前或最后）。

### 2.3 Full-scope Review 是必选主流程（PM 已确认原则）

- 每种 Figure Type 的 Component 结构可能都不一样，不建议写死每类 Figure Type 的 schema（穷举成本高、遇到变体容易误判），因此不采用"系统自动判定结构对不对"的路线
- 转而采用：**用户完整检查整个 Blueprint、Component、数据统计需求、布局和代码**（Full-scope Review），系统只负责诚实标注"这个值是哪来的"（三态标注）
- **不展示抽象的置信度分数**（如 65%、80%），这类数字对判断没有实际帮助，容易造成错误的安心感；应展示具体推断原因（Tooltip 内容）

---

## 3. Component 管理

### 3.1 新增 Component

- **触发场景**：Shell 里实际存在、但 AI 分析时未能识别或遗漏的 Component（例：Shell 里的 KM Plot 提供了中位数标注，AI 没有生成对应 Component），用户手动补充
- **入口位置**：新增 Component 的操作**在 Metadata 面板内完成**，不是独立弹窗或其他位置
- **交互方案（方向已定，具体细节待后续详细讨论）**：
  - **Type**：下拉选择，从预设的 Component Type 枚举中选
  - **描述**：自由文本框，用户选定 Type 后，文本框内**预填一份对应的 Template**（不是空白 placeholder，是已经写好的模板文字），用户在模板基础上编辑补充
  - 之所以必须先选 Type 才能进入描述阶段，是因为每种 Type 需要预先准备好对应的 Template 内容
  - **这个自由文本框需要在视觉上体现"AI 输入"的感觉，跟其他常规字段区分开**——因为它本质上更接近一个 AI 输入框/Prompt 入口，而不是普通的表单填空，具体呈现方式（比如是否带 AI 图标、输入框样式）待后续详细讨论
- 这个功能是 **AI 写回 Metadata 能力**（见第4节）最主要的应用场景

### 3.2 弃用 Component

- 用户可以把不需要的整个 Component 标记为"**弃用**"，**可复原**（弃用状态可以再切回启用）
- **删除操作（不可复原）是否仍保留**：v0.16 里 Component 操作同时包含"弃用"和"删除"两种，这次只明确提到"弃用"——**删除操作是否还要保留，需要你确认**，本文档先按保留处理，不擅自移除
- 弃用/删除严重程度不同，交互上需要能区分开（比如删除可能需要二次确认，弃用不需要），具体交互形式待细化（见第6节 TBD）

### 3.3 坐标轴设置（简述，详见 2.2 Copilot 部分）

- AI 需要理解坐标轴设置（Timelist、单位等），但技术上无法字段化到 Metadata，以 Copilot Brief 呈现，用户自定义通过 Copilot 对话解决
- 明确不需要 AI 理解的内容：颜色、图表整体视觉风格（沿用既有规则：颜色不要求严格还原，只需分组匹配）

---

## 4. AI 写回 Metadata 的能力

- **核心能力**：用户提供的自由文本（最主要场景是新增 Component 时的描述文本），AI 需要能够解析这段文本，并把结果**写回 Metadata 的结构化字段**（对应 Type/Dataset/Variable 等）
- **这项能力已确认要做，不是 TBD**——是新增 Component 这个功能能够落地的必要前提
- 这是一项**通用能力**，不只服务新增 Component 这一个场景：只要涉及"用户自由文本 → AI 解析 → 结构化字段"这条路径，都可以复用这套写回机制，为未来其他编辑场景打基础

---

## 5. Demo 呈现规则

| 区域 | 规则 |
|---|---|
| Tree list | Figure 文件节点，icon 用 `Figure.svg` |
| Shell Preview | 展示 KM Plot 示例，**本轮不做视图切换** |
| Metadata 面板 | 浮层形式，右上角图标按钮打开；三态标注 + Checkbox |
| AI Copilot | 常驻右侧，结构化推理 + 坐标 Brief + To be Reviewed 清单 |

---

## 6. 确定的 / TBD 汇总

### 已确定
- 整体处理框架参照 Table/Listing，输入先转 Blueprint；Component 是 Full-scope Review 的审核颗粒度。
- **AI Understanding 是本轮主线设计**，Runtime 移出本轮范围（不再保留详细内容，见第9节说明），Spatial View 已移除。
- **Full-scope Review 是必选主流程**：不写死 Figure Type 的 schema，不做独立 Risk Summary 页面，不展示抽象置信度分数；三态标注（有来源/AI推断/冲突）+ Checkbox 逐项确认是核心审核机制。
- **Metadata 三态标注规则**：有明确来源不标记；AI 推断用灰色边框文字 Badge；冲突用红色文字 Badge；Badge 距字段名 8px，不挨着 Checkbox；详情通过 Tooltip 展示（不常驻显示，且不被容器裁切）。
- **Checkbox 与 Confirm All 联动**：每字段一个 Checkbox，可与顶部 Confirm All 批量联动（全选/部分选/全不选）。
- **用户编辑权限**：Basic 视图只读；Components 视图可编辑、可替换。
- **Copilot 结构化呈现**：按 Component 分组展示推理内容，冲突信息行内标注，结尾固定 "To be Reviewed" 清单且不可省略。
- **坐标轴设置以 Copilot Brief 呈现**：坐标数值无法字段化到 Metadata；用户自定义需求通过 Copilot 对话解决，不需要额外的全局/单组件开关机制。
- **新增 Component 功能已确定方案**：Type 下拉 + 预填 Template 的描述文本框。
- **弃用 Component**：可复原操作，已确认。
- **AI 写回 Metadata 的能力已确认要做**：是新增 Component 等自由文本场景落地的必要能力，可复用于未来其他编辑场景。
- **StandardNote / ProgrammerNote 展示在 Shell Preview 下方**，不在 Metadata 面板里。
- 颜色不要求严格还原，只需分组匹配。
- Figure 的 Metadata 面板**复用 Table 的浮层卡片规则**。
- 多 Figure 类型（KM/Forest/Swimmer）Tree list icon **不做二级区分**，统一用 Figure.svg。
- **Figure 没有 Group / 汇总视图**。

### TBD 待确认事项

| 类别 | 待确认问题 | 当前假设 | Owner | 状态 |
|---|---|---|---|---|
| 产品决策 | **删除 Component（不可复原）操作是否仍保留**，还是本轮只做"弃用"这一种操作 | 先保留删除操作，待确认 | PM | 🔴 本轮设计需要确认（前置阻塞项） |
| 产品决策 | Component 弃用 / 删除的具体交互形式（是否需要二次确认等） | 待细化 | 前端 + PM | 🟡 评审后可跟进 |
| 产品决策 | Component Type / Source Dataset(s) / Source Variable(s) 是否可编辑（新增 Component 的描述字段不受此限，见第3节） | 暂按只读设计 | PM | 🟡 评审后可跟进 |
| 产品决策 | 三态标注被用户编辑后是否保留：初步结论是编辑即视为已判断，标注应清除、Checkbox 自动确认；**冲突字段的例外情况待确认**——用户编辑冲突字段时若选择的仍是原有候选值之一，算不算"真正解决了冲突" | 待确认 | PM | 🟡 评审后可跟进 |
| UI/呈现 | 坐标轴 Brief 具体怎么写、如何精简表达 | 待团队制定文案规范 | 前端 + PM | 🟡 评审后可跟进 |
| UI/呈现 | Add Metadata to Chat 的输入体验需要优化（当前发送后一大段 brief 占满输入框，不便继续补充输入）——**具体优化方案另开讨论，不在本文档展开** | 待讨论 | 前端 | 🟡 评审后可跟进 |
| 产品决策 | Figure 是否需要 Shell-only / Code-only 视图 | **先保留问题，暂不下结论** | PM | 🟡 评审后可跟进 |
| 产品决策 | AI Copilot 面板在 Table/Listing 场景下失去"空状态"：是否要按文件类型分开处理 AI 对话，还是给 T/L 也做统一 Summary | 待讨论方向 | PM | 🟡 评审后可跟进 |

---

## 7. 用户流程（本轮范围）

1. 用户上传 Shell、ADaM 等数据集、TFL 等文件。
2. AI 解析 Shell，生成 Blueprint / 结构化参数，同时生成一版 Code（**Figure 默认上下视图，Code 直接展开**）。
3. 用户打开 Figure，看到 **Shell Preview + Metadata + AI Copilot**：
   - Metadata 里每个字段按三态标注展示来源，用户逐项 Checkbox 确认（Full-scope Review）
   - Copilot 展示结构化推理，坐标轴 Brief 放在对应 Component 区块下方
4. 用户可以：直接编辑 Metadata 字段（Components 视图）、通过 Copilot 对话调整理解（如坐标轴设置）、新增遗漏的 Component、弃用不需要的 Component。
5. 用户对理解无误后，代码同步更新完毕；如需查看代码本身，可主动展开（不强制）。

---

## 8. 后续事项

- 确认删除 Component 操作是否保留
- 坐标轴 Brief 文案规范制定
- Add Metadata to Chat 输入体验优化方案（另开讨论）
- 新增 Component 的自由文本框（AI 输入感）具体交互形式待后续详细讨论
- 与 PM 核对 Metadata Basic 字段最终范围
- 前端 Tab 命名调整：TableCode 扩展为 FigureCode、GroupCode 等，需与 AV 对齐

---

## 9. 附录

- Shell 为固定输入模板，Figure 不使用 P code。
- 关联决策：Table 模块「Group Code 合并入 Table Code」「Confirm 与 pending-update 独立维度」规则见既有 Metadata 面板文档。
- 本版本未覆盖：Forest Plot / Swimmer Plot 的具体 Shell Preview 呈现（沿用相同框架，后续单独设计）。
- **参考来源**：Full-scope Review / 三态标注设计参考 PM 对 AI 审核方案的建议。
- 本文档整合了此前独立记录的《Figure-AIUnderstanding主导方案 PRD》内容，该文档后续以本文档为准。
- **Runtime 相关设计内容不再保留在本文档中**（第0节已明确移出本轮范围）；如需参考此前的 Runtime 详细设计，可查阅历史对话记录。
