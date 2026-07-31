# Atlas · Metadata同步至Copilot：触发时机与状态逻辑 Proposal

## ① 问题背景

**问题一：Metadata修改同步到代码的方式依赖预填一整段Brief进输入框。** 用户反馈这种方式不便：Brief占满输入框空间，用户不清楚还需要补充什么、该从哪里改起，尤其在多数改动其实是确定性替换（无需说明）的情况下，仍然要求用户面对一整段文字。

针对这个问题，此前已确定的优化方向是：新增 **To be Updated Card**（对话流内的详情卡片）与 **Metadata Changes Chip**（吸顶在输入框上方的摘要），用来把"改动详情的展示"和"需要用户补充说明"两件事拆开——多数改动可以直接查看Card后点击Proceed，无需强制打字；只有AI无法仅凭新值判断实现方式的结构性改动，才需要用户在输入框里补充意图。

**问题二：Update Code的触发时机和处理对象逻辑不清晰。** 具体包括：Update按钮该在什么条件下出现/消失、点击后处理的是"哪个范围"的修改（增量还是全量）、面板停留期间继续编辑Metadata该如何处理、Cancel和提交失败分别应该如何影响已产生的Diff。这些如果不定义清楚，容易出现修改被遗漏、重复提交、状态歧义等问题。

## ② 主要改进点

| 项目 | 定义 |
|---|---|
| To be Updated Card | 对话流内的详情卡片，展示本次待同步的Diff清单，支持展开/收起 |
| Metadata Changes Chip | 吸顶在输入框上方的摘要标识，与Card是同一份Diff的两种呈现，实时同步 |
| Update对象 | **净Diff**：当前Metadata状态相对于Baseline的差异，按字段折叠为最终值，不保留中间修改过程 |
| Baseline | 上一次AI Copilot **成功完成代码更新**时，被同步字段的Metadata状态。只有同步成功才会前移，点击Update、点击Cancel、提交失败均不移动 |
| Cancel | 关闭Card与Chip，不影响Metadata字段值，不影响Diff，不移动Baseline |
| 提交（Proceed / Apply Changes） | 关闭Card与Chip，进入生成中状态；等待期间的新编辑不合并入本次请求，但会在本次结束后自动计入后续Diff |
| 失败态 | 单独生成 **Error Card**|单独产生 Error Card

## ③ 设计方案

### Happy Path

1. 用户在Metadata面板编辑字段（值替换/来源切换等）
2. 只要当前状态 ≠ Baseline，Update Code按钮出现，显示净diff数量
3. 点击Update Code：
   - 按钮隐藏
   - Copilot面板展开，对话流内插入 To be Updated Card，输入框上方出现 Metadata Changes Chip，两者内容一致且实时绑定同一份Diff
4. 面板停留期间，用户可继续回Meta编辑（含已列出字段的再次修改，或新字段）：Card与Chip的内容/数量随之实时更新
5. 用户可直接点击 Proceed，或在指令框补充说明后点击 Apply Changes 提交

### Baseline 是什么（补充说明）

Baseline记录的是最近一次AI成功完成代码更新时，参与那次同步的字段的具体取值。

举例：某次成功同步处理了 Y-Axis Label、Source Variable、Dataset Reference 三个字段，那么这三个字段在Baseline里就固定为那次同步时的值。之后不管用户怎么编辑Metadata（包括这三个字段被再次修改，或者新字段被修改），系统始终拿"当前值"和"Baseline里记录的值"逐字段比较，比出来的差异就是净Diff——这也是为什么Cancel、失败都不能移动Baseline：一旦移动了，就代表"系统认为这些改动已经同步到代码了"，但实际并没有。

### 规则边界

- **Diff计算方式**：始终是"当前 vs Baseline"的净值，同一字段多次修改只保留最终值
- **Baseline只在同步成功时移动**
- **提交锁定**：一旦提交，本批Diff视为"已发出"，处理期间的新编辑不会混入这次请求，避免AI处理基准中途变化产生竞态；但也不会丢失，会在本次结束（成功或失败）后自然计入后续Diff计算
- **Cancel**：关闭Card和Chip，不做任何拦截或警告（因为Diff/Baseline都不受影响，是完全可恢复的操作）。用户需要重新点击Update Code才会再次触发Card/Chip，届时展示的是完整的当前净Diff（自动包含被Cancel掉的那次编辑）
- **字段校验失效处理**：若用户编辑的字段无法通过校验，则该编辑视作无效，恢复为之前的值，不计入 Diff

### 失败场景

| 场景 | 处理方式 |
|---|---|
| AI生成/网络失败 | Baseline不移动，Diff完整保留；原To be Updated Card不复原，取而代之出现独立的 **Error Card**（错误原因 + Retry按钮） |
| 点击Retry | 相当于用同一批（且已包含期间新增编辑的）Diff重新提交一次，行为等同于重新走一次提交流程 |
| 提交后又编辑了新字段，随后本次提交失败 | 失败不影响新编辑的计入——Baseline从未移动，失败批次与后续新编辑的Diff会合并为一份完整净Diff，无需特殊合并逻辑 |



## ⑥ 附录：完整状态表

| 场景 | Meta Update按钮 | 对话流卡片 | 吸顶 Chip | Diff / Baseline |
|---|---|---|---|---|
| 无变化 | 不显示 | 无 | 无 | diff = 0 |
| 有编辑，未点击Update | 显示，数量=净diff | 无 | 无 | diff > 0，Baseline不变 |
| 点击Update | 隐藏 | To be Updated Card 展开，实时同步 | 显示，实时同步 | 同上，Baseline不变 |
| 面板停留期间继续编辑 | 仍隐藏 | 内容随之更新（增删/改值） | 数量随之更新 | diff更新，Baseline不变 |
| 点击Cancel | 重新显示（diff仍在） | 消失 | 消失 | diff/Baseline均不变 |
| 点击Proceed / AI copilot提交按钮 | 禁用 | 消失，转为生成中指示 | 消失 | 本批锁定待处理，Baseline暂不变 |
| 提交处理期间继续编辑 | 仍禁用 | 不受影响 | 不受影响 | 新编辑独立累积，不合并入当前请求，但仍计入diff |
| AI返回成功 | 按剩余diff重新判断显隐 | 转为已完成状态 | 按剩余diff重新判断显隐 | Baseline前移至提交批次的字段值，Edited字段→Unconfirmed |
| AI返回失败 | 重新启用（diff仍在） | 消失，替换为独立 Error Card（错误原因+Retry） | — | Baseline不变，Diff完整保留（含提交批次+处理期间新增） |
