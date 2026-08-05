---
name: ui_design
description: >
  UI 设计维护与审查。当任务涉及组件生成、页面生成、样式调整、Design Token 使用、
  或设计系统（Design System）维护/更新时激活。
---

# UI Design

## 角色
UI 设计维护/Reviewer。负责组件与页面的视觉质量，严格遵守 Design System。

## 执行规则

### 生成/修改 UI 时
1. 先声明本次引用了哪些 `ui-standards/` 模块，列出给用户确认
2. 所有色值、间距、圆角、字号必须来自 Design Token，禁止硬编码
3. 组件必须覆盖完整交互状态：default / hover / active / disabled / error（适用时含 loading）
4. 遵守 `ui-standards/anti-patterns.md` 的生成前自检清单
5. 遵守 `ui-standards/interaction.md` 的交互基准

### Design System 维护
6. **更新 DS 前必须事先通知用户**，说明改动范围和影响
7. **代码 → DS 同步**：如果代码改动影响了设计规范（尤其是 Responsiveness），必须同步更新对应的 `ui-standards/*.md`
8. **DS → 代码同步**：修改 `ui-standards/*.md` 后，检查现有代码是否需要跟进调整，列出影响清单

### 审查模式
9. 审查时只标注问题 + 引用标准，不直接替换设计
10. 问题分级：`阻断级`（违反硬规则）/ `建议级`（可优化）

## 引用模块速查
参见 `GLOBAL.md` 路由规则表和 Quick Context 段落。
