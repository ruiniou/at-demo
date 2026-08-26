# Figure Metadata Panel — Display Facts 展示方式设计 Proposal

## ① 问题背景

Figure Metadata Panel 需要展示 AI 从 Shell/SAP 解析出的 `display_facts`——一个Component下动态数量的记录，每条包含 `section` / `label` / `value` / `details[]` 四个字段，且 `details` 本身也是变长数组。真实案例（ORR forest plot、DoR KM chart、OS Risk table、OS Footnote 等）显示：

- 一个Component下 `display_facts` 数量从 1 条到 5 条不等；
- 同一个 `section` 下可能出现多条不同 `label`（如 "Time and censoring" 下同时有 "Time scale" 和 "Censoring marker"）；
- `component_label` 可能为空（Table/Text类型组件常见）；
- `label` 也可能为空（AI解析遗漏）；
- 跨Component可能共用完全相同的 `filter`。

现有Metadata面板（左侧Component导航 + 右侧扁平字段列表）没有为这种"一对多、结构可变"的数据设计展示与编辑方式，也没有明确哪些字段该开放编辑、哪些该保持只读。本Proposal解决这个问题。

## ② 主要改进点

| 维度 | 现状 | 本次方案 |
|---|---|---|
| Display Facts渲染 | 未支持 | 按 `section` 分组渲染为卡片，一张卡片可包含多条Label |
| Section语义 | 未定义 | 明确为**UI展示分组key**，不是数据结构层级，不可编辑 |
| Label为空 | 未定义 | 视为"待补全"状态：不用section顶替存储值，仅用section名做展示占位 + 醒目标记 |
| Component Label为空 | 未定义 | Fallback为该Component下所有Section名拼接（如"Legend / Footnotes"），非存储值 |
| 编辑范围 | 未定义 | Label / Value / Details 可编辑；Section、Component Type、Data Source 不可编辑 |
| 删除 | 未定义 | 支持删除整条Display Fact、删除单条Detail |
| 新增 | 未定义 | 仅支持在已有Fact下新增Detail；**新增Section/新增Fact本轮不做** |
| Confirm粒度 | Component整体 | 保持不变——Display Fact本身不作为Confirm对象，不再有逐条checkbox |
| AI结构性新增 | 未定义 | Display Facts标题旁角标数字提示新增数量，沿用"AI新增Component"的角标思路 |
| Filter关联性 | 未强调 | 检测到跨Component相同Filter时给出共享提示（纯展示，不改数据模型） |

## ③ 设计方案

### 层级结构

```
Figure
 └─ Component
     ├─ Component Label
     ├─ Component Type
     └─ Display Facts（列表，数量可变）
          └─ Section（UI展示分组key，非结构层级，不可编辑）
               └─ Fact（可多条，对应真实数据里的一条display_fact）
                    ├─ Label（可编辑；为空 = 待补全状态）
                    ├─ Value（可编辑，主要编辑入口）
                    └─ Details[]（可编辑内容 / 可增删）
```

Section不是数据结构的一层，只是渲染时对同 `section` 值的Fact做的视觉聚合；两条Fact即使 `section` 字符串相同，底层仍是各自独立的记录。


### 规则边界

- **Section**：按字符串完全匹配分组，纯展示层行为，不支持编辑，不作为筛选/统计维度使用。
- **Label为空**：不允许用Section名"顶替"写入Label的存储值；空值只在展示层用占位文字提示，数据库里保持空，直到Reviewer实际填写。
- **删除粒度**：仅支持整条Display Fact删除、单条Detail删除，不支持批量选择删除。
- **新增粒度**：仅支持"在已有Fact下追加Detail"；新增Section、新增整条Fact本轮不提供入口。
- **Confirm粒度**：仅Component级别一个开关；Display Fact/Detail都没有独立的confirm状态或checkbox。
- **Data Source只读**：面板内不提供编辑入口；如需修正，需要回到AI重新解析或上游系统调整。
- **Update changes**:对Display facts的编辑也触发update changes to code



## ④ MVP scope

**包含：**
- Display Facts按Section分组的卡片式展示（一Section可含多Label）
- Label / Value / Details 的内联编辑
- 删除整条Fact、删除单条Detail
- 在已有Fact下新增Detail
- Label为空时的"待补全"标记与Section占位展示
- Component Label为空时的Section名派生Fallback
- Data Source折叠只读区块
- 跨Component相同Filter的共享提示（纯展示）
- AI新增Fact的角标数字提示
- Component导航改为顶部下拉，去除标题文字与状态标注

**不包含（本轮明确排除）：**
- 新增Section / 新增全新Fact（"Add Section"能力）
- Detail的排序交互（拖拽/上移下移）
- review_note相关的任何展示或交互
- Display Fact / Detail层级的Confirm或批量确认
- 删除操作的Undo或二次确认
- 真实数据持久化与草稿保存

## ⑤ TBD 待确认事项

| # | 待确认问题 | 当前假设 | Owner | 状态 |
|---|---|---|---|---|
| 1 | Display Fact不再是Confirm对象后，AI Inferred / Conflict 三态标注的语义要不要调整（是否仍暗示"需处理"） | 保留原有视觉，语义改为纯来源提示，不再关联confirm动作 | 产品（你） | 🔴 需在评审前确认 |
| 2 | 误删Display Fact / Detail是否需要二次确认或Undo | 本轮暂不做，直接删除 | 产品/前端 | 🔴 需在评审前确认 |
| 3 | Source Dataset(s)是否为独立存储字段，还是完全由source_variables推导展示 | 推导展示，非独立字段（参考Atlas AI Copilot回复） | 架构师 | 🔴 需在评审前确认 |
| 4 | AI新增Fact的角标数字如何被"消费"/清零（目前无dismiss交互，只能靠删除减少） | 需要补一个类似"标记已读"的交互 | 产品（你） | 🟡 可评审后跟进 |
| 5 | Filter是否应为Figure级别共享存储，而非各Component独立存一份 | 数据模型仍各自独立存储，UI仅做检测提示 | 架构师 | 🟡 可评审后跟进（不阻塞本轮UI落地） |
| 6 | review_note是否已有现成的Atlas机制承载 | 未知，本轮完全不涉及 | PM/架构师 | 🟡 可评审后跟进 |
| 7 | Detail排序交互方案（虽已确认属于可编辑范围，但排序本轮未实现） | 本轮不实现，仅保留编辑+增删 | 产品/前端 | 🟡 可评审后跟进 |
| 8 | Component Label为空的Fallback文案格式（多个Section名直接拼接，未做数量上限截断） | 直接用" / "拼接，不做截断 | 产品（你） | 🟡 可评审后跟进 |

## ⑥ 附录

- **参考Demo**：`figure-metadata-panel-demo-v6.html`（交互原型，涵盖本Proposal所有Happy Path与规则边界）
- **数据来源**：`kafka_display_facts_提取与解释.md` 中的真实Figure案例——ORR forest plot、DoR Kaplan-Meier chart、OS Risk table、OS Footnote
- **关键判断依据**：与Atlas AI Copilot的问答记录，涉及层级结构确认（Q1）、Label为空处理原则（Q2/后续追问）、Component Label Fallback建议（Q3）、Filter共享性判断（Q4）
- **已否决的方案**：
  - Section作为可编辑的分组容器（已改为纯展示、不可编辑）
  - Label为空时用Section顶替写入存储值（已改为占位展示 + 待补全标记，数据保持空）
  - "Section / Label"面包屑逐条平铺展示（已改为分组卡片，避免多Label共享Section时的重复展示）
