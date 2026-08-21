---
name: ui_design
description: >
  UI 设计维护与审查。当任务涉及组件生成、页面生成、样式调整、Design Token 使用、
  或设计系统（Design System）维护/更新时激活。
---

# UI Design

## 角色
UI 设计维护/Reviewer。负责组件与页面的视觉质量，严格遵守 Design System。

## 触发条件
满足以下任一条件时激活：
- 用户要求生成/修改 UI 组件或页面
- 任务涉及 Design Token 使用、样式调整
- 任务涉及设计系统（Design System）维护或更新
- 用户要求审查 UI 视觉质量

**不激活**：纯逻辑/数据层修改（不涉及 UI）；或用户只要求读取/查询代码。

## 执行流程

### 生成/修改 UI 时
1. **上下文确认**：先声明本次引用了哪些 `ui-standards/` 模块，列出给用户确认
2. **Token 检查**：所有色值、间距、圆角、字号必须来自 Design Token，禁止硬编码
3. **状态覆盖**：组件必须覆盖完整交互状态：default / hover / active / disabled / error（适用时含 loading）
4. **自检清单**：遵守 `ui-standards/anti-patterns.md` 的生成前自检清单
5. **交互基准**：遵守 `ui-standards/interaction.md` 的交互基准
6. **输出代码**：生成符合项目规范的组件代码

### Design System 维护
7. **更新 DS 前必须事先通知用户**，说明改动范围和影响
8. **代码 → DS 同步**：如果代码改动影响了设计规范（尤其是 Responsiveness），必须同步更新对应的 `ui-standards/*.md`
9. **DS → 代码同步**：修改 `ui-standards/*.md` 后，检查现有代码是否需要跟进调整，列出影响清单

### 审查模式
10. 审查时只标注问题 + 引用标准，不直接替换设计
11. 问题分级：`阻断级`（违反硬规则）/ `建议级`（可优化）

## 预期输出产物
- **生成模式**：符合 Design System 的组件代码 + 简要说明（引用了哪些 Token 和标准）
- **审查模式**：问题清单（表格：位置 / 问题 / 严重度 / 引用标准）
- **DS 维护**：变更说明 + 影响范围清单

## 验证步骤
- [ ] 所有色值、间距、圆角、字号均来自 Design Token，无硬编码值
- [ ] 组件覆盖了所有必要的交互状态
- [ ] 如引用了 `ui-standards/` 模块，已在输出中声明
- [ ] 审查模式下，每个问题都引用了对应的标准条款
- [ ] DS 变更已通知用户并列出影响范围

## 引用模块速查
参见 `GLOBAL.md` 路由规则表和 Quick Context 段落。
