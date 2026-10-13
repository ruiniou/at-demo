# Atlas Dashboard Proposal

Chimama · 2026-10-09 · Draft v0.2（待评审）

## 1. 问题背景

**本次需求**

| 层级 | 查看者 | 范围 | 要回答的问题 | 优先级（建议） |
| --- | --- | --- | --- | --- |
| Event Dashboard | Event Owner；所属 Study 的 Study Owner；Admin | 仅当前 Event | 任务数量与完成状态（Task 视角）；成员、任务分配与完成状态（Team Member 视角） | P0 |
| Study Dashboard | Study Owner；Admin | 仅当前 Study | Event 数量、各 Event 进度、Token 用量 | P2 |
| Global Dashboard | Admin | 全局 | 按月的平台 Token 消耗、Study 用量明细、报告导出 | P1 |

**口径前提（已确认）**

- 任务"完成" = **Locked**（Confirmation = Locked）。
- Token **只展示用量，不展示费用**。
- Atlas 保留 Study ID，Unit 由 IT 在系统外关联。
- 角色可以看到其下一级的Dashboard

## 2. 主要改进点

| # | 议题 | 参考稿 V1 | 本方案 | 理由 |
| --- | --- | --- | --- | --- |
| 1 | 完成口径 | 已确认 / 未确认二分 | 以 Locked 为完成，未完成里把 Error 单独拆出 | Event 的"已完成"本身就是全部 TFL Lock；Error 是需要人介入的例外，不能淹没在"未确认"里 |
| 2 | 未分配 | 作为一种状态与其他状态并列统计 | 作为**归属维度**，在成员表里单独一行，按状态分别统计 | 状态（Locked / Error…）与归属（有无负责人）是两个维度，混用会误读 |
| 3 | 成员视角 | 成员柱状图 + 团队表 + 任务明细，同一数据展示三遍 | 一张成员表 | 同一数据只展示一次，其余靠下钻 |
| 4 | TFL 明细 | Dashboard 内再做一张任务明细表 | 不做，点击数字跳转 Treelist 并带筛选 | Treelist 已有 TFL 列表，Dashboard 是聚合层 |
| 5 | Copilot 指标 | 交互热点、单 TFL 请求数、Diff 采纳轮次 | 首版不做 | 不在需求内；参考稿自己也注明"不代表 AI 贡献"，容易被误读为质量或效率评分；且依赖埋点 |
| 6 | 费用 | 估算费用（USD） | 仅 Token 用量 | 已确认 |
| 7 | 汇总口径 | 按 TA 汇总 | 页面内以 Study 为最小粒度，TA 作为 Study 属性展示；Unit 由 IT 系统外关联 | Atlas 数据模型里有 Study ID 和 TA，没有 Unit |
| 8 | 页面结构 | 单页三 Tab | 按角色与范围拆成三个 Dashboard，各自从对应入口进入 | 三类角色权限范围不同，Tab 会让人误以为可以切换范围（参考稿的 Tab 仅作 Demo 查看用） |

## 3. 设计方案

### 3.1 权限矩阵

图例：✓ 已确认；✗ 不开放（按本次需求范围）；🔴 待确认。

| 功能 / 数据 | Admin | Study Owner | Event Owner | Team Member |
| --- | --- | --- | --- | --- |
| 查看 Event Dashboard | ✓ 任一 Event | ✓ 仅所负责 Study 下的 Event | ✓ 仅当前 Event | ✗ |
| 查看成员任务分配与完成情况 | ✓ 任一 Event | ✓ 仅所负责 Study 下的 Event | ✓ 仅当前 Event | ✗ |
| 查看 Study Dashboard | ✓ 任一 Study | ✓ 仅当前 Study | ✗ | ✗ |
| 从 Study Dashboard 下钻到 Event Dashboard | ✓ | ✓ | — | — |
| 查看 Global Dashboard | ✓ | ✗ | ✗ | ✗ |
| Global Dashboard 导出入口（按钮） | ✓ | ✗ | ✗ | ✗ |
| Token 用量可见范围 | 全局，Study 粒度及其 Event 明细 | 当前 Study 下各 Event | 不展示（Event Dashboard 不含 Token） | ✗ |

**规则说明**

1. **仅当前范围**：Event Owner 只能看自己所属的那个 Event，Study Owner 只能看自己负责的那个 Study 及其下的 Event，Admin 可看全局及所有 Study、Event；除 Admin 外，各角色只能查看自身所属范围及其下一级的 Dashboard，不跨级。Dashboard 内不提供自由切换范围的选择器；有权限的用户可从对应 Event / Study 入口直接进入，也可从已上线的上一级 Dashboard 下钻。
2. **角色按对象判定**：同一个人可以在不同 Event / Study 上持有不同角色，按所访问对象的角色决定可见内容（例如某人是 Event A 的 Owner，则只能看 Event A 的 Dashboard）。
3. **只读**：Dashboard 不提供任何写操作，也不改变权限。分配调整仍在现有 Assignment 页完成，Dashboard 仅作为跳转入口。
4. **成员完成情况仅 Event Owner、其上级 Study Owner 及 Admin 可见**，Team Member 不可见他人的任务进度。
5. **导出**：Global Dashboard 提供一个导出入口按钮，仅 Admin 可见。

### 3.1.1 页面入口与下钻（UX 方案）

| Dashboard | 首版入口 | 查看范围与下钻 | 上线阶段 |
| --- | --- | --- | --- |
| Event | Events 首页中对应 Event 的 `…` → `View Dashboard`；Event 工作区左上角的 `Event Menu` → `View Dashboard` | Event Owner 仅自己的 Event；Study Owner 仅所负责 Study 下的 Event；Admin 可查看任一 Event。进入时保留当前 Event 上下文 | P0 |
| Study | `Projects & Studies` 主面板中对应 Study 行的操作区 → `View Dashboard` | Study Owner 仅所负责 Study；Admin 可查看任一 Study。Study Dashboard 的 Event 行可下钻至对应 Event Dashboard | P2 |
| Global | 左侧主导航新增 `Dashboard`，与 `Projects & Studies` 平级；仅 Admin 可见 | Admin 查看全局；Study Dashboard 上线后，可从 Global 的 Study 明细进入对应 Study Dashboard | P1 |

- Event 工作区左上角现有 `Event Settings` 菜单改名为 `Event Menu`，保留 `Event Information`、`Event Team`，增加 `View Dashboard`。页面右上角的 Group Code / Download 属于工作区工具操作，不作为 Dashboard 入口。
- 入口按当前 Event / Study 的实际授权显示；同一用户在不同对象上的可见入口可能不同。隐藏入口不代替访问校验，直接打开或下钻仍须检查权限。
- P1 的 Global Dashboard 先展示 Study 用量明细及 Event 级展开；P2 的 Study Dashboard 上线后，再开放 Global → Study Dashboard 的跳转。未上线的目标不显示可点击入口。
- Dashboard 返回时应回到来源页面及对应对象；从 Dashboard 下钻时保留层级返回路径。具体路由与返回实现由 UI 设计和前端确定。

### 3.2 Dashboard 数据内容

#### 通用状态与口径

| 名称 | 定义 | 备注 |
| --- | --- | --- |
| Locked | TFL 已 Lock | 即"完成"。Lock 可被 Unlock，因此该数是**截至当前的快照**，可能下降 |
| In Progress | 非 Locked、非 Error、非 Stopped 的 TFL | 含 Generating、Pending 等；与现有 TFL 状态的具体映射待 PM 确认 |
| Error | TFL 状态为 Error | 需要人介入的例外 |
| Stopped | 已终止 | 仅在 Event 被终止后出现；数量为 0 时不显示该状态 |
| Unassigned | TFL 的 Programmer 为空 | **归属维度**，不是状态；Team Member 被移除后其 TFL 会回到 Unassigned |

- 所有状态类数字标注"截至 {时间}"。
- 成员归属取**当前负责人**。

#### A. Event Dashboard（Event Owner / Study Owner / Admin · 当前 Event）

| 模块 | 字段 | 说明 | 下钻 | 优先级 |
| --- | --- | --- | --- | --- |
| 顶部汇总条 | Total TFL；Locked n / N 及占比；In Progress；Error；Unassigned | Event 整体完成情况（Locked n / N 及占比）与各状态数量 | 点击各项跳转 Treelist 并带对应筛选 | P0 |
| 按输出类型 | Table / Listing / Figure 各自的 Locked / In Progress / Error 数量 | 分别统计 Table / Listing / Figure 各自的状态数量 | 点击跳转 Treelist 并按类型 + 状态筛选 | P0 |
| 成员进度表 | 成员（含 Owner）、Assigned、Locked、In Progress、Error；末行 Unassigned | 每位成员的任务总数与各状态数量；默认按姓名排序，不按完成率排序 | 点击成员跳转 Treelist 并按负责人筛选；点击 Unassigned 跳转 Assignment 页 | P0 |
| 需要处理 | Error 的 TFL 列表；Unassigned 的 TFL 列表 | 只列例外项，置顶可见 | 点击跳转对应 TFL | P1 |

#### B. Study Dashboard（Study Owner / Admin · 当前 Study）

| 模块 | 字段 | 说明 | 下钻 | 优先级 |
| --- | --- | --- | --- | --- |
| 顶部汇总条 | Event 数量；跨 Event 的 TFL Locked n / N；累计 Token | 累计 = Event 创建以来 | 无 | P2 |
| Event 对比表 | Event 名称、Event Owner、Event 状态、Locked n / N、累计 Token（Input / Output / Total） | 按 Event 逐行对比进度与 Token 用量 | Study Owner / Admin 点击 Event 行进入对应 Event Dashboard | P2 |
| 未归属 Token | 无法归入某个 Event 的消耗 | 单列展示，不强行分摊 | 无 | P2（待确认是否存在） |

#### C. Global Dashboard（Admin）

| 模块 | 字段 | 说明 | 下钻 | 优先级 |
| --- | --- | --- | --- | --- |
| 月份选择 | 统计月份 | 默认当前月，按调用发生时间统计 | — | P1 |
| 汇总条 | Total Tokens（Input / Output）；有消耗的 Study 数；有消耗的 Event 数 | 去重按 Study ID / Event ID | — | P1 |
| 月度趋势 | 近 6 个月每月 Token 总量；当月有消耗的 Study 数 | 按月份对比用量变化 | — | P1 |
| TA 构成 | 各 TA 的 Token 用量，Top 5 + 其他 | TA 是 Study 现有属性，可在系统内汇总；Unit 不在系统内 | — | P1（待确认是否保留） |
| Study 用量明细 | Project / Study ID、Study 名称、TA、Study Owner、有消耗 Event 数、Input、Output、Total | 按 Study 逐行列出，可展开查看 Event 级消耗 | P1 展开 Event 明细；P2 上线后可进入对应 Study Dashboard | P1 |
| 导出 | 导出入口按钮 | 仅提供入口，Admin 可见；导出内容不在本方案范围内 | — | P1 |

### 3.3 Happy Path（Event Owner）

1. 从 Events 首页该 Event 的 `…`，或 Event 工作区的 `Event Menu`，进入 Dashboard，看到顶部汇总条：`Locked 15 / 24`、Error 1、Unassigned 3。
2. 查看各状态数量，确认整体进度；"需要处理"列表提示有 1 个 Error、3 个 Unassigned。
3. 在成员进度表里看到某位成员 In Progress 较多、另一位较少。
4. 点击 Unassigned，跳转 Assignment 页，把未分配的 TFL 分给 Team Member。
5. 返回 Dashboard 刷新，Unassigned 归零；或点击 Error 数字，跳转 Treelist 查看对应 TFL。

### 3.4 规则边界

- **快照而非累计**：Locked 等状态数反映当前状态，Unlock 会让数字下降；每个模块标注"截至时间"。
- **Token 为累计 / 按月统计**：与状态数口径不同，卡片上分别标注。
- **数字与下钻一致**：点击数字后列表头部显示其自身计数，与 Dashboard 数字不一致时以列表为准，并提示数据已更新。
- **成员被移除**：其 TFL 的 Programmer 被清空，回到 Unassigned，已不再计入该成员；Dashboard 不保留历史归属。
- **Event 首轮生成中**：数字会持续变化，显示 Generating 提示。
- **Event 已终止**：数字固定为终止时状态，展示 Stopped 数量；Token 仍计入。
- **空状态**：无 TFL、无成员、本月无用量，均给出明确占位，不显示 0 条 / 空图。
- **不做人员与 AI 的隐性评分**：成员表不按完成率排名，不展示 AI 采纳率类指标。

### 3.5 Top 3 失败场景

| 场景 | 触发条件 | 处理方式 |
| --- | --- | --- |
| 数据加载失败 | 接口超时 / 报错 | 在卡片位置显示错误态并提供 Retry；不展示过期数字，若保留上次数据必须带时间标注 |
| 数据在查看期间变化 | Lock / Unlock、分配调整、首轮生成仍在进行 | 顶部显示更新时间与 Refresh；下钻列表以自身计数为准，并提示"数据已更新" |
| 失去访问权限 | 访问期间 Event Owner / Study Owner 被更换 | 刷新或下钻时提示无权访问并返回首页，不显示残留数据 |

### 3.6 用户安心感文案

| 场景 | 文案示例 |
| --- | --- |
| 更新时间 | Updated 14:32 · Refresh |
| Locked 说明（tooltip） | Locked count reflects the current state. Unlocking a TFL reduces it. |
| 首轮生成中 | First-round generation is in progress. Numbers update as TFLs complete. |
| Event 已终止 | This Event was terminated. Counts show the state at termination. |
| 无数据 | No TFLs in this Event yet. / No usage recorded for October 2026. |
| 加载失败 | Couldn't load dashboard data. Try again. |
| 无权访问 | You no longer have access to this Dashboard. |

## 4. MVP 范围说明

| 优先级 | 内容 |
| --- | --- |
| P0 | Event Dashboard：顶部汇总条、按类型进度、成员进度表（含 Unassigned 行）、下钻到 Treelist / Assignment、更新时间与空 / 失败 / 生成中 / 已终止状态 |
| P1 | Event Dashboard 的"需要处理"列表；Global Dashboard（月份选择、汇总条、月度趋势、Study 用量明细、导出入口按钮）；TA 构成图（待确认） |
| P2 | Study Dashboard（Event 数量、Event 对比表、累计 Token） |
| 本期不做 | Copilot 交互 / Diff 采纳指标；费用与币种；Unit 层级汇总；成员历史归属；非 Admin 角色跨级查看 Dashboard |

**范围提醒**：最容易扩大范围的是"再加一个指标"（Copilot 使用、费用、Unit 汇总）和"Dashboard 里再做一张明细表"，建议都推给后续迭代。

## 5. TBD 待确认事项

🔴 本评审前必须确认；🟡 评审后可跟进；✅ 已确认。

| 待确认问题 | 当前假设 | Owner | 状态 |
| --- | --- | --- | --- |
| 任务"完成"口径 | Confirmation = Locked | 需求方 | ✅ |
| Token 展示范围 | 仅用量，不含费用 | 需求方 | 🟡 |
| Unit 汇总 | Atlas 保留 Study ID，IT 在系统外关联 Unit | 需求方 | ✅ |
| 三类 Dashboard 的查看者与范围 | Admin 可查看所有层级（Global / Study / Event）；Study Owner 可看所负责 Study 及其下 Event；Event Owner 仅当前 Event；见权限矩阵 | 需求方 | ✅ |
| In Progress 与现有 TFL 状态（Generating、Pending 等）的映射 | Locked、Error、Stopped 之外的归为 In Progress | PM | 🔴 |
| 三个 Dashboard 的入口位置 | UX 方案见 3.1.1：Event 从首页 `…` 或工作区 `Event Menu` 进入；Study 从 `Projects & Studies` 的 Study 行进入；Global 为 Admin 左侧主导航。P1 不预置指向 P2 Study Dashboard 的跳转 | PM / UX | 🟡 待评审 |
| Admin 是否可查看 Event / Study Dashboard | 可查看，Admin 可看所有层级 | 需求方 | ✅ |
| Token 能否按 Event 统计，统计范围含哪些（首轮生成、TFL Copilot、Event Copilot）；无法归入 Event 的消耗如何处理 | 可按 Event 统计；无法归属的单列展示 | AI 架构师 / 后端 | 🔴 |
| 月份边界使用的时区 | 暂按系统时区统计 | 后端 / PM | 🟡 |
| 数据刷新方式 | 进入时加载 + 手动 Refresh | 前端 / 后端 | 🟡 |
| Treelist 是否支持按负责人 / 状态 / 类型筛选 | 支持带参数跳转 | 前端 | 🟡 |
| TA 构成图是否保留 | 保留，TA 是 Study 现有属性 | PM | 🟡 |
| Global Dashboard 的优先级 | P1 | PM | 🟡 |
| 成员被移除后是否保留历史归属 | 不保留，follow 当前负责人 | PM | 🟡 |

## 6. 附录

### A. 汇总逻辑

- Event 完成率 = Locked ÷ Total TFL；Study 层 = 所有 Event 的 Locked 之和 ÷ 所有 Event 的 TFL 之和。
- 成员行 Assigned = 当前 Programmer 为该成员的 TFL 数；各状态列之和 = Assigned。
- Unassigned 行各状态列之和 = Unassigned 数。
- Global 的"有消耗的 Study / Event"按 Study ID / Event ID 去重。

### B. 对参考稿的取舍

| 参考稿内容 | 处理 | 说明 |
| --- | --- | --- |
| 顶部 KPI（总数 / 已确认 / 未确认 / 未分配） | 保留并调整 | 改用 Locked 口径，补充 Error，未分配改为归属 |
| 未分配作为独立一类 | 保留 | 以独立行呈现，而非状态色 |
| 成员任务分布图 + 团队表 | 合并 | 合成一张成员进度表 |
| TFL 任务明细表 | 不做 | 下钻到 Treelist |
| Copilot 交互热点 / Diff 采纳轮次 | 不做 | 不在需求范围，指标易被误读 |
| 阅读口径说明（快照 vs 累计） | 保留 | 体现为"截至时间"与口径标注 |
| 数字可下钻 | 保留 | 对应可追溯性 |
| Study 的 Event 对比 | 保留并简化 | 去掉交互强度图，保留进度与 Token |
| Usage & Cost 页面 | 保留并调整 | 去掉费用，保留月度、Study 粒度、Event 展开、导出入口 |
| TA 费用构成 | 改为 TA Token 构成，待确认 | 费用字段已移除 |
