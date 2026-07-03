# Tooltip 定位与对齐规则

## 1. 默认位置

- Tooltip 出现在触发对象**下方 2px**，与触发对象**水平居中对齐**

## 2. 左右边界检测（8px 间距）

- 当居中后的 Tooltip **右边缘**距视口右边界 < 8px 时 → Tooltip 与触发对象**右对齐**（Tooltip 右边缘 = 按钮右边缘）
- 当居中后的 Tooltip **左边缘**距视口左边界 < 8px 时 → Tooltip 与触发对象**左对齐**（Tooltip 左边缘 = 按钮左边缘）

## 3. 上下边界检测（24px 间距）

- 当触发对象底部距视口底部 < 24px 时 → Tooltip 翻转到触发对象**上方 2px** 显示

## 4. 文字换行规则

- 图标按钮 Tooltip（居中对齐模式）：`whitespace-nowrap`，**单行不换行**
- 截断文字 Tooltip（左对齐模式，`align="left"`）：`max-w-[232px]` + `break-words`，超出 232px 时换行

## 5. 图层层级

- `position: fixed` + `z-[9999]`，确保**不被任何面板或容器裁切**

## 6. 左对齐模式（`align="left"`）

- 用于被 `...` 截断的文字，Tooltip 与文字**左对齐**，间距 0px
- 不参与左右边界检测（因为本身就靠左）

## 7. 所有 Icon Button Tooltip 文案

| 图标 | Tooltip 文案 |
|------|-------------|
| information-line | Event Information |
| Icon-collapse | Collapse Tree List |
| Icon-expand | Open Tree List |
| Unlock | Lock Table Code |
| Lock | Unlock Table Code |
| file-info-line | Open Metadata |
| save-line | Save Code |
| file-copy-line | Copy Code |
| History Icon | Version History |
| batch-micro | Batch Edit Macro |

## 8. Segmented Control Tooltip 文案

| 控件 | Tooltip 文案 |
|------|-------------|
| Shell | Show Shell |
| split | Side-by-Side View |
| Code | Show Code Only |

## 9. 实现说明

- 使用 `useLayoutEffect` 在渲染后同步测量 Tooltip 实际宽度并调整位置，避免闪烁
- 居中对齐模式下先以默认居中位置渲染，再根据测量结果决定是否切换为边缘对齐
- Tooltip 组件支持 `align` prop：`"center"`（默认，图标按钮）或 `"left"`（截断文字）

## 10. Bug 规避与定位初测问题

- **边缘定位异常 Bug**：靠近页面边缘的 Tooltip 在第一次 Hover 时可能会异常显示在页面的另一侧，第二次 Hover 才会正常。
- **原因与规避规则**：
  - **初次挂载尺寸测量失真**：当 Tooltip 初次渲染挂载（Mount）时，如果其初始 `style` 没有 `position: "fixed"`，浏览器会按照普通块级流进行排版，可能受限于父容器或视口边缘导致测量的宽度极其宽，从而误触发边缘检测并将其推向另一侧。
  - **初始化样式约束**：Tooltip 的初始 `style` 状态**必须默认包含 `position: "fixed"`**（例如 `{ position: "fixed", visibility: "hidden", top: 0, left: 0 }`），以确保它在不可见的初测帧中就拥有正确的物理宽高。
  - **隐藏状态重置**：当 Tooltip 隐藏（`show` 为 `false`）时，**必须**同步将 style 重置为初始状态，避免下一次在其他位置显示时短暂闪烁旧位置或带有错误的旧宽高。
