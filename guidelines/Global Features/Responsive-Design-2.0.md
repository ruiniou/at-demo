# Responsive Design 2.0 — Shell 内容区补充规范

> 更新日期：2026-07-31  
> 本文档是 `Responsive-Design.md` 的增补，不替代原文档。

---

## Shell 内容区对齐规则

当 Shell Preview 处于不同视图模式时，内容区域的水平对齐行为：

| 视图类型 | Metadata 关闭 | Metadata 打开 |
|----------|-------------|-------------|
| **Table** | 内容 `mx-auto` 居中 | 内容靠左（自然定位） |
| **Listing** | 内容 `mx-auto` 居中 | 内容靠左（自然定位） |
| **Figure** | 内容 `mx-auto` 居中 (RTF 面板也关闭时) | 内容靠左 |

> [!NOTE]
> Figure 的居中条件额外受 RTF Preview 面板影响：只有当 RTF 和 Metadata 都关闭时才居中。

---

## Figure 自适应宽度

Figure 视图使用 **比例宽度** 而非固定像素：

```
w-full max-w-[90%]
```

- 内容宽度 = 容器可用宽度的 90%
- 最大宽度不设硬限制，由容器自然约束
- 居中时通过 `mx-auto` 实现水平居中
- RTF Preview 面板的 Figure 也使用 `w-full max-w-[90%] mx-auto`

这确保 Figure 在不同面板宽度下都能正常显示，不会出现内容被裁剪或溢出的问题。

---

## Metadata 面板水平滚动补偿

当 Metadata 面板打开/关闭时，Shell 内容区的可视宽度随之变化：

### 自然补偿（默认行为）

由于 Metadata 面板和滚动容器是同一 flex 父元素的 sibling：

```
<div className="flex flex-1 overflow-hidden">
  <div className="flex-1 overflow-auto scrollbar-code">  <!-- 滚动容器 -->
    ...内容...
  </div>
  <!-- Metadata panel 在这里 -->
  <div style={{ width: metadataWidth }}>...</div>
</div>
```

滚动容器的 `flex-1` 会自动缩减到排除 Metadata 宽度后的剩余空间。**内容的 `scrollWidth` 不变，只是 `clientWidth` 减小**，因此用户仍然可以滚动到所有内容。

### 滚动位置保持

当 Metadata 面板打开/关闭时，通过 `useEffect` 按比例保持水平滚动位置：

```tsx
useEffect(() => {
  const container = scrollContainerRef.current;
  if (!container) return;
  const ratio = scrollWidth > clientWidth
    ? scrollLeft / (scrollWidth - clientWidth)
    : 0;
  requestAnimationFrame(() => {
    container.scrollLeft = ratio * (scrollWidth - clientWidth);
  });
}, [metadataOpen]);
```

### 统一滚动条样式

所有 Shell 内容区的滚动容器使用 `.scrollbar-code` 类：

- 16px 容器 / 12px thumb
- 默认透明，容器 hover 时显示
- 与 Code Editor 保持一致的滚动条交互

---

## Metadata 面板内部（Blocks / Components Tab View）双栏自适应规则

在 Metadata 面板切换到 `Components` (Figure) 或 `Blocks` (Table) 视图时，面板内部采用 **左侧导航栏 + 右侧字段详情区** 的双栏响应式布局：

### 1. 双栏结构与尺寸约束

| 区域 | CSS 类 / 属性 | 默认宽度 | 最小压缩下限 | 布局与响应式行为 |
|---|---|---|---|---|
| **左侧 Block/Component 列表导航栏** | `w-[176px] shrink min-w-[90px]` | **176px** | **90px** | 展示所有组件/Block 列表（如 `KM Plot Chart`、`Number at Risk Table`），字体超长时自动 `truncate` 截断省略。 |
| **右侧字段详情区** | `flex-1 min-w-0` | 自适应 | `min-w-0` | 展示当前选中 Component / Block 的结构化字段表单（支持垂直滚动）。 |

### 2. 外部拉伸与压缩响应顺序

当用户拖拽调整 Metadata 面板宽度，或在不同视口下缩放时：

1. **拖拽放大 / 扩宽**：左侧导航栏保持标准的 **176px** 宽度，右侧字段表单区（`flex-1`）吸收所有增加的宽度，便于展示长 Rule 或数据集名称。
2. **面板压缩 / 调窄**：
   - 优先由右侧字段表单区吸收压缩空间；
   - 当 Metadata 面板被压缩至极限（`320px` 或 `280px`）时，左侧导航栏配合从 **176px 动态收缩至 90px**，防止右侧表单中的输入框与 Badge 标签溢出或错位。
3. **整体宽度保底**：`metadataMaxWidth = Math.min(constraints.metadata.max, shellPreviewWidth)`，确保 Metadata 面板绝对不超出 Shell 预览区宽度。

> [!NOTE]
> **视图模式硬约束**：
> - **Shell-Only 模式**：Metadata 面板默认 380px，最小 320px，最大 640px。
> - **Code & Shell 模式**：Metadata 面板默认 380px，最小 280px，最大 520px。

---

## AI Copilot 宽度拓宽与 TreeList 自动折叠/还原机制 (TreeList Auto-Collapse & Restore)

当用户拖拽拓宽 AI Copilot 面板或 Metadata 面板，导致中央主视图（Code 面板或 Shell Preview）的可用宽度被挤压至最小下限（`min-width`）时，系统触发防挤压阶梯式自适应压缩机制：

### 1. 面板自适应压缩顺序 (Compression Priority)

1. **第一阶（压缩 Metadata 面板）**：若 Metadata 面板开启，优先将其压缩至 `min-width`（320px / 280px）。
2. **第二阶（压缩 Shell Preview）**：若 Shell 面板开启，将其压缩至最小宽度 `320px`。
3. **第三阶（压缩 TreeList 宽度）**：若 TreeList（左侧导航树）开启，将其宽度从默认的 `240px` 逐步压缩至最小 `180px`（文字触发 `ellipsis` 省略）。
4. **第四阶（TreeList 自动折叠 `Auto-Collapse`）**：
   - 若 TreeList 已压缩至 `180px` 仍无法满足中央主视图的最小宽度要求（带 30px 防抖缓冲区 `COLLAPSE_BUFFER = 30`），**TreeList 会自动收起折叠（`treeListOpen = false`）**，并标记状态 `treeListAutoCollapsed = true`，为中央主视图腾出完整视口空间。
5. **第五阶（压缩 AI Copilot）**：若 TreeList 已折叠仍不足，AI Copilot 被动压缩至最小 `300px`。

### 2. 自动还原机制 (Auto-Expand / Restore)

- 当用户重新调窄 AI Copilot 或关闭 Metadata 面板，释放出足够的视口宽度（`availableForFlex >= flexPanelMin + treeListWidth + 1 + EXPAND_BUFFER`，含 30px 防回弹缓冲）时：
- **TreeList 自动重新展开**（`treeListOpen = true`），并重置标记 `treeListAutoCollapsed = false`。
- **手动干预规则**：若用户在自动折叠期间手动点击开启了 TreeList，系统清除 `auto-collapsed` 标记，后续尊重用户的显式手动操作。


