# Metadata 与 Code 同步：交互实现说明

| What it is | Scope | Date |
|---|---|---|
| Code Save 后提示 Metadata 落后，并在 Copilot 对话中展示 Code 和 Metadata 的变更。 | Sprint 8 原型中的 TFL Code、Metadata 面板与 TFL Copilot。 | 2026-10-15 |

## 当前原型边界

仓库目前用组件状态模拟 Code Save 和 Copilot 回合，没有持久化版本、真实 AI 推断或服务端失败结果。以下流程用于交互评审，不能作为生产同步能力的验收依据。评审草稿中的 PM 和架构待确认项仍以 Proposal 为准。

| 状态 | 触发 | 界面 |
|---|---|---|
| 同步 | 初始或 Update Metadata 完成 | 无落后通知。 |
| 落后，未关闭通知 | 手动修改 Code 并 Save 完成 | Code 工具栏下显示 `Code changed.`、文字链接 `Update Metadata` 和关闭按钮；Metadata 入口暂不显示红点。 |
| 落后，已关闭通知 | 用户关闭本次通知 | 通知隐藏。同一落后周期再次 Save 不重新弹出。 |
| 更新中 | 用户点击 `Update Metadata` | 通知改为 `Updating Metadata…`，对话流新增 `Update Metadata` 用户气泡，不附带 Code 变更。 |
| 已更新 | Copilot 原型回合结束 | 有字段变更时出现 Edited metadata，字段刷新并回到 Unconfirmed；无字段变更时只显示 `Metadata is up to date.`。 |

Copilot 执行期间 Save 不可用，因此不存在“同步中再次 Save”的交互分支。Code 和 Metadata 的业务变更记录仍需由真实执行结果提供。

## 临时走查控制面板

Workspace 顶部的 `Demo controls` 仅供本轮评审。点击按钮会在当前选中的 TFL 上运行，并重置该 TFL 的演示字段；不需要在 Copilot 输入框输入提示词。A–C 使用单字段样例；D 在 Figure、Table、Listing 各准备两处 Code 改动，以走查多字段同步。

| 按钮 | 走查结果 |
|---|---|
| A · AI changes Code + Meta | 修改 Figure 的展示标题和对应 Component Label；对话流显示 Edited code 与 Edited metadata。数据集和分析条件不变。 |
| B · AI changes Code only | 只显示 Edited code，Metadata 无需变更。 |
| C · AI changes Meta only | 只显示 Edited metadata，Code 不变；字段不显示 Updated 标签。 |
| D · Manual edit, then Save | Code 面板预填两处改动；点击 Save 后再点 `Update Metadata`，一次同步返回两条 Metadata diff，并同时更新对应字段。每条 diff 可定位并聚焦其字段。 |

每次点击都从相同的演示基线开始。控制面板和演示数据不代表真实 AI 执行结果。

## Do

- Code diff 的标题使用 `Edited code`，Code icon 位于标题前，折叠箭头在 Block 最右侧。
- Edited metadata 展开后按分组展示字段旧值、新值，并允许从行跳转到字段。
- Sprint 8 变更不在字段标题旁增加 Updated 标签，保留 AI Infer 等已有标识。
- Metadata 面板已打开时原地刷新，不抢焦点。

## Don't

- 不在 Copilot 执行期间提供 Save。
- 不在 `Update Metadata` 气泡或回复中展示用户手动修改的 Code diff，避免被理解为 Copilot 改了 Code。
- 不把本地模拟 Save 视为服务端版本提交，也不把正则提取视为真实 Copilot Metadata 推断。
- 不因用户关闭通知而清除 Metadata 落后状态。

## 接入生产前需确认

- Save 成功、失败和版本号的服务端事件结构。
- `write_code`、`edit_code` 与 Metadata 更新结果的统一 diff 数据结构及审计记录。
- Blueprint 随 Metadata 更新的服务端边界，以及失败和 Stop 后的状态回滚与 Retry。
