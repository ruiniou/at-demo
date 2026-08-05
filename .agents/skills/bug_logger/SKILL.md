---
name: bug_logger
description: Use this skill when you need to record a bug, its root cause, and the solution in the Bug-Log-and-Troubleshooting.md file. This ensures bug records are written in a concise, human-readable format suitable for frontend engineers and designers.
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
