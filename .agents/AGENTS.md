# Skill Dispatch

收到任务后，先匹配下表决定读取哪个 Skill。可叠加调用。

| 信号 | Skill | 路径 |
|---|---|---|
| 新功能/新模块/需求分析/用户流程/流程梳理/规则制定/沉淀规则/写说明 | UX Design | `taimei-trials-ux/SKILL.md` |
| 组件生成/页面生成/样式调整/Design Token/设计系统维护 | UI Design | `.agents/skills/ui_design/SKILL.md` |
| Mock 数据/示例文案/Sample/临床业务数据/空状态文案/UI content/文案/写文案 | UI Content Writer | `.agents/skills/ui_content_writer/SKILL.md` |
| PR 前/代码审查/重构/里程碑/清理 | Code Reviewer | `.agents/skills/code_reviewer/SKILL.md` |
| Bug/报错/排障/样式异常/行为异常 | Troubleshooter | `.agents/skills/troubleshooter/SKILL.md` |
| 走查/checklist/测试单 | Checklist Generator | `.agents/skills/checklist_generator/SKILL.md` |
| 记录 bug 根因和方案 | Bug Logger | `.agents/skills/bug_logger/SKILL.md` |

UI 任务：修改 JSX 或样式前，先读 `guidelines/ui-standards/component-usage.md`，按用途和交互匹配组件，并检查产品中可对照的现有用法。参考 HTML 和截图仅提供视觉证据，不决定组件语义；变体与 Token 遵循 UI Design Skill。
