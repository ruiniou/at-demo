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
