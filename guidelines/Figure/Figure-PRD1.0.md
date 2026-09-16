# Figure 模块需求 v0.6


## 0. 本轮设计范围

本轮设计聚焦两个重点：

1. **Runtime**：Runtime log + Runtime 结果的 RTF，和 Shell 做比对——这是用户审核 Figure 是否正确的主要依据。
2. **跨 TFL 关联**：Shell 如果和 Table、Listing 存在依赖关系，需要在界面上体现出这层依赖关系。

**AI Understanding 暂不在本轮设计范围内**，作为备选方案完整记录在第 8 节，供后续需要时参考，不影响本轮设计推进。

---

## 1. 处理架构与输入设计（背景，非本轮设计重点）

**整体框架参照 Table/Listing**：输入先转换为 Blueprint（`figurableparameter`）。

| 维度 | Figure | 对比 Table/Listing |
|---|---|---|
| 新增字段 | **URI**（图片地址）、**Type**（图片类型） | 无 |
| 行列字段 | 无 | Table/Listing 有 |
| 保留字段 | Title、FullNote、StandardNote、ProgrammerNote、PageBud | 相同 |
| ADM/STM/SAP | 均需要，SAP 可能在 String7 中引入 | 相同 |
| P code | **不使用**（v0.1 已确认） | Table 使用 |

- **Figure 类型可枚举**：已与韩确认覆盖常见 study 场景；极特殊类型客户接受暂不支持，列为二期。
- **多组件拼合建模，Component 是最小单元**：Figure 通常由多个 **Component** 拼合（如 KM 图 = At-risk Table + Chart 两个 Component）。建模方式：按大类划块，主图排第一层，子 table 依次嵌套，内部结构与 Listing 相同。Component 也是本轮 Runtime 审核的颗粒度（见第2节）。
- **Metadata basic 字段说明（v0.6 澄清）**：Metadata basic 中已有一个字段，用途是**展示 Figure 与 T/L 的关联关系**。
1.1 Metadata 结构草案（v0.7 新增，部分待确认）
Basic：
Figure Type（KM/Forest/Spider/Swimmer 等）
Input Dataset(s)
Page by
Program Name（生成该 Figure 的程序/宏名称，与 P code 机制无关——Figure 不使用 P code，已在第1节确认）
Suffix：待定
Macro(s)
General Filter
Group：含义待澄清，可能指 Figure-T/L 关联字段，也可能是类似 Table 的 Group Code 概念（跨 Section 分组），两者完全不同，需要确认后再明确字段命名（见第6节 TBD）

Components：

Component Label：非可编辑，用于定位和导航
Component Type
Source Dataset(s)
Source Variable(s)

Component 结构与第1节"多组件拼合建模"、第2节"按 Component 拆分审核"的设计是对齐的。
待确认（未解决）：① 这版 Basic 列表里没有出现第1节已确认的 Title、FullNote、StandardNote、ProgrammerNote、URI，是精简还是遗漏，需要 PM 确认；② 3.3 节设计的 T/L 关联字段（chip 展示名称+状态色+可点击跳转）是否就是这里的 "Group" 字段，还是另需单独一行，待确认。
---

## 2. 设计重点一：Runtime（log + RTF 对比 Shell）

### 2.1 Runtime 方案

由 Code + Mock data 生成真实预览（RTF），拿它和 Shell 对比看差异。**本轮只考虑 Runtime 方案，不考虑 Template/前端组件预览方案**（v0.6 已确认）。

- 有耗时，需设计等待状态和外部服务失败的 fallback
- AI 生图可能发生**位置偏移**，需要容错展示
- **展示区域需求（v0.6 新增）**：Figure 除了 Shell 图片本身，需要一个独立的地方展示"非 Shell"内容——不管这块内容最终是 Runtime 跑出的 RTF、AI 生的图、还是代码生的图，都需要有统一的展示位。这是布局层面的需求，跟内容具体怎么触发生成是两件事。

### 2.2 审核依据：log + RTF 对 Shell

用户判定 Runtime 结果正确性 = **log（执行错误）+ RTF（渲染是否符合预期，对照 Shell 说明核查）**。这是本轮设计的核心审核体验。
Log 与 RTF 分工不同，不是同等回答"生成对不对"：
- Log 回答"这次跑得干不干净"：ERROR 出现说明代码没跑通，生成结果大概率残缺，用户可以直接跳过、不用花时间看 RTF——这是效率筛查作用。
-RTF 对照 Shell 回答"AI 理解的结构对不对"：代码干净跑完不代表 Component 拼对了、图表类型选对了、变量映射对了，这类语义/结构问题只能靠 RTF 逐项对照 Shell、按 Component 拆分审核才能发现，Log 看不出来。
- WARNING 是最容易被忽略的中间地带：代码"成功"跑完但可能存在类型不匹配、数据截断等问题，这类问题未必会在 RTF 上肉眼可见，容易被用户漏审。WARNING 不该被当成"失败"直接拦截（不同于 ERROR），但也不该淹没在大量 NOTE 里没人看——应作为系统主动标记的风险点之一（见下方 Review checklist），提醒用户"结果可能不完全可靠，多看一眼"。
- 结论：Log 提供筛查效率和隐性风险预警，RTF 对照 Shell 才是判断"生成结构是否正确"的主要举证依据，Log 不能替代它。


Review 判定标准：
- Preview 审核标准是"元素是否齐全"，不是像素级比对
- Code 审核标准是"跑通 + 数据没问题"
- 审核颗粒度按 Component 拆分，用户可以逐个 Component 审核，而不是整图一次性判断

**设计要点**：
- log 与 RTF 建议同屏或低成本切换查看，避免用户来回跳转丢失上下文
- 错误来源分两类：LOG（执行报错） / 渲染本身是否符合预期（**对照 Shell 的说明文字比对**，不是额外文档）
- log 报错信息的可读性和定位精度，直接影响用户能否自行判断问题出在数据映射、代码还是渲染，前端呈现粒度需单独设计

### 2.3 MockData（Runtime 方案的关键依赖）

- 现有方案为一次性项目级生成，不具备通用复用能力。
- 推荐方案：接入大模型生成 MockData，支持映射、衍生、补全缺失 Domain；每次增补的数据应回写原始数据集，持续完善。
- **合规提示（重要）**：写 Code 阶段很少有真正的 Dummy data，分组可能是假的，但**数据本身是项目真实数据、尚未接盲（未 unblind）**。任何涉及 Mock/测试数据展示的界面都需要确认不会意外暴露分组或破盲信息。

### 2.4 Table / Listing / Figure 对 Runtime 的需求程度不同

| 类型 | 是否需要 Runtime | 说明 |
|---|---|---|
| Table | 意义有限 | 数据是 Mock，只能看 Display 对不对，看不出统计方式对不对 |
| Listing | 不需要 | 依据 CSV + LOG 即可判断 |
| Figure | **价值最高** | 依据是 RTF + LOG，是本轮设计重点 |

2.5 Run 触发机制、Log 位置与失败态设计（v0.7 新增）

Run 无独立按钮：通过 Code 编辑器与 RTF Preview 的视图切换隐式触发——用户切到 RTF Preview，即对当前代码触发一次 Run。

Log 只在 Preview 视图展示，Code 视图不放 Log。这样用户切到 Preview 审核时，log + RTF 是同屏的，满足 2.2 节"同屏或低成本切换查看"的要求。

触发逻辑：代码有改动才重新触发 Run；没有改动则直接显示上次结果，不重复跑（避免浪费耗时/算力）。"代码是否变更"的具体判断方式待定（见第6节 TBD）。

Loading 态：文案统一为 Loading Preview...Please wait。

失败态设计（区分两类原因，均居中展示在 Preview 区域中间）：

参考了 Lovable、Google AI Studio、Bolt 等实时生成工具的做法后，共性经验是——错误要直接显示在预览区域本身、不要静默失败；提供低成本的重试动作但不自动无限重试；失败原因要分层说明，不要一句"出错了"糊弄过去。据此设计两种失败态：

失败类型触发场景Preview 中间展示内容代码执行报错log 有报错，是代码/数据本身的问题图标 + "生成失败，请查看 Log "。外部服务失败（fallback）Runtime 依赖的外部渲染/大模型服务无响应、超时或报错，与用户代码无关图标 + "生成服务暂时无法响应，与代码无关，请稍后重试" + "重试"按钮

两种失败态都不自动重试，由用户主动操作

## 3. 设计重点二：跨 TFL 关联展示

### 3.1 关联本质

- Figure 不一定关联具体某个 Table/Listing，它的关联本质是**和 Study 共享**（可能与某个 T/L 共享同一 final dataset，但不是必然对应关系）。
- **关联查找范围**：从**已发现的 T/L 集合**里找候选，不是全量搜索。
- **Figure-Table 候选关联三层逻辑**（SP 提供）：
  1. 按总典（如 OSDOR）找候选
  2. 按 Title 关键信息（Subgroup、分层等）匹配
  3. 按统计量子集确认附庸关系（Figure 统计量通常是 Table 已计算统计量的子集）

### 3.2 执行顺序

关联关系需在定型编排中存储，**Figure 须等待 T/L 跑完后再执行**（仅存在跨 TFL 依赖时才需要；不依赖的 Figure 无需等待）。这个顺序安排也是为了复用已发现的 T/L 关联对象。当前 AI Agent 为单表能力，跨 TFL 分析需改造现有定格流程。

### 3.3 界面需要体现依赖关系（本轮设计核心）

- **落点已明确**：Metadata basic 中已有字段用于展示 Figure-T/L 关联，设计应基于这个字段展开具体呈现方式，不是从零设计一个新位置。
- T/L 关联字段具体设计（v0.7 新增，默认只关联一个 T/L）：
-- 字段仍是 Metadata 字段列表里的一行，不单独拆成新模块——保持列表视觉节奏一致
-- 这一行展示：关联对象名称/编号（如"Table 14.2.1"，不放标题全文）+ 执行状态（排队中/生成中/已完成/失败，四态状态色或标签）+ 整行可点击跳转到对应 T/L
-- 不展示 AI 判断关联的依据（总典匹配/Title匹配/统计量子集三层逻辑）——Programmer 只需要知道关联的是谁、什么状态、点哪里能看，不需要看推理过程
无关联对象时显示"无关联"占位，不整行隐藏，保持列表高度一致
该字段系统生成、只读，不适用 Confirm/pending-update 那套编辑状态规则
- **角色可见性问题**：Programmer 和统计师是两个角色，Shell 由统计师画，Programmer 拿到 Shell 时**不一定知道它和哪些 Table 有关联**（例如 PK 浓度图关联到显示 SD/Q1/Q3 的 Table，线索藏在 Title 里）。**系统需要主动把关联性显示给 Programmer**，不能指望人工从 Title 里自己猜。
- 执行顺序、等待状态、依赖提示都需要在前端明确告知用户（例如「该 Figure 依赖 XX Table，正在等待其完成」）。
- 若 Figure 为某 Table 的附庸，理论上可直接引用该 Table 数据、跳过重复推理，但**必要性不大**，可先做提示，正式数据集阶段再考虑引用结构。

### 3.4 其他

- **颜色规则**：无需严格还原，Shell 里统计师画的颜色 Display 时候无所谓，只需颜色与分组匹配即可。
- 跨 TFL 对象数量大（230–270 个），直接整体分析可能超限，建议先拆结构再并行识别类型。

### 3.5 「Run」的最终落地形态（v0.7 更新）

v0.6 里推测的"独立 Run 按钮"已确认不成立：Run 没有单独的工具条按钮，而是通过 Code ↔ RTF Preview 的视图切换隐式触发——用户切到 RTF Preview，相当于对当前代码 Run 一次。具体机制、Log 展示位置、失败态设计见 2.5 节。

---

## 4. 前端/设计要考虑的点（聚焦本轮两个重点）

- **Runtime 审核体验**：log + RTF 同屏或低成本切换；错误来源区分 LOG / 渲染对照 Shell 说明；按 Component 拆分审核；系统主动标记异常/低置信度风险点，不靠用户通篇自查；Preview 判定标准是"元素齐全"而非像素级比对。
- **依赖关系可见性**：系统主动把 Figure 与 Table/Listing 的关联展示给 Programmer；执行顺序、等待状态、依赖提示要在界面上明确表达。
- **命名体系要统一**：Tab 命名从 TableCode 扩展到 FigureCode、GroupCode 等，需与 AV 对齐。

---

## 5. Demo 呈现规则（延续 v0.1，暂未改动）

| 区域 | 规则 |
|---|---|
| Tree list | Figure 文件节点，icon 用 `Figure.svg` |
| Shell Preview | 展示 KM Plot 示例 |
| Code 区 | Figure 相关 SAS Code，不含 P code |
| 整体视图 | Shell Preview 与 Code 左右布局（区别于 Listing 的上下布局） |

---

## 6. 确定的 / TBD 汇总

### 已确定
- 整体处理框架参照 Table/Listing，输入先转 Blueprint；Component 是最小审核单元。
- **Runtime（log + RTF 对比 Shell）是本轮设计重点**，且是 Figure 唯一有较高验证价值的 TFL 类型；**本轮只考虑 Runtime 方案，不考虑 Template/前端组件预览**。
- **跨 TFL 关联展示是本轮设计重点**：Figure 关联本质是和 Study 共享，需要在界面上主动体现依赖关系给 Programmer 看；**Metadata basic 中已有落点字段**，设计基于该字段展开。
- 需要一个独立展示区域放置非 Shell 内容（RTF/AI生图/代码生图），与内容触发方式无关。
- 若存在跨 TFL 依赖，执行顺序为先 T/L，后 Figure；关联查找范围限定在已发现的 T/L 集合内。
- 颜色不要求严格还原，只需分组匹配。
- Mock/测试数据本身未接盲，涉及合规红线，界面设计需规避破盲风险。
- Figure 的 Metadata 面板**复用 Table 的浮层卡片规则**。
- 多 Figure 类型（KM/Forest/Swimmer）Tree list icon **不做二级区分**，统一用 Figure.svg。
- **Figure 没有 Group / 汇总视图**。
- **AI Understanding 不在本轮设计范围**，完整方案见第8节备选记录。

### TBD 待确认事项

| 待确认问题 | 当前假设 | Owner | 状态 |
|---|---|---|---|
| log 报错信息的呈现粒度与定位精度设计 | 待设计 | 前端 + AI 团队 | 🔴 本轮设计需要确认 |
| Figure 依赖 T/L 时的等待态/依赖提示具体交互形式 | 待设计 | 前端 | 🔴 本轮设计需要确认 |
| MockData 最终接入方案（大模型生成 + 回写机制）如何落地 | 方向已定，落地方式未定 | AI 团队 | 🟡 评审后可跟进 |
| MobileData 是否一定可用，影响 Runtime 预览设计 | 待与 AZ 确认 | AZ | 🔴 本轮设计需要确认 |
| Figure 对 Table 数据的直接引用是否正式做 | 必要性不大，先做提示 | PM | 🟡 评审后可跟进 |
| 跨 TFL 分析流程改造方案（现 AI Agent 为单表能力） | 待改造 | AI 团队 | 🟡 评审后可跟进 |
| Figure 是否需要 Shell-only / Code-only 视图 | **先保留问题，暂不下结论** | PM | 🟡 评审后可跟进 |
| **「Run」按钮的具体用途与范围**（推测为 Run SAS Code，是否本期做取决于 CO） | 产品化方向需要，可先按 iDM 参考设计占位 | PM | 🟡 评审后可跟进 |

---

## 7. 用户流程（本轮范围）

1. 用户上传 Shell、ADaM 等数据集、TFL 等文件，系统转换为 Figure Blueprint。
2. 若该 Figure 依赖某个 Table/Listing 的 final dataset，先跑对应的 Table/Listing；**这期间 Figure 可以显示"排队中"状态，也可以先不显示**（两种做法都可以，待落地时按前端节奏选择），并在界面上明确展示这层依赖关系（非必经步骤，仅存在跨 TFL 依赖时触发）。
3. 执行 Figure 的 Runtime 生成与渲染预览。
4. 展示 **RTF + log**，用户按 Component 拆分审核结果是否符合预期（对照 Shell 说明核查），系统预先标记异常/低置信度风险项。
5. 有问题则回退修改参数/数据映射，重新执行。

> 若 Runtime 走不通（耗时过长/失败/前端不稳定），本轮暂不设计对应的替代路径，参考第8节备选方案。

---

## 8. 备选方案（本轮设计不涉及）：AI Understanding

> 以下内容完整保留自 v0.4，作为后续需要时的参考，**不影响本轮设计推进**。

**背景动机**：用户原来自己用大模型生成图时，是"人工输入 Shell + 数据结构 → AI 直接产出结果"，理解过程是黑盒。Atlas 设想反过来：先确保 AI 真的理解对了 Shell/需求，并且让用户看懂 AI 理解了什么。

**假设的定位**：Runtime 走不通时的备选（Runtime 慢 / 失败 / 图复杂 / 前端不稳定出结果）。

**假设的展示内容**：AI Understanding 展示"生成 Code 如何理解 Shell"（代码层面的理解映射）。

**假设的呈现形式**（不止一种）：
- 自然语言描述
- Layout sketch：AI 直出的低保真结构示意图，本身不是真实输出，不嵌在 Runtime 流程里

**AI 识图算法链路设想**：
1. 读 Title 判断类型
2. 读该类型对应内容
3. 读 FullNote —— FullNote 与图内容冲突时，以 FullNote 为准
4. 判断组件（Component）构成
5. 图例统一放右上角

**面板位置候选**：Metadata / Copilot / Profiler，未定。

**未解决问题**：AI 理解本身要怎么被 Review、以什么形式输出理解，目前没有答案。

---

## 9. 后续事项

- Runtime log 报错的呈现粒度与定位精度设计（本轮）
- Figure 依赖 T/L 的等待态/依赖提示交互设计（本轮）
- 与 AZ 确认 MobileData 可用性，影响 Runtime 预览设计（本轮）
- 前端 Tab 命名调整：TableCode 扩展为 FigureCode、GroupCode 等，需与 AV 对齐
- 与 PM 确认「Run」按钮的具体用途（是否为 Run SAS Code）及本期范围
- （非本轮）与 UI、AI 团队讨论 AI Understanding 的呈现形式与面板位置，视后续需要再启动

---

## 10. 附录

- v0.1 已确认规则：Shell 为固定输入模板，仅 Preview 随代码变化；Figure 不使用 P code。
- 关联决策：Table 模块「Group Code 合并入 Table Code」「Confirm 与 pending-update 独立维度」规则见既有 Metadata 面板文档。
- 本版本未覆盖：Forest Plot / Swimmer Plot 的具体 Shell Preview 呈现（沿用相同框架，后续单独设计）。
- **合规提示**：MockData 涉及真实项目数据、未接盲，任何设计方案接触到测试/Mock 数据展示时需评估破盲风险（见第2节）。
