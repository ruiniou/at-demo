# Listing Column Freeze & Page Break Interaction

本规范定义了 Listing 表格在进行 **Freeze（重复列）** 与 **Page Break（分页符）** 配置时的全局交互规则、拖动联动行为以及冲突解决机制。

---

## 1. 基础定义 (Basic Definitions)

- **Freeze**：表格最左侧的连续固定列。在分页输出时，这些列会自动出现在每个分页的最左侧，并在每页中重复显示。
- **Page Break**：用于将表格的其余数据列分割到不同页面上的垂直分割线。

---

## 2. 全局交互规则 (Global Interaction Rules)

1. **最左侧连续限制**：Freeze 只能作用于表格最左侧的连续列，不能跨列选择；Page Break 右侧的列不能被设置为 Freeze。
2. **相对位置限制**：Page Break 不能插入在 Freeze 界线的左侧或与 Freeze 处于同一列位置。
3. **最小间距约束（1列间距）**：
   - Freeze 界线与第一条 Page Break 之间必须至少保持 **1 列**的间距。
   - 任意两条相邻的 Page Break 之间必须至少保持 **1 列**的间距，以防止出现没有任何数据列的空页。
4. **分页显示行为**：Freeze 将自动渲染在每个 Page Break 划分的页面最左侧。

---

## 3. 拖动联动与冲突解决 (Dragging & Conflict Resolution)

在 Freeze 界线与 Page Break 同时存在的情况下，拖动任一分割线将触发以下联动与限制逻辑：

### A. 向右拖动 Freeze 界线 (Dragging Freeze Line Right)
- **右边界阻挡**：向右拖动 Freeze 界线时，一旦其到达距离最左侧的 Page Break 仅剩 **1 列**间距的位置（即两者之间只剩 1 列）时，Freeze 分割线将**停止移动**，不可继续向右拖动，从而防止强行覆盖或推挤已有的 Page Break（不使用动态推送机制）。

### B. 向左拖动 Page Break (Dragging Page Break Left)
- **左边界阻挡**：向左拖动 Page Break 时，一旦到达距离 Freeze 界线（或左侧相邻 Page Break）仅剩 **1 列**间距的位置时，分割线将**停止移动**，不可继续向左。
- **禁止状态提示**：如果拖动鼠标指针强行进入 Freeze 区域，鼠标光标会变为**禁止样式 (`not-allowed`)**，且 Page Break 视觉辅助线会锁定在最左边界，无法跨越。

### C. 向右拖动 Page Break (Dragging Page Break Right)
- **右边界阻挡**：向右拖动 Page Break 时，一旦到达距离右侧相邻 Page Break（或表格最后一列的右边界）仅剩 **1 列**间距的位置时，分割线将**停止移动**，不可继续向右。
