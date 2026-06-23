---
fileClass: "Document"
title: "AZ-Atlas 产品背景文档（初版）"
date: 2026-04-30
allDay: true
type: "single"
noteType: "document"
source_workspace: "Taimei"
source_collection: "Documents"
source_file: "Private &/Taimei - i2r694whces/Document - 4n9d258o6ad/AZ-Atlas 产品背景文档（初版）.md"
Original: "No"
Projects:
  - "[[Work/Taimei/Projects/AZ-Atlas|AZ-Atlas]]"
日期: "2026/04/30"
标签: "Product Spec"
---
# AZ-Atlas 产品背景文档（初版）

## 产品定位

AI 驱动的临床统计分析自动化平台——从规范到 TFL 输出的「一键运行」系统。核心思路：**让 AI 基于已有标准宏库组装代码**，兼顾灵活性与可靠性。

## 背景

临床研究需要生成大量 TFL（Tables, Listings, Figures），常达数千页，用于撰写 CSR（临床研究报告）。目前由统计程序员手工根据 SAP + ADaM Spec 编写 SAS 程序，**耗时且易出错**。业界一直在探索自动化方案，CDISC 2024 年发布的 ARS v1.0、PHUSE 2025 Atlas 框架等都在推动这一方向。

### 现有资源

- **标准宏库**：4～50 个可复用 SAS 模块，每个封装 3～5 个宏，覆盖人口学、疗效、安全性等常见分析
- **统一文档模板**：Shell 模板、ADaM Spec、SAP、SOP，均为标准化格式，便于机器解析
- **历史项目数据**：约 2000 页 RTF 输出 + 对应 SAS 程序和数据集

## 用户

- **统计程序员**（主要用户）：日常编写 SAS 代码生成 TFL，自动化后转为监督者和验证者
- **统计师 / Biostatistician**：编写 SAP、审核分析结果
- **QC 人员**：负责结果验证和合规审计

## 痛点

1. **手工编码耗时**：每个项目数千页 TFL，程序员逐一编写宏调用，重复劳动量大
2. **易出错**：参数填写、数据集引用、过滤条件等环节容易人为失误
3. **规范解读瓶颈**：SAP/Shell 中的自然语言描述需要程序员人工理解并翻译成代码逻辑
4. **SAS 代码在公开训练数据中样本少**：通用 AI 模型直接生成 SAS 成功率不高，需要专门适配
5. **合规压力**：监管要求（FDA/EMA）对代码和结果的可追溯性、审计追踪有严格要求

## 解决方案

端到端自动化流程，AI 充当「大脑 + 翻译」，串联文档解析 → 宏匹配 → 代码生成 → 执行 → QC：

1. **解析输入规范**：AI 读取 SAP / Shell / ADaM Spec，提取结构化分析需求（人群、终点、表格布局、统计指标），生成「TFL 订单表」
2. **宏匹配与参数决策**：基于宏索引表，AI 为每个输出匹配最优宏 + 自动填充参数（数据集、变量、过滤条件、标题等）
3. **生成 SAS 脚本**：AI 组装完整脚本（%include 宏库 + 顺序宏调用），非从零写代码
4. **执行并生成输出**：Python（SASPy）调度 SAS 运行，收集 RTF/PDF/图形结果
5. **质量控制**：双重运行交叉比对 + 关键指标验算脚本 + 人工终审签字

## 关键场景

| 场景 | 描述 |
| --- | --- |
| **新项目启动** | 导入 SAP + Shell + ADaM Spec → 系统自动解析生成全套 TFL 宏调用脚本 |
| **批量 TFL 生产** | 一键提交脚本 → SAS 批处理运行 → 自动归集数千页输出 |
| **QC 交叉验证** | 两套独立代码/模型分别生成结果 → 自动比对差异 → 标记需人工检查项 |
| **迭代修正** | AI 解析出错或宏不匹配时，系统标记低置信项 → 程序员介入修正 → 反馈训练模型 |
| **SAP 变更** | SAP 修订后重新解析 → 增量更新受影响的宏调用和参数 |

## 重要功能模块

### 1. 文档智能解析（AI）

- NLP 提取 SAP / Shell 中的分析需求、人群定义、统计方法
- 支持结构化模板直接映射 + 自由文本 AI 理解
- 低置信度内容自动标记，交由统计人员确认

### 2. 宏索引与智能匹配（AI）

- 维护宏索引表（用途、参数、示例）
- AI 将分析需求映射到最优宏，超出宏库能力时提示人工补充
- 可结合 CDISC ARS 元数据精准驱动

### 3. SAS 代码自动生成（AI）

- 基于宏库模板组装代码，非全新编写
- 专用模型微调 / RAG 检索增强，确保 SAS 语法正确
- 遵循公司编码规范和 SOP

### 4. Python 调度与 SAS 执行

- SASPy / SAS Viya API 集成
- 批处理提交 → 日志捕获 → 错误监控 → 结果归集

### 5. 质量控制与审计追踪

- 双重运行比对机制
- 全链路审计日志（AI 决策、宏选择、参数来源）
- 满足 GxP 验证要求

### 6. 持续学习与反馈

- 每个项目的修正反馈用于模型迭代训练
- 宏库定期扩充，支持新统计方法

---

## AI Copilot

| **ID** | **类别 (Category)** | **功能名称 (Feature Name)** | **用户意图/场景描述 (User Intent/Scenario)** | **系统行为/技术实现 (System Behavior)** |
| --- | --- | --- | --- | --- |
| A-01 | 交互动作 (Interaction Intents) | 解释与注释 (Explain & Comment) | 给这段数据步加上详细注释，说明过滤逻辑。 | 分析代码意图，在关键行上方插入 SAS 注释 (* Comment;)。 |
| A-02 | 交互动作 (Interaction Intents) | 错误修复 (Fix Error) | Log 报错说变量 AVAL 类型不匹配，帮我修一下。 | 读取 Error Log，自动在先前的数据处理步中插入 input(AVAL, best.) 类型转换代码。 |
| A-03 | 交互动作 (Interaction Intents) | 逻辑确认生成 (Logic Confirm & Gen) | 我要生成一个响应表，但逻辑比较复杂。 | 关键步骤：先用自然语言复述逻辑（'我打算先过滤 ITT，再计算 CR+PR...'），用户回复'确认'后，才生成代码。 |
| B-01 | 修改范围 (Modification Scope) | 局部修改 (Local Modification) | 只改这个 PROC REPORT 的列宽。 | 锁定光标所在的 Procedure 或 Data Step，仅对该区块应用 Diff，严禁修改文件其他部分。 |
| B-02 | 修改范围 (Modification Scope) | 全局修改 (Global Modification) | 把整个程序里的 SAFFL 都换成 FASFL。 | 扫描整个文件及其依赖的宏调用，执行上下文敏感的全局替换。 |
| C-01 | 业务类型 (Domain Types) | 数据处理修改 (Data Processing) | 增加一个过滤：排除 Site 701。 | 智能定位到 SET 语句之后、逻辑计算之前，插入 if siteid='701' then delete;。 |
| C-02 | 业务类型 (Domain Types) | 布局调整修改 (Layout Adjustment) | 把 P 值这一列移到最右边。 | 识别展示宏（如 %table_sp），重新排列 Vars= 参数中的变量顺序。 |
| C-03 | 业务类型 (Domain Types) | 测试数据生成 (Dummy Data Gen) | 给我造一个 10 行的 ADAE 假数据测一下。 | 生成一段 data work.adae; input ... datalines; 代码，包含能够跑通当前表格的最少必要变量。 |
| SYS-01 | 系统能力 (System Capabilities) | 上下文感知 (Context Awareness) | N/A | 保持对当前文件的状态感知（宏上下文、数据上下文、逻辑流）。 |
| SYS-03 | 系统能力 (System Capabilities) | 数据集扫描 (Dataset Scan) | N/A | 工具: @scan_dataset(ds_name) - 返回数据集中的变量列表。 |
| SYS-04 | 系统能力 (System Capabilities) | 宏查找 (Macro Lookup) | N/A | 工具: @lookup_macro(name) - 返回公司内部宏的有效参数。 |

User Prompt Type：

- Ask
    - 解释代码逻辑/行为逻辑
    - 询问Macro信息
    - 询问ADaM信息
- Plan
- Build
    - Code上添加注释
    - Table维度错误修正
    - Block Cluster维度错误修正
    - Block维度错误修正
    - 局部逻辑错误修正
    - 语法错误修正
    - ……

### **解决问题能力要求**

Agent 需要根据用户输入 **自动判断任务类型，并决定输出模式**。（核心依据：是否需要修改Code，若需要，修改的范围和量+用户需求的明确程度）

Agent需具备的能力（按需使用）：

- 获取当前最新的Table Code
- 获取Table原始需求（Json）
- 获取当前Table关联的Group相关内容
- 获取历史Code生成思考过程、依赖内容
- 获取ADaM Spec信息
- 获取Macro知识库
- 获取O-GEM Manual
- 获取其他知识
- 获取Table维度连续对话的上下文（包括部分用户行为）
- 带着User Input重新执行某一节点
- 带着User Input重新执行某一节点及其后续
- 评估判断影响范围，需改动的Code点
- 模型自身能力
- 断点反问/待用户确认/选择
- 输出形式约束Response Schema

---

## 附：TFL 与 Code 的关系

### TFL 三者区别

|  | Tables | Listings | Figures |
| --- | --- | --- | --- |
| **是什么** | 汇总统计表 | 逐条数据清单 | 图形 / 可视化 |
| **内容** | 经过统计计算的聚合结果（均值、百分比、p 值等） | 原始或派生数据的逐行展示，不做聚合 | 用图表呈现趋势、分布、生存曲线等 |
| **典型例子** | 人口学特征表、不良事件发生率表、疗效终点对比表 | 受试者用药记录清单、实验室检测值清单、方案偏离清单 | Kaplan-Meier 生存曲线、瀑布图、森林图 |
| **用途** | 统计师审核 + 写入 CSR 正文 | 审计 / 核查用，附在 CSR 附录 | CSR 正文 + 演示汇报 |

简单记：**Tables 看汇总，Listings 看明细，Figures 看趋势。**

### 为什么必须用 Code 生成 TFL

类比：大学生写论文时，数据处理和图表制作过程是不透明的——Excel 里拖拖拽拽，贴个结果就行，没人追究中间步骤。但临床研究涉及药物上市审批和患者安全，监管机构（FDA / EMA）要求**每一步计算都能被第三方独立复现**。

代码（SAS 程序）就是那条「透明的链路」，它解决了以下问题：

1. **可复现**：别人拿到同样的数据 + 代码，跑出来的结果必须一致。手动操作无法保证这一点。
2. **可审计**：GxP 合规要求每一步操作有据可查。代码本身就是审计证据——谁写的、什么逻辑、用了什么参数，一目了然。
3. **批量效率**：一个项目可能出几百张表、几十张图。代码写好后一键批量运行，几分钟完成；手动做可能要几周。
4. **质量控制**：行业标准做法是「双人独立编程」（double programming）——两个程序员分别写代码生成同样的输出，比对结果一致才通过。这个 QC 流程的前提就是有代码。
5. **数据量与复杂度**：一个临床试验可能有几十个数据集、数百个变量，手动操作根本不现实。

所以这个项目的核心不是「要不要写代码」，而是**把人写代码这件事交给 AI 来做**，加速 SAP → SAS 代码 → TFL 输出这条链路。

---

![[attachments/Taimei/AZ-Atlas - image.png]]

| 文档 | 是什么 | 类比 |
| --- | --- | --- |
| **SAP**（Statistical Analysis Plan） | 统计分析计划，描述要做哪些分析、用什么方法、分析什么人群和终点 | 相当于 PRD——定义「做什么」 |
| **Shell**（TFL Shell / Mock Table） | 每张表/图的空壳模板，定义了标题、行列布局、需要展示的统计指标，但没有真实数据 | 相当于设计稿的 Wireframe——定义「长什么样」 |
| **ADaM Spec**（Analysis Data Model Specification） | 分析数据集的结构说明，定义每个数据集有哪些变量、变量怎么派生的、数据类型是什么 | 相当于数据库字典——定义「数据从哪来、叫什么」 |
