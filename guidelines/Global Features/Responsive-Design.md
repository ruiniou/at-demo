# Responsive Design

This document details the responsive design specifications for the system, covering both the global panel layout and the homepage components.

---

## 面板自适应

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
| TL + Code (全折叠) | 0 | 0 | 剩余 | — |
| 最挤：TL + Meta + Code + AI | 180 (min) | 320 (min) | 剩余 | 300 (min) |
| Shell 模式且 AI 开启：TL + SH + AI | 240 | 剩余 | — | 360 |

> [!NOTE]
> **视图切换与 AI Copilot 联动规则**：顶部 Segmented control (视图切换) 仅控制 Code 与 Shell 面板的显隐，不影响 AI Copilot 的开关状态。用户在切换视图时，AI Copilot 的开启/关闭状态会得以保留。

### **上下布局：**

| Panel | 默认高度 | 最小高度 | 最大高度 | 初始状态 | 压缩行为 |
| --- | --- | --- | --- | --- | --- |
| Shell Preview | 50% | 240px | 容器高度 - 301px | On | 高度可拖拽调整 |
| Code Panel | 50% | 240px | 容器高度 - 181px | On | 高度可拖拽调整 |

---

## Home page

Homepage 的自适应设计主要规范 Dashboard 卡片和 Event 卡片在不同尺寸下的布局与交互细节。

### **Dashboard 卡片自适应规则**

1. **多栏网格响应式布局**
   - Dashboard 卡片容器根据其可用宽度切换网格列数：
     - **宽度 $\ge 1200\text{px}$**: 4 列网格布局
     - **$900\text{px} \le 宽度 < 1200\text{px}$**: 3 列网格布局
     - **$600\text{px} \le 宽度 < 900\text{px}$**: 2 列网格布局
     - **宽度 $< 600\text{px}$**: 单列垂直堆叠布局

2. **操作按钮收纳规则**
   - **卡片宽度 $\ge 280\text{px}$**: 保留展示所有独立的操作图标按钮 (例如：刷新、设置、全屏，最多展示 3 个)。
   - **卡片宽度 $< 280\text{px}$**: 所有的图标操作按钮（Icon Buttons）自动收纳合并为一个“更多操作” (`...`) 的下拉菜单按钮。

3. **内容排版与字号缩放**
   - 当卡片宽度缩窄至小于 `200px` 时，主数值的字号由 `28px` 缩小为 `20px`，避免数值因过大而折行或被截断。

### **Event 卡片自适应规则**

1. **布局模式切换 (横向 vs. 纵向)**
   - **卡片宽度 $\ge 480\text{px}$**: 采用左右通栏布局 (Row Mode)。左侧展示事件基本信息（标题、时间、状态标签），右侧展示操作按钮区。
   - **卡片宽度 $< 480\text{px}$**: 切换为上下堆叠布局 (Column Mode)。状态标签与时间另起一行，操作按钮区移至底部，并占据整行宽度。

2. **操作按钮收纳规则**
   - **卡片宽度 $\ge 360\text{px}$**: 正常展示所有独立的操作按钮或图标按钮（如“详情”、“处理”等）。
   - **卡片宽度 $< 360\text{px}$**:
     - 所有的图标按钮（Icon Buttons）自动合并收纳为一个“...” (更多) 的操作菜单按钮。
     - 若包含文字按钮，则仅保留一个优先级最高的主操作按钮，其余次要操作均收纳至“更多”菜单中。
