# AI Copilot Panel Layout Guidelines

When making modifications to the panel layout logic (e.g., in `Main.tsx`), always adhere to the following synchronization rules.

### **通用自适应规则：**

1. Code 面板 = 可用宽度 - Σ(所有打开面板的当前宽度)

2. 若 Code < 360px（Code 面板最小宽度）：   
   a. 依次将已打开面板压缩至 min 宽度（顺序：meta → shell → tree）  
   b. 若仍不足 → AI 压缩至 min(300px)  
   c. 若仍不足 → Code 保持 360px，整体横向滚动

3. 拖拽时：被拖面板 clamp(min, max)，Code 被动吸收

4. 面板打开：使用该面板的默认宽度（或上次拖拽记忆的宽度）

### **各 Panel 宽度约束**

以 1440px 为例：

| Panel | 默认宽度 | 最小宽度 | 最大宽度 | 初始状态 | 压缩行为 |
| --- | --- | --- | --- | --- | --- |
| Tree List (pTL) | 240px | 180px | 320px | On | 文字超出部分 ellipsis |
| Shell Preview (pSH) | 560px | 320px | 800px | On | 内容区水平滚动 |
| Metadata (pME) | 380px | 280px | Shell-only 模式: 640px<br>Code & Shell 模式: 520px | Off | 不可超出 Shell Preview 宽度 − 40px，并在视图切换时自适应 clamp |
| Code (pCode) | flex: 1 | 360px | 无上限 | On | 被动吸收剩余空间，Toolbar 收为 Ellipsis |
| AI Copilot (pAI) | 360px | 300px | 460px | Off | |

**典型场景：**

| 场景 | TL | SH | Code | AI |
| --- | --- | --- | --- | --- |
| 默认：TL + SH + Code | 240 | 560 | 剩余 | — |
| TL+ Code (全折叠) | 0 | 0 | 剩余 | — |
| 最挤：TL + Meta + Code + AI | 180 (min) | 320 (min) | 剩余 | 300 (min) |

### **上下布局：**

| Panel | 默认高度 | 最小高度 | 最大高度 | 初始状态 | 压缩行为 |
| --- | --- | --- | --- | --- | --- |
| Shell Preview | 50% | 180px | 容器高度 - 301px | On | 高度可拖拽调整 |
| Code Panel | 50% | 300px | 容器高度 - 181px | On | 高度可拖拽调整 |
