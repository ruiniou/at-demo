# Metadata 与 Code 同步 Proposal

Chimama · 2026-10-15 · Atlas Sprint 8 · 评审前草稿

## ① 问题背景

**现状。** 当前只有 Meta → Code 单向更新：用户手动修改 Metadata 后，点击右上角 Update Code，待定 diff 吸附在 Copilot 输入框上方，发送后 Copilot 改 Code，对话流里出现 Code diff 卡片。

**新需求（Sprint 8）。**

1. Copilot / Agent 返回 Metadata 时，需更新 Metadata；Metadata 面板已打开时，自动刷新数据。
2. Code 版本变更时，需触发 Metadata 和 Blueprint 的自动更新（当前稿为询问是否自动触发 Copilot 对话）。

**目标。** Metadata 与 Code 始终匹配。

**版本变更的判定。** Write code 后执行 Save，且 Save 成功的那一次，快照更新为新版本。无论来源是：AI `write_code`（重交完整程序及其交付 metadata，用于人群、分组、block、宏、布局等语义 / metadata 改动）、AI `edit_code`（局部编辑），还是用户在界面中手动修改后 Save。

**核心问题。** 双向更新的交互如何设计，才能做到：用户看得见、管得住、不被反复打扰，并且每次变更都可追溯。

## ② 主要改进点

| 维度 | 当前 | 新方案 |
| --- | --- | --- |
| 更新方向 | Meta → Code 单向 | 双向，统一经 Copilot（有变更记录） |
| AI 返回 Metadata | 无 | 面板已开则原地刷新；字段出现 Updated 标识；面板关着则入口出现红点 |
| 变更记录 | Copilot 里只有 Code diff | Edited Code 与 Edited Metadata 两张卡 |
| 手动 Save | 不影响 Metadata | Code 顶部出现通知行，一键更新 Metadata |
| Metadata 落后于 Code | 无任何提示 | Code 通知行 + Metadata 入口红点 |

## ③ 设计方案

### 3.1 设计原则

1. **Copilot 是唯一写入口。** 任何一次 Metadata / Code 的更新都经过一轮 Copilot，自带变更记录，满足 ALCOA+ 可追溯。
2. **版本 = Save 成功。** 不是编辑，也不是 Accept。
3. **Confirm 与同步完全正交。** Confirm 只是手动勾选，不随编辑或同步自动改变；AI 写入的字段回到 Unconfirmed。
4. **非阻断。** 同步相关的提示一律不用弹窗。

### 3.2 情况与 Happy Path

| 编号 | 触发 | 改了什么 | Copilot 里 | Metadata 面板 | Code 面板 |
| --- | --- | --- | --- | --- | --- |
| **E**（已有） | 用户改 Meta，点 Update Code，发送 | Code | 气泡带折叠的 Metadata changes，完成后出现 Edited Code | 无变化（改动本来就是用户做的） | 版本 +1 |
| **A** | 用户在 Copilot 发送指令 | Code + Meta（`write_code`） | Edited Code 与 Edited Metadata | 字段出现 Updated；面板关着则入口红点 | 版本 +1 |
| **B** | 用户在 Copilot 发送指令 | 只改 Code（`edit_code`） | Edited Code | 不变 | 版本 +1 |
| **C** | 用户在 Copilot 发送指令 | 只改 Meta | Edited Metadata | 字段出现 Updated；面板关着则入口红点 | 不变 |
| **D** | 用户在 Code 面板手动修改并 Save | 版本 +1，Metadata 落后 | 点 Update Metadata 后：气泡不带 Code 变更，AI 回复 Edited Metadata | 入口红点（落后期间一直在）；更新后字段出现 Updated | 顶部出现通知行 |

A / B / C 中，AI 在同一轮里自己判断是更新 Metadata、两者都更新、还是只更新 Code，因此这三种情况之后 Metadata 与 Code 是一致的，不需要额外的落后提示。只有 D 会产生落后。

### 3.3 UI 变更清单

| 优先级 | 变更 | 类型 | 说明 |
| --- | --- | --- | --- |
| P0 | Edited Code 卡 | 修改现有 Code diff | 标题 Edited Code，带 +n −n，折叠时无底色，展开为红绿行加行号。仅用于 AI 回复；手动 Save 后的 Update Metadata 气泡不展示 Code 变更 |
| P0 | Edited Metadata 卡 | 新增 | 按 Basic Info / Components 分组，每行旧值 → 新值（新值用品牌色），带数量标识，折叠时无底色；无变化时不出现 |
| P0 | Code 顶部通知行 | 新增 | 位于 Code 面板工具栏下方，见 3.4 |
| P0 | 字段 Updated 标识 | 新增 | 复用字段标签旁 AI Infer / Conflict 的徽章样式 |
| P0 | Metadata 入口红点 | 新增 | 复用 Listing 已有的入口红点 |
| P1 | 卡片行定位到字段 | 新增 | 点击 Edited Metadata 里的某一行，跳转到 Metadata 面板对应字段（沿用 Figure 的做法，必要时打开面板并切换 tab） |

**不放在 Metadata 面板顶部的原因。** Components tab 下灰色 bar 的左上角已被分类导航占用；Metadata 面板默认关闭，而 Save 的那一刻用户一定在 Code 面板里。因此通知放在 Code 顶部。

### 3.4 规则边界

**Code 顶部通知行**

- 出现时机：某次 Save 成功，使 Metadata 由同步变为落后。
- 内容：`Saved. Metadata is behind Code.` + 按钮 `Update Metadata` + 关闭 ×。
- 点击 Update Metadata：这一行变为 `Updating Metadata…`（带旋转图标），触发一轮 Copilot，完成后这一行消失。有变化时，Copilot 里出现 Edited Metadata 卡，字段出现 Updated；**无变化时不出现任何组件**，AI 只在对话中用文字说明。
- 点击 ×：这一行隐藏，入口红点保留。**打扰频率的单位是“落后周期”，不是每次 Save**：同一个落后周期内再次 Save，不再出现这一行。允许用户有意不同步。
- 周期结束条件：Metadata 被更新（点 Update Metadata 完成更新）。
- AI 无法从 Code 变动推断出 Metadata 变动的情况目前不存在；若出现，由 AI 在对话中告知用户，不单独设计组件。

**字段 Updated 标识**：字段被 AI 改动且未 Confirm 时显示；只在手动 Confirm 时消失，用户编辑字段不会清除它。

**入口红点**：Metadata 面板关着时，出现于「有 AI 新改动未查看」或「Metadata 落后于 Code」。前者打开面板即消失（之后由字段标识接手），后者直到更新完成才消失。清除规则需与 Listing 现有做法对齐（见 TBD）。

**面板已开时的刷新**：原地刷新，不自动跳转，不抢焦点。

**AI 运行期间用户编辑了同一字段**：以 AI 结果为准，不做冲突处理。被覆盖的字段仍为 Unconfirmed，且在 Edited Metadata 卡里可追溯。

### 3.5 失败场景与安心文案

| 场景 | 处理 |
| --- | --- |
| ① Save 失败 | 不产生版本，不触发任何同步，编辑内容保留。Code 面板提示 `Save failed. Your edits are kept.` |
| ② Save 成功，但 Update Metadata 失败或被 Stop 打断 | 版本保留，Metadata 保持落后。Copilot 里出现错误提示和 Retry，通知行恢复为可再次点击的 Update Metadata。文案：`Metadata is unchanged.` |
| ③ Update 运行期间 Code 又出了新版本 | 本次结果标注基于旧版本，Metadata 仍为落后，不自动连环重跑 |

| 位置 | 文案 |
| --- | --- |
| Code 通知行 | `Saved. Metadata is behind Code.` / `Update Metadata` |
| 更新中 | `Updating Metadata…` |
| AI 文字回复：无变化 | `Metadata is up to date.`（只有文字，无卡片） |
| AI 回复：有变化 | `Metadata updated. Review and confirm the changes.`（附 Edited Metadata 卡） |
| Save 失败 | `Save failed. Your edits are kept.` |
| 卡片标题 | `Edited Code` / `Edited Metadata` |

## ④ MVP 范围说明

**P0（本期）**

- 版本判定：Save 成功即新版本
- Edited Code 卡、Edited Metadata 卡
- Code 顶部通知行（含 ×，按落后周期出现）
- 字段 Updated 标识、Metadata 入口红点
- Metadata 面板已开时自动刷新

**P1**

- 卡片行定位到字段
- Update 失败后的 Retry
- 字段在另一个 tab 时的跳转与打开

**不在本期（后置）**

- Metadata 草稿与新 Code 版本冲突、版本回滚、同步中途失败导致的一致性问题
- Lock 前检查
- Save 下拉（备选，见 TBD）
- 多人并发修改
- Event Copilot 批量改动时的 Metadata 汇总
- 版本管理与恢复：Agent 改动后的恢复走版本管理，另行设计，本期只记录

## ⑤ TBD 待确认事项

🔴 评审前必须确认　🟡 评审后可跟进　✅ 已确认

| 待确认问题 | 当前假设 | Owner | 状态 |
| --- | --- | --- | --- |
| Save 时询问是否必须嵌在 Save 动作内？ | 不必，Save 成功后的非阻断通知行即可；Save 下拉作为备选 | PM | 🔴 |
| AI 回合更新了 Metadata，是否结束当前“落后周期”？ | 不结束，仅 Update Metadata 结束 | AI 架构师 | 🔴 |
| 手动 Save 也走 Copilot，Save 时询问是否更新 Metadata | 已确认 | PM | ✅ |
| AI 可判定三种结果：只改 Meta / 两者都改 / 只改 Code | 已确认 | AI 架构师 | ✅ |
| 走 Copilot 即有变更记录 | 已确认 | PM | ✅ |
| 是否存在 AI 无法从 Code 的变动推断出 Metadata 变动的情况？ | 暂时不存在；若出现，由 AI 在对话中告知用户；无变化时不出现任何组件 | AI 架构师 | ✅ |
| 是否允许用户有意不同步（点 ×）？ | 允许；× 后本周期不再提示，入口红点保留 | PM | ✅ |
| Agent 改完 Code / Metadata 后是否有撤销入口？ | 通过版本管理恢复；版本管理另行设计，本期只记录 | PM | ✅ |
| Blueprint 是否用户可见？是否为 Metadata 的界面投影？ | 按“Blueprint 随 Metadata 同向更新”处理 | AI 架构师 | 🟡 |
| Save 下拉（Save / Save & Update Metadata，记住上次选择），作为重度用户的升级项 | 备选，先不做 | PM | 🟡 |
| Metadata 入口红点的清除规则与 Listing 是否一致 | 按“AI 改动打开即消失、落后保留”设计 | 设计 / 前端 | 🟡 |
| Metadata 面板 `n/N Confirmed` 的计数口径 | 未确认，Demo 按全部字段计数 | PM / 前端 | 🟡 |
| Updated 与 AI Infer 徽章是否合并 | 先分开 | 设计 | 🟡 |
| 落后期间 Code 面板被隐藏（只看 Shell）时，Metadata 面板内无提示，仅入口红点 | 先接受 | 设计 / PM | 🟡 |
| 卡片标题大小写：现有组件是 Edited code / Edited Metadata，规范应统一为 Title Case | 统一为 Edited Code | 设计 | 🟡 |
| Metadata 与 Code 冲突、版本回滚、同步失败 / Stop 的一致性（情况 6-8） | 后置；其中回滚与版本管理一起设计 | PM | 🟡 |
| Lock 前检查 | 暂不考虑 | PM | 🟡 |
| 规则文档 `guidelines/Listing/Metadata.md` 中“用户编辑即隐含确认”已与当前产品逻辑不符 | 需更新文档 | PM / 设计 | 🟡 |

## ⑥ 附录

**A. 术语**

- `write_code`：重交完整程序及其交付 metadata。
- `edit_code`：局部代码编辑。
- 落后周期：从某次 Save 使 Metadata 由同步变为落后，到 Metadata 被更新为止。

**B. 交互 Demo**：https://claude.ai/artifact/7w1gmwj7SWKN5LiqdJiBRh　按钮 A / B / C 对应情况 A / B / C，D 对应手动修改后 Save。

**C. 参考组件**：Copilot 中的 Block/Code-Diff、Block/Meta-Diff 卡片；已有的 Metadata Changes 吸附 diff（情况 E）。
