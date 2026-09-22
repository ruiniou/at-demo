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

### Projects & Studies / Events 列表页

以下规则适用于 Home 的两个管理列表，不改变 Event 内部 Shell / Code / Metadata / Copilot 多面板工作区，也不改变既有卡片视图规则。

- **宽度基准**：根据实际页面容器及主内容容器宽度响应，不根据操作系统或物理屏幕分辨率切换。1920px 屏幕在 Windows 125% / 150% 缩放、浏览器 100% 缩放时，通常对应约 1536 / 1280 CSS px。
- **大屏扩展**：表格铺满内容区，名称列吸收剩余宽度；Owner 列在 Events 中为 `clamp(180px, 18cqw, 260px)`，在管理页中为 `clamp(180px, 20cqw, 280px)`。字号、行内控件和图标不随窗口放大。
- **状态与操作列**：Events 状态列为 `clamp(208px, 16cqw, 224px)`，管理页状态列为 `clamp(148px, 14cqw, 180px)`，操作列固定 80px。保留状态、Owner、操作，不通过隐藏列损失信息；较长进度计数可以整体换行。
- **工具栏与边距**：搜索框以 240px 为弹性基准、最大 340px；搜索与筛选区空间不足时换行，筛选项也可换行。主内容容器宽度达到 800px 时左右边距为 28px，低于时为 16px，均复用现有 spacing Token。标题与新建按钮允许换行。
- **侧栏自动收起**：以页面容器宽度减去用户当前侧栏宽度计算空间预算，低于 880px 时自动收起（包含 800px 可读表格及页面边距等开销）。达到 944px 后恢复，64px 缓冲避免反复展开/收起。拖动侧栏过程中不触发自动收起，释放后重新评估，保留用户设置的侧栏宽度。
- **手动偏好优先**：自动收起只影响 Home 本页显示，不改写共享侧栏开关。用户手动关闭后不自动恢复；窄窗手动展开后允许保留侧栏并使用表格横向滚动，直到空间恢复宽裕才重新启用自动收起。隐藏侧栏内容不可获得键盘焦点。
- **滚动与可读性**：表格最小宽度为 800px，更窄时仅表格区域横向滚动，页面本身不横向溢出。单张语义表格共用列宽、表头纵向 sticky，避免 Windows 占位滚动条造成表头/表体错位；保留稳定滚动条槽。长名称省略并提供全文提示，TA 标签保持完整。
- **浮层与空状态**：Events 操作菜单复用 Portal Popover，滚动或改变窗口宽度后重新定位、贴近视口边缘时翻转；不被表格裁切。空状态和重置筛选入口保持在可视区内。
- **验收宽度**：1920、1536、1280、1024 CSS px，以及 800 / 640px 窄窗兜底；覆盖连续缩小→放大、侧栏手动开关与拖动、长名称/筛选值、空结果、纵横滚动与浮层。

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
