# Proposal：Event 停止生成与删除能力

> 创建日期：2026-09-23  
> 最新结论：停止与删除是两个不同的用户意图。停止用于发现输入文件有误等场景，保留 Event 以便重新上传；删除用于永久移除 Event。删除时若 Agent 仍在运行，系统自动先终止任务。

## ① 问题背景

Agent 首轮生成启动后，用户无法主动停止。如果发现上传文件错误，只能等待任务跑完或报错，无法及时止损并重新上传。同时，Event 缺少完整且分阶段呈现的删除能力。

需要提供两条互不替代的路径：

- **Stop generation**：停止当前生成，保留 Event，允许用户修正并重新上传输入文件。
- **Delete Event**：删除整个 Event；若 Agent 尚未结束，系统自动取消或终止任务后再删除。

## ② 两种操作的边界

| 操作 | 用户意图 | 结果 | 是否可恢复原任务 | 后续路径 |
|---|---|---|---|---|
| Stop generation | 输入有误、结果不再需要，先停止消耗 | Event 保留，当前生成进入 `Stopped` | 不恢复被停止的任务 | 重新上传正确文件并发起新一轮生成 |
| Delete Event | Event 本身不再需要 | Event 及其数据被删除 | 不可恢复 | 如仍需要，重新创建 Event |

停止不等于暂停。界面使用 Stop / Stopped 语义，不使用 Pause / Paused，避免暗示任务可以从中断点继续。

## ③ 权限与入口

- 两种操作都仅 Event Owner 可见和可执行。
- 服务端必须再次校验实际用户是否仍为 Event Owner，不能只依赖前端显隐。
- Event 名称右侧已有状态图标位置；首轮运行时使用 `src/icons/Status label/Status=AI Processing.svg`。状态图标保持只读，不承载 Stop 或 Delete 点击行为。
- Stop 与 Delete 的统一入口位于 **Event information** 内，不在 Event 名称区额外增加独立操作按钮。

### Event information 菜单结构

Event information 现有另外两个操作，与 Stop / Delete 分成两个操作组，中间使用 Divider 隔开：

```text
Event information
  Existing action 1
  Existing action 2
  ─────────────────
  Stop generation
  Delete Event
```

- `Stop generation` 仅在 Agent 未启动、排队或正在执行时显示；使用 Stop 图标 + 完整文字，采用普通菜单项样式。
- `Delete Event` 始终显示，使用垃圾桶图标 + 完整文字，采用 Danger 菜单项样式。
- Divider 只用于区分普通操作组和高影响操作组；Stop 与 Delete 之间不再增加 Divider。
- 两个入口分别点击，分别进入各自的确认弹窗。
- Stop 和 Delete 都属于高影响操作，不使用裸图标。
- 不建议复用状态图标作为操作入口，也不建议把 Stop 和 Delete 合并为一个按钮。

### 菜单项视觉状态

| 项目 | Default | Hover / Focus | Active | Disabled / 不可用 |
|---|---|---|---|---|
| Stop generation | 文字 `text-primary`，图标 `text-secondary` | 中性 Hover 背景，文字和图标保持非危险色 | 使用中性 Active 背景 | Agent 不在可停止阶段时直接隐藏，不展示 Disabled 项 |
| Delete Event | 文字和图标使用 `status-error` | 使用 `status-error-bg`，保持危险色文字和图标 | 使用更强一级的危险态背景 Token | 无权限时直接隐藏；提交中在弹窗内 Disabled |
| Divider | 使用 `border-default` | 不适用 | 不适用 | 不适用 |

Stopped 状态标签使用 `text-secondary` 语义色，不使用 `status-error`。它表达用户主动停止的中性终态；Error 继续独占错误色。

### Agent 执行结束后

- Stop 入口消失，因为没有仍在运行的任务。
- Delete 继续保留在 Event information 底部的 Danger 操作区，并用 Divider 与另外两个普通操作隔开。
- Treelist 展开和收起布局使用相同的权限与状态判断。

## ④ Stop generation 流程

### 确认弹窗

- 标题：`Stop generation?`
- 说明：当前生成将停止，不能从中断位置继续；Event 会保留，可重新上传正确文件并开始新一轮生成。
- 展示 Event 名称和当前状态。
- 原因字段：选填。
- 主按钮：`Stop generation`。
- 次按钮：`Continue generation`，比 `Cancel` 更清楚地表达关闭弹窗后的结果。

### 执行结果

1. Owner 确认停止后，按钮进入 `Stopping…` 并禁止重复提交。
2. 服务端取消尚未启动的任务，终止正在执行的 Agent 及其未完成子任务，并隔离迟到结果。
3. Event 状态更新为 `Stopped`；仍在生成或排队的 TFL 更新为 `Stopped`。
4. 已经完成或 Lock 的 TFL 保留原始结果和底层状态。
5. 右侧区域统一显示一张停止状态大卡，隐藏 Shell Preview / Code / AI 及右侧顶部栏。
6. 停止状态大卡提供明确的重新上传入口，让用户修正文件后开始一轮全新的生成。

### 停止状态大卡

- 图标：Stop 状态图标，不使用 Pause 图标。
- 标题：`Generation stopped`。
- 说明：当前生成已停止。如需重新生成，请上传正确的输入文件。
- CTA：`Re-upload files`。
- 不提供 `Resume`，因为旧任务不能续跑。

Stopped 状态使用新增资源 `src/icons/Status label/Status=Stopped.svg`。颜色采用中性状态 Token `text-secondary`，与 Error 的 `status-error` 明确区分；Stopped 是用户主动结束，不是系统故障。操作按钮与状态可以共用 Stop glyph，但必须使用不同组件和视觉样式：操作可点击，状态只读。

## ⑤ Delete Event 流程

### 入口规则

| Event / Agent 阶段 | Event information | 删除行为 |
|---|---|---|
| Agent 未启动、排队或正在执行 | 同时显示 Stop 与 Danger Delete | Delete 时自动取消 / 终止任务，然后删除 Event |
| Stopped | 隐藏 Stop，保留 Danger Delete | 直接删除 Event 及保留的数据 |
| 已完成、WIP、全部 Lock 或 Error | 隐藏 Stop，保留 Danger Delete | 直接删除 Event 及相关数据 |

### 确认弹窗

- 标题：`Delete Event?`
- 删除原因必填，多行文本。
- 主按钮：`Delete Event`，原因为空时 Disabled。
- 次按钮：`Cancel`。
- Agent 仍在运行时明确说明：删除将自动终止当前生成，并永久删除 Event 及已生成结果。
- Agent 已结束或已 Stopped 时说明：删除将永久删除 Event 及全部相关结果。

### 执行流程

1. Owner 填写原因并确认删除。
2. 按钮进入 `Deleting…`，锁定输入、关闭按钮、遮罩点击和重复提交。
3. 服务端重新检查权限并读取 Agent 的实时状态。
4. 若任务未启动则取消；若正在执行则终止；若已结束或 Stopped 则跳过终止步骤。
5. 系统删除 Event，同时将 Event 标识、操作者、原因、操作时间和删除前状态保存在 Event 数据之外的审计记录中。
6. 服务端确认删除成功后，Event 从列表移除；若用户位于详情页，则返回 Event 列表并显示 `Event deleted` Toast。

建议由一个服务端删除指令编排「读取状态 → 必要时终止 → 删除」。前端不应自行串联 Stop 接口和 Delete 接口，避免停掉任务但删除失败的半完成状态。

## ⑥ 状态模型

### Event 状态

在现有状态基础上新增 `Stopped`。它表示某次生成被主动终止，但 Event 实体仍存在，可以进入重新上传流程。

### TFL 状态

- Stop 生效时仍在生成、排队或等待依赖的 TFL → `Stopped`。
- 已完成或已 Lock 的 TFL → 保持原状态和结果。
- 既有 Error TFL → 保持 Error，避免覆盖真实失败信息。
- 重新上传并启动新一轮后，需要明确旧 TFL 如何归档或替换，不能让旧轮次状态与新轮次混在同一棵树中。

### 临时交互状态

`Stopping…` 和 `Deleting…` 仅表示请求处理中，不加入业务状态筛选或首页统计条。

## ⑦ 失败与竞态

| 场景 | 建议处理 |
|---|---|
| Stop 与 Agent 完成同时发生 | 以服务端生效时刻为准；停止前已完成的结果保留，停止后的迟到结果不写入 |
| Stop 失败 | 保持原运行状态，弹窗展示错误并允许重试，不伪造 `Stopped` |
| Delete 与 Agent 完成同时发生 | 服务端实时读取状态；已完成则跳过终止并继续删除 |
| 自动终止失败 | 不宣告删除成功；Event 暂不从列表移除，允许重试 |
| Delete 失败 | 保留 Event；接口支持幂等，避免重复终止或重复审计 |
| Owner 权限刚被移除 | 服务端拒绝 Stop / Delete，前端刷新权限与状态 |
| 多个页面同时操作 | 以服务端为准；其他页面同步 Stopped 或退出已删除 Event |
| 重新上传与迟到结果冲突 | 新一轮生成使用新的 run ID；旧 run ID 的结果不得写入新一轮 |

## ⑧ MVP 范围

### P0

- Event Owner 的 Stop 和 Delete 权限。
- Event information 内以 Divider 分隔普通操作与 Stop / Delete；结束后隐藏 Stop，Delete 保持 Danger 样式。
- Stop 二次确认、状态同步、停止状态大卡和重新上传入口。
- Delete 二次确认、必填原因、运行中自动终止和成功后退出详情。
- 服务端权限校验、幂等、审计、run ID 隔离及迟到结果防护。

### 暂不包含

- Pause / Resume。
- 单个 TFL Stop 或 Delete。
- 从旧任务的中断点继续。
- 恢复已删除 Event。

## ⑨ 当前代码评估

以下路径相对于项目根目录。本次为静态评估，尚未验证真实服务端接口。

| 改动面 | 当前落点 | 需要调整 |
|---|---|---|
| Event 状态 | `src/imports/Main/Main.tsx` 的 `EventStatus`、`statusConfig`、`StatusTag` | 新增 `stopped`；还原 Event 名称右侧状态图标；补充首页 / 详情展示 |
| Stop 入口 | `Main.tsx` 的 Event information | 在高影响操作组中增加 Stop；按 Owner + 运行状态判断显隐，接入确认弹窗和停止回调 |
| Delete 入口 | Event 列表已有 Owner 专属 Delete；详情页已有 Event information | 在 Stop 同组中增加 Danger Delete；所有阶段保留，统一权限判断 |
| Delete 弹窗 | `src/imports/Main/components/DeleteEventModal.tsx` | 增加必填原因、动态后果说明、错误反馈和真实异步状态 |
| TFL 状态 | `TableItem`、`ProgramItem`、`TreeStatusIcon` | 新增 `stopped` 并按 Stop 生效时状态更新；补充筛选和父级汇总 |
| 停止后工作区 | Shell / Code / AI 与右侧顶部栏渲染 | Event 为 Stopped 时在外层切换为停止大卡和重传入口 |
| 异步任务 | 原型中多处生成回调和定时器 | Stop / Delete 后清理本地流程并拒绝旧 run 回调；生产端由服务端保证 |
| 审计 | 当前无 Stop 原因和 Delete 原因提交 | Delete 原因必填；Stop 原因选填；两者均记录操作者、时间和执行前状态 |

## ⑩ 仍需确认

| 问题 | 当前建议 |
|---|---|
| 重新上传是否发生在原 Event 内 | 是；停止状态大卡提供 `Re-upload files`，保留 Event 身份与权限 |
| 新文件上传后如何处理旧的已完成 TFL | 建议按 run 归档，默认只展示最新一轮；是否允许查看旧轮次需 PM 确认 |
| 重新上传是否自动开始生成 | 建议沿用现有上传流程，完成校验后由用户明确开始，避免传错后再次自动执行 |
| Stop 原因是否需要必填 | 沿用原需求为选填；Delete 原因必填 |
| 首页统计如何计算 Stopped | 不新增统计项；Stopped 不计入进行中，Event 条目仍显示自身状态 |
| Delete 是否为软删除 | 产品界面按永久移除处理；实际保留期和恢复能力需合规 / 后端确认 |

## ⑪ 验收重点

- 运行中的 Event 在 Event information 内同时提供可区分的 Stop 和 Danger Delete；状态图标不承担操作。
- Stop 后 Event 仍存在，状态为 Stopped，出现重新上传入口。
- Stop 不显示 Resume，也不允许旧任务从中断点继续。
- Delete 在运行阶段自动取消 / 终止任务，成功后 Event 才从界面消失。
- Delete 原因为空不能提交；Stop 原因可留空。
- 已完成 / 已 Lock 结果在 Stop 后不会被错误改写；Delete 后相关数据从产品界面移除。
- 旧 run 的迟到结果不能写入 Stopped Event 或重新上传后的新一轮。
- Agent 结束后 Stop 消失，Delete 继续位于 Event information 底部的 Danger 操作区。
