# Event Copilot 与 TFL Copilot：运行中 Stop

| What it is | Scope | Date |
|---|---|---|
| 终止本轮正在执行的 Copilot 任务，终止生效后不再产生新写入。 | Sprint 8 的 Event Copilot 批量执行、单条任务，以及 TFL Copilot 单项执行。 | 2026-10-10 |

## 背景与边界

Event Copilot 派发后，当前设计中所有可执行的 TFL 任务同时开始。用户发现派发范围或指令有误时，可以停止整批或仅停止一条；TFL Copilot 也可停止当前单项任务。本功能是 **Stop**，停止后本轮结束，不提供 Pause、Resume 或 Continue。Sprint 7 的 Event 首轮生成「Stop Generation / Delete Event」属于另一流程。

| 名词 | 含义 |
|---|---|
| Running | 任务已经开始执行。 |
| Stopping | Stop 已请求，实际终止尚未确认；不能再次提交。 |
| Interrupted | 已开始的任务因 Stop 结束，区别于完成或失败。 |
| Retry | Event Copilot 对 Interrupted 条目发起新执行；旧 Log 保留。 |

## 入口与当前交互

| 场景 | 入口 | 作用范围 |
|---|---|---|
| TFL Copilot | 运行时，对话输入框右侧发送按钮切换为 Stop icon button | 当前 TFL Copilot 本轮执行 |
| Event Copilot 整批 | 运行时，对话输入框右侧发送按钮切换为 Stop icon button | 本轮所有仍在运行的任务 |
| Event Copilot 单条 | 进度卡中该任务右侧的 Stop icon button | 仅该任务；其余任务继续执行 |

- Stop 使用无底色的 icon button，图标为紫色 `stop-circle-fill`，颜色使用 `brand-color-1`。进度卡按钮为 **20 × 20 px**，Tooltip 统一为 **Stop**。
- 当前进度卡中所有可执行任务默认并行开始，**不展示 Queued 或 Skip**。运行中显示 `Updating SAS code & metadata…`；点击 Stop 后该条显示 `Stopping…`，确认终止后显示 `Interrupted`。已完成条目显示 `Completed`。
- 整批 Stop 请求期间，各条目分别显示状态；输入框 Stop 进入不可重复点击的 `Stopping…` 状态。单条 Stop 不影响其他任务的 Stop 入口。
- Tree List 不新增本需求的状态或控制。Event 派发的单个 TFL 被停止后，打开对应 TFL Copilot，应能看到该任务的 Interrupted 记录。

## 流程

| 流程 | 运行中 | 用户操作 | 终止与汇总 |
|---|---|---|---|
| 整批停止 | 多个 TFL 同时 Running | 点击 Event Copilot 输入框的 Stop | 仍在运行的条目分别经历 Stopping → Interrupted；已完成结果保留。汇总标题显示 `N Interrupted`，条目提供 Retry。 |
| 单条停止 | 多个 TFL 同时 Running | 点击进度卡内该条 Stop | 仅该条 Stopping → Interrupted，其余条目继续直到完成；汇总区分完成与被打断条目，并对后者提供 Retry。对应 TFL Copilot 显示终止。 |
| 单个 TFL 停止 | TFL Copilot 显示执行中内容与 Stop | 点击输入框的 Stop | Stop 处理中不可重复点击；终止后显示 `Stopped. Send a new instruction to start another run.`，输入框恢复发送按钮。重新输入开启新一轮，不提供 Retry。 |

## 状态流转

| Stop 前状态 | 单条 Stop | 整批 Stop | 结果与 Log |
|---|---|---|---|
| Running | 指定条目 Stopping → Interrupted | 所有仍在运行的条目分别 Stopping → Interrupted | 未应用改动不落地；已有 Log 保留。 |
| Done / 已完成 | 不提供 Stop | 保持 Done | 已完成结果保留；不自动回滚或 Revert。 |
| Failed / Blocked | 不提供 Stop，沿用原处理 | 不改写为 Interrupted | 原状态与 Log 保留。 |
| Locked Table Code | 不受 Stop 影响 | 不受 Stop 影响 | 原结果保留。 |

Stop 与完成同时发生时，以实际执行结果为准：已经完成的任务保持完成。整批任务停止耗时可能不同，进度卡需要逐条表达 Stopping 与 Interrupted；不能在所有目标终止前显示为全部停止。

## 写入、审计与异常

- Stop 生效后，旧执行不得再产生新写入；迟到结果不得落地。代码改动要么整体应用，要么整体不应用。
- Stop 请求幂等；Stopping 期间不重复终止或记录 Log。SAS job 或工具调用不能立即中断时，界面维持 Stopping，直到获得实际结果。
- Stop 失败时保留真实运行状态并提示重试，不得显示为 Interrupted。
- 已完成任务不回滚；Stop 后不自动重试。Event Copilot 的 Retry 是用户发起的新执行，旧 Log 保留。
- 审计记录操作者、时间、Stop 范围及实际被打断的条目；审计可见范围仍需确认。
- Event 中被打断的单个任务，其 TFL Copilot 会话应保留派发指令并展示终止记录；同一任务的终止记录不重复创建。

## 行为边界

**Do**

- 只为当前 Running 的任务提供 Stop；单条停止后让其他任务继续执行。
- 整批 Stop 时逐条反馈结果，并在汇总卡中展示被打断数量及 Retry。
- 在对应 TFL Copilot 会话中同步展示 Event 派发任务的终止结果。
- 保持首页完成计数与实际完成结果一致；Interrupted 暂不计入已完成，此口径仍需 PM 确认。

**Don't**

- 不提供 Pause、Resume、Continue，也不自动回滚已完成结果。
- 当前并行执行流程不展示排队或 Skip 状态与入口。不要将历史文档中的排队规则当作当前设计。
- 不在 Tree List 增加 Stop 控制或新状态，不改动已 Lock 的 Table Code。
- 不将 Stop 后的汇总扩展为完整执行报告。

## 范围与验收

| 优先级 | 范围 |
|---|---|
| P0 | TFL Copilot 发送与 Stop 切换、Stopping、终止后可发起新一轮；停止后无新写入，未应用改动不落地。 |
| P1 | Event Copilot 整批与单条 Stop、Interrupted Retry、被打断数量、对应 TFL Copilot 终止记录、首页完成计数及审计。 |
| 不做 | Pause / Resume、Revert、Tree List 更新、当前进度卡的 Queued / Skip、完整汇总。 |

验收重点：所有可执行条目同时进入 Running；20 × 20 px 进度卡 Stop icon button 和统一 Tooltip；单条 Stop 不阻断其余条目；整批 Stop 逐条反馈；对应 TFL Copilot 显示终止；竞态完成保留结果；重复 Stop 不重复执行或记日志；Retry 产生新执行并保留旧 Log。

## 需确认

| 问题 | 当前依据或暂定处理 | Owner |
|---|---|---|
| 谁可整批 Stop、单条 Stop 和 Retry？服务端如何校验？ | 原始需求未定义角色权限；不能直接沿用 Sprint 7 首轮生成的 Owner 限制。 | PM / 工程 |
| Retry 能否复用被中断前产物？ | 暂按新执行、从头开始；评审前确认。 | 工程 |
| 生产环境是否存在并发上限或排队？ | 当前设计及原型全部并行、无排队；若调度规则改变需另行设计未开始状态。 | 工程 / PM |
| Stop SAS job 是否真实释放资源？ | 原始需求暂定会终止，评审前确认。 | 工程 |
| 审计日志谁可见？ | 暂按现有审计规则。 | PM |
| 首页完成计数如何处理 Interrupted？ | 暂定不计入已完成。 | PM |
