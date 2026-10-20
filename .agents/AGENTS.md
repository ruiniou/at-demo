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

## 协作习惯

- **验证**：改 UI 后必须在页面里实际操作验证。仓库没有安装 TypeScript，`npx tsc` 不起作用；用 `npx vite build`（输出目录指向临时目录）加浏览器验证。没验证到的部分要明确说明，不要默认“通过”。
- **提交**：当用户提到当前是 Sprint N 或某个阶段时，这些功能默认提交到对应支线（Sprint 8 → `sprint8/base`），只做快进推送，不强推。`guidelines/` 与 Proposal 文档不进 GitHub 提交。
- **组件**：改 UI 前先按 `guidelines/ui-standards/component-usage.md` 匹配现有组件。确实不合适时，先向用户提议，或扩展组件；不要在页面里临时拼装或覆盖组件样式。
- **规则文档**：只写 PRD 式规则和给前端的特殊规则，不写与 Proposal 的差异，不写 TBD。
