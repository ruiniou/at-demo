# Scrollbar Design Rules

**What it is:** 前端自定义滚动条（基于 WebKit）的全局尺寸、颜色与交互规范。
**Scope:** AI Copilot 全局面板、弹窗、代码区与 Shell 预览区。
**Date:** 2026-07-31

## 视觉与交互规范 (Visual & Interaction Specs)

| 滚动条类型 | CSS 类名 | 容器宽度 | 滑块宽度 | 默认状态 (滑块) | Hover 状态 (滑块) | 轨道 (Track) 样式 | 适用场景 |
|---|---|---|---|---|---|---|---|
| **默认滚动条** | *(全局默认)* | 12px | 8px | `color-mix(in srgb, var(--color-graphite-20) 75%, transparent)` | `var(--color-graphite-40)` | 透明无边框 (悬浮画布上) | 侧边栏、Dropdown、Modal、AI 对话等 |
| **预览画布滚动条** | `.scrollbar-code` | 12px | 8px | `color-mix(in srgb, var(--color-graphite-20) 75%, transparent)` | `var(--color-graphite-40)` | 底色 `Graphite/10`，外侧带 1px `Graphite/10` 分割线，常驻显示 | Shell Preview (Table/Figure/Listing), Log 面板 |
| **代码编辑器特化** | `.scrollbar-editor` *(规划)* | 16px | 12px | 完全透明 (仅 Hover 时显示) | `var(--color-graphite-40)` | 透明无边框 | Monaco Code Editor 等专业代码输入区 |
| **彩色滚动条** | `.scrollbar-colored` | (继承) | (继承) | `#E6CCDC` | `#CC99B9` | (继承) | 配合特殊底色的组件，如 ToolCallCard |

*注：所有滑块均要求 8px 圆角，通过 `border: 2px solid transparent; background-clip: padding-box;` 实现容器与滑块间的透明间隙，达到精确控制滑块宽度的目的。*

## 前端技术实现边界 (Implementation Constraints)

### WebKit 与 标准 CSS 的回退处理 (Fallback)
Chrome 121+ 全面支持标准 `scrollbar-color`。若全局定义此标准属性，将导致 Chrome 强制屏蔽所有 `::-webkit-scrollbar` 自定义样式，导致圆角和内边距丢失。

- **Do**: 将标准滚动条属性（仅供 Firefox 降级使用）严格包裹在 `@supports (-moz-appearance: none)` 隔离区中。
- **Don't**: 在全局 `*` 或 WebKit 定义中直接使用 `scrollbar-width` 或 `scrollbar-color`。

### WebKit 悬浮重绘 Bug (Hover Repaint Bug)
当容器触发 `:hover` 时，直接修改 `::-webkit-scrollbar-thumb` 的 `background-color` 无法触发重绘，导致 `.scrollbar-code` 悬浮显示失效。

- **Do**: 使用 CSS 变量（如 `--scrollbar-thumb-color`）作为中介。在容器 `:hover` 时改变变量值，从而强制 WebKit 引擎重新计算并重绘样式。
- **Don't**: 尝试直接使用 `.scrollbar-code:hover::-webkit-scrollbar-thumb { background-color: rgba(...) }`。
