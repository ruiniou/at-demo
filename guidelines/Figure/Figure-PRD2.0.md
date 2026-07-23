# Figure 模块需求 v0.15

---

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
| P code | **不使用** | Table 使用 |

- **Figure 类型可枚举**：已与韩确认覆盖常见 study 场景；极特殊类型客户接受暂不支持，列为二期。
- **多组件拼合建模，Component 是最小单元**：Figure 通常由多个 **Component** 拼合（如 KM 图 = At-risk Table + Chart 两个 Component）。建模方式：按大类划块，主图排第一层，子 table 依次嵌套，内部结构与 Listing 相同。Component 也是本轮 Runtime 审核的颗粒度（见第2节）。
- **Metadata basic 字段说明**：Metadata basic 中已有一个字段，用途是**展示 Figure 与 T/L 的关联关系**。这意味着第3节"跨 TFL 关联展示"这个设计重点，已经有明确的落点可以基于设计，不是从零找地方放。

### 1.1 Metadata 结构草案（已用 Atlas 实际界面截图核对）

**Basic（与 Atlas 实际界面核对一致，共 8 项，对应面板"X/8 confirmed"计数）：**
- **Associated Table/Listing**（即 3.4 节的关联字段，独立一行，不是 "Group"）
- Figure Type（KM/Forest/Spider/Swimmer 等）
- Input Dataset(s)
- Page by
- Program Name（生成该 Figure 的程序/宏名称，**与 P code 机制无关**）
- Macro(s)
- General Filter
- Group（**含义已确认与关联字段无关**，示例值为 "Treatment Group"，是分组变量相关字段，与 Table 的 Group Code 概念是否相同仍不确定）

**Components：**
- Component Label：非可编辑，用于定位和导航
- Component Type
- Source Dataset(s)
- Source Variable(s)

> Component 结构与第1节"多组件拼合建模"、第2节"按 Component 拆分审核"的设计是对齐的。
> **StandardNote / ProgrammerNote 展示在 Shell Preview 下方**，不放在 Metadata 面板里，是独立的展示位置。Title/FullNote/URI 是否也在 Shell Preview 附近展示、还是另有位置，暂未明确。

---

## 2. 设计重点一：Runtime（重写）

### 2.1 Runtime 方案

Figure 完成首次 AI 分析后，系统**自动触发一次 Runtime**，生成一份 AI 生成版本的预览（RTF），供用户预览审核——这次触发**不是用户手动点出来的**，不存在 Run 按钮，也不存在"切到 Preview 视图触发"这种交互机制。

**核心规则：一次性，编辑即锁定**
- 这次自动生成只发生**一轮**，用户可以预览这一版 AI 生成的结果
- **一旦用户自己编辑代码，就无法再触发新一轮 Runtime**——不支持"改代码 → 重新生成 → 再看新结果"这个循环
- **用户编辑代码后，AI 最初生成的 RTF 需要保留、可供回看**，作为参照对象（已确认）

**耗时说明**：运行耗时目前不确定，团队仍在优化中，暂不能给出具体等待时长预期，Loading 态设计仍需要（见2.5），但不做具体秒数承诺。

**展示区域需求**：Figure 除了 Shell 图片本身，需要一个独立的地方展示这份 AI 生成的 RTF 内容，这是布局层面的需求，与触发方式解耦。

- AI 生图可能发生**位置偏移**，需要容错展示

### 2.2 审核依据：log + RTF 对 Shell

用户判定 Runtime 结果正确性 = **log（执行错误）+ RTF（渲染是否符合预期，对照 Shell 说明核查）**。这是本轮设计的核心审核体验。

**Log 与 RTF 分工不同，不是同等回答"生成对不对"**：
- **Log 回答"这次跑得干不干净"**：ERROR 出现说明代码没跑通，生成结果大概率残缺，用户可以直接跳过、不用花时间看 RTF——这是效率筛查作用。
- **RTF 对照 Shell 回答"AI 理解的结构对不对"**：代码干净跑完不代表 Component 拼对了、图表类型选对了、变量映射对了，这类语义/结构问题只能靠 RTF 逐项对照 Shell、按 Component 拆分审核才能发现，Log 看不出来。
- **WARNING 是最容易被忽略的中间地带**：代码"成功"跑完但可能存在类型不匹配、数据截断等问题，这类问题未必会在 RTF 上肉眼可见，容易被用户漏审。WARNING 不该被当成"失败"直接拦截（不同于 ERROR），但也不该淹没在大量 NOTE 里没人看——应作为系统主动标记的风险点之一（见下方 Review checklist），提醒用户"结果可能不完全可靠，多看一眼"。
- **结论**：Log 提供筛查效率和隐性风险预警，RTF 对照 Shell 才是判断"生成结构是否正确"的主要举证依据，Log 不能替代它。

**Review 判定标准**：
- Preview 审核标准是"**元素是否齐全**"，不是像素级比对
- Code 审核标准是"跑通 + 数据没问题"
- 审核颗粒度按 **Component** 拆分，用户可以逐个 Component 审核，而不是整图一次性判断

**Review checklist（系统主动筛查）**：系统应主动标记异常、低置信度风险信息（**包括 Log 中的 WARNING**），交给人工 QC 复核——审核不是让用户自己通篇找问题，而是系统先筛一遍、圈出风险点。

**设计要点**：
- log 与 RTF 建议同屏或低成本切换查看，避免用户来回跳转丢失上下文
- 错误来源分两类：LOG（执行报错） / 渲染本身是否符合预期（**对照 Shell 的说明文字比对**，不是额外文档）
- log 报错信息的可读性和定位精度，直接影响用户能否自行判断问题出在数据映射、代码还是渲染，前端呈现粒度需单独设计

**Log 定义澄清**：Log **不只是报错信息**，包含完整的 **runtime 过程信息**（ERROR/WARNING/NOTE）。**展示时机**：实时展示 vs 跑完后展示尚待确认，**当前假设是跑完后展示**。**展示位置确认在 Preview 视图内**（与 RTF 同屏，见2.5），不在 Code 视图。

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

### 2.5 首次自动生成的触发、Log 位置与失败态设计（重写）

**触发方式**：Figure 首次 AI 分析完成后，系统自动触发这一轮 Runtime，**不是用户点按钮或切换视图触发的**。用户在这个过程中是被动等待/查看的角色，不需要做任何操作来"启动"它。

**Log 只在 Preview（RTF结果）视图展示，Code 视图不放 Log**（Code 视图内不额外做错误摘要/提示，保持简洁），用户查看这一轮结果时，log + RTF 同屏。

**Loading 态**：文案统一为 `Loading Preview...Please wait`，具体等待时长不确定（见2.1），设计上按"耗时可能较长"来处理等待体验，而不是假设很快完成。

**失败态设计（区分两类原因，均居中展示在 Preview 区域中间）**：

参考了 Lovable、Google AI Studio、Bolt 等实时生成工具的做法后，共性经验是——错误要直接显示在预览区域本身、不要静默失败；提供低成本的重试动作但不自动无限重试；失败原因要分层说明，不要一句"出错了"糊弄过去。据此设计两种失败态：

| 失败类型 | 触发场景 | Preview 中间展示内容 |
|---|---|---|
| **代码执行报错** | log 有报错，是代码/数据本身的问题 | 图标 + "生成失败，请查看 Log 定位问题"（Log 本身已同屏展示在旁侧/下方，不需要额外跳转，可考虑高亮或滚动定位到具体报错行） |
| **外部服务失败（fallback）** | Runtime 依赖的外部渲染/大模型服务无响应、超时或报错，与用户代码无关 | 图标 + "生成服务暂时无法响应，与代码无关，请稍后重试" + "重试"按钮 |

- 两种失败态都**不自动重试**，由用户主动点击操作触发"重试"——但这里的"重试"指的是**对这次失败的首次生成再试一次**，不是"改完代码后再跑一次"那种重新生成，两者本质不同，不要混淆
- 两者视觉上需要能区分开（如图标、色调不同），避免用户把"外部服务问题"误以为是自己代码写错了，反过来改代码
- **报错文案本身**，按最新反馈应该由 AI 侧提供、走通用文案模板 + 对应功能按钮显示规则（不是产品侧写死），表格里的具体文案只是占位参考，需要推动 AI 团队对接落实

---


## 4. 前端/设计要考虑的点（聚焦本轮两个重点）

- **Runtime 审核体验**：log + RTF 同屏或低成本切换（Log 只在 Preview 视图展示，Code 视图不放）；错误来源区分 LOG / 渲染对照 Shell 说明；按 Component 拆分审核；系统主动标记异常/低置信度风险点，不靠用户通篇自查；Preview 判定标准是"元素齐全"而非像素级比对。
- **Run 首次自动触发**：Figure 首次 AI 分析完成后系统自动执行一次，非用户手动触发；编辑代码后无法重新触发；Loading 文案统一为 `Loading Preview...Please wait`，耗时具体数值不确定。
- **失败态要区分原因**：代码报错 vs 外部服务失败（fallback），两者视觉需可区分，都居中展示在 Preview 中间，提供用户主动触发的重试，不自动重试。

---

## 5. Demo 呈现规则

| 区域 | 规则 |
|---|---|
| Tree list | Figure 文件节点，icon 用 `Figure.svg` |
| Shell Preview | 展示 KM Plot 示例 |
| Code 区 | Figure 相关 SAS Code |
| 整体视图 | Shell Preview 与 Code 左右布局（区别于 Listing 的上下布局） |

---

