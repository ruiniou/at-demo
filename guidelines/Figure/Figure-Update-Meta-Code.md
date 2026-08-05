# Metadata 同步至 Copilot：触发时机与状态逻辑

**What it is:** 定义 Metadata 面板中的修改同步至代码的交互流程、状态流转与 Baseline 机制。
**Scope:** 仅适用于 Figure Document 的 Metadata 更新流程。
**Date:** 2026-08-05

## 问题背景

早期同步方式依赖将修改记录强行塞入 AI Copilot 输入框，导致占用大量空间且对仅需确认的替换型操作不友好。同时，同步按钮触发时机、处理范围、Baseline 移动规则及失败重试逻辑缺乏明确定义。

优化后的流程引入 To be Updated Card（对话流卡片）与 Metadata Changes Chip（输入框上方摘要），分离了“改动确认”与“补充 Prompt”的操作。

## 核心名词定义

| 名词 | 定义 |
|---|---|
| To be Updated Card | 在 Copilot 对话流中展示本次待同步 Diff 清单的详情卡片。 |
| Metadata Changes Chip | 吸顶在输入框上方的摘要标识，与 Card 实时绑定并反映相同 Diff。 |
| 净 Diff | 当前 Metadata 状态相较于 Baseline 的差异，同一字段的多次修改只保留最终结果。 |
| Baseline | 上一次 AI 成功完成代码更新时的 Metadata 字段状态快照。仅在同步成功时前移。 |

## 设计方案与行为流

### Happy Path
1. 用户在 Metadata 面板编辑字段。
2. 系统计算出净 Diff，若 Diff > 0，则底部出现 Update Code 按钮。
3. 点击 Update Code：
   - 按钮隐藏。
   - 打开 Copilot，在对话流底部出现 To be Updated Card，输入框上方出现 Metadata Changes Chip。两者状态随面板新编辑实时更新。
4. 点击 Proceed 提交同步（或输入额外 Prompt 点击发送）：
   - Metadata Changes Chip 和初始底部的 To be Updated Card 消失。
   - 对话历史流中插入一条持久化的 To be Updated Card（作为本次提交的快照记录）。
   - 历史卡片中的 Cancel 按钮隐藏，Proceed 按钮转为 Proceeded 且状态设为 Disabled。
   - 卡片正下方出现 AI 生成中的 loading 状态。
5. 同步成功：
   - 历史卡片状态保持只读。
   - AI 输出更新完成的文本和代码 diff。
   - 内部 Baseline 前移。

### 开发行为边界 (Do & Don't)

- **Do** 始终采用“当前值 vs Baseline”计算净 Diff。
- **Do** 确保提交动作（Proceed/发送）将当前批次的 Diff 快照固化至历史卡片，切断其与后续新编辑的关联。
- **Do** 将 Cancel 动作视为“纯粹关闭”，不拦截操作，不移动 Baseline，保留所有净 Diff 供下次触发。
- **Don't** 在任何失败、Cancel 或进行中的状态下移动 Baseline。
- **Don't** 将用户未能通过表单校验的输入计入 Diff。
- **Don't** 隐藏完成态历史卡片的操作栏 (Footer)，而是隐藏 Cancel 按钮，将 Proceed 变为 Proceeded 并禁用。

## 异常与失败场景

| 场景 | 触发条件 | 处理方式 |
|---|---|---|
| AI 处理失败 | 网络异常或大模型生成失败 | Baseline 不前移，本批次 Diff 保留。生成 Error Card 提供错误原因与 Retry。 |
| 提交失败后存在新编辑 | 在之前提交（现已失败）的过程中，用户编辑了其他字段 | 新旧 Diff 自动合并（因 Baseline 未移动），下次重试或提交流程统一处理合并后的净 Diff。 |

## 完整状态流转表 (Status Table)

| 场景 | 面板 Update 按钮 | Copilot 输入框 Chip | 初始卡片 (未提交) | 历史卡片 (已提交) | Diff & Baseline 状态 |
|---|---|---|---|---|---|
| 无变化 | 隐藏 | 不显示 | 不显示 | - | Diff = 0，Baseline 不变 |
| 存在净 Diff，未触发 Update | 显示 (数量=Diff) | 不显示 | 不显示 | - | Diff > 0，Baseline 不变 |
| 点击 Update Code | 隐藏 | 显示 (实时同步 Diff) | 显示 (实时同步 Diff) | - | Diff > 0，Baseline 不变 |
| 点击 Cancel | 重新显示 | 消失 | 消失 | - | Diff 不变，Baseline 不变 |
| 点击 Proceed / Send | 禁用 | 消失 | 消失 | 插入历史流，Cancel 隐藏，Proceed 变 Proceeded (Disabled) | 本批次 Diff 锁定提交，Baseline 暂不变 |
| 处理期间编辑新字段 | 仍禁用 | 消失 | 消失 | 不受影响 | 独立累积新 Diff，不混入本次提交 |
| AI 返回成功 | 按剩余 Diff 重新判断显隐 | 消失 | 消失 | 状态保留只读，下方输出成功结果 | **Baseline 前移**，参与的字段更新为基准 |
| AI 返回失败 | 重新显示 | 消失 | 消失 | - (替换为 Error Card) | Diff 完全保留，Baseline 不变 |
