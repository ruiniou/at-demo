---
name: bug_logger
description: Use this skill when you need to record a bug, its root cause, and the solution in the Bug-Log-and-Troubleshooting.md file. This ensures bug records are written in a concise, human-readable format suitable for frontend engineers and designers.
---

# Bug Logger

## 触发条件
满足以下任一条件时激活：
- 用户明确要求「记录 bug」「记一下这个问题」「归档到 Bug Log」
- `troubleshooter` 完成排障后自动调用
- 对话中修复了一个非平凡问题，用户说「把这个记下来」

**不激活**：用户只是口头描述了一个 bug 但没有要求记录；或问题过于琐碎（如拼写错误）不值得归档。

## 执行流程

1. **收集信息**：确认以下要素齐全——
   - 现象（用户视角的异常表现）
   - 根因（技术层面的具体原因：CSS 属性、JS 逻辑、架构缺陷）
   - 解决方案（实际采用的修复方式）
   - 经验教训（1-2 条可复用的防范建议）
2. **读取现有文件**：打开 `Bug-Log-and-Troubleshooting.md`，确认末尾条目的日期，避免重复记录
3. **格式化写入**：按下方模板追加到文件末尾
4. **回读验证**：写入后重新读取文件末尾，确认格式正确、内容完整

## 预期输出产物
- 在 `Bug-Log-and-Troubleshooting.md` 末尾追加一条结构化记录
- 在对话中向用户确认「已记录」并给出条目摘要（一句话）

## 验证步骤
- [ ] 日期格式为 `YYYY-MM-DD`，且与当天日期一致
- [ ] 四个字段（现象 / 根因 / 方案 / 教训）全部填写，无空字段
- [ ] 根因描述包含具体技术细节（CSS 属性名 / 函数名 / DOM 结构），而非笼统的「样式问题」
- [ ] 经验教训至少包含一条可操作的防范建议
- [ ] 文件末尾格式与已有条目风格一致

---

# Bug Logging Guidelines

When the user asks you to record a bug, its root cause, and the solution, follow these guidelines to write the entry in `Bug-Log-and-Troubleshooting.md`.

## Target Audience
The primary readers of this document are **Frontend Engineers** and **Designers**. 
- Avoid overly verbose "AI-style" language. 
- Get straight to the point.
- Use familiar frontend terminology (e.g., Flexbox, DOM, CSS properties, visual behaviors).

## Formatting the Entry
Append the new bug record to the end of the `Bug-Log-and-Troubleshooting.md` file using the following structure:

### [YYYY-MM-DD] [One-sentence summary of the bug]

* **现象 (Symptom)**: 
  Briefly describe what goes wrong from the user's perspective.
* **根本原因 (Root Cause)**: 
  Explain *why* it broke technically. Be concise and precise. Mention the exact CSS property, JavaScript logic, or architectural issue that caused the failure.
* **解决方案 (Solution)**: 
  Explain *how* it was fixed. Keep it practical.
* **经验教训 (Takeaways)**: 
  List 1-2 bullet points on how to prevent this in the future, or what mental models developers should adopt when facing similar issues.

## Example

### [2026-07-20] 嵌套 Flexbox 缺少 `min-w-0` 导致右侧面板被挤出屏幕

* **现象**：
  Stack view 模式下，如果主视图（如 Figure 或 Table）内容很宽，右侧的 Metadata 面板会被整个挤出可视区域。
* **根本原因 (Root Cause)**：
  典型的 Flexbox 尺寸溢出（Flexbox blow-out）。
  在 Flex 布局中，子容器的 `min-width` 默认是 `auto`（即内部内容的实际宽度）。底层元素极宽的尺寸要求会顺着 DOM 树逐层向外传递，强行撑开沿途所有没有尺寸限制的父级 Flex 容器。
* **解决方案 (Solution)**：
  从最外层 `Main.tsx` 到内层 `ShellPreview`，在 DOM 链路上的每个 Flex wrapper 上统一补充 `min-w-0`，强行重置浏览器的 `min-w: auto` 默认行为。
* **经验教训 (Takeaways)**：
  1. **防御性 CSS**：在深层嵌套的 Flex 布局中包裹宽内容时，务必在沿途的 Flex 容器上习惯性加上 `min-w-0` / `min-h-0`。
  2. **不要滥用 Absolute**：排查“元素被挤飞”问题时，千万别用 `position: absolute` 去强行打补丁，正解是从内向外检查漏写的 `min-w-0`。
