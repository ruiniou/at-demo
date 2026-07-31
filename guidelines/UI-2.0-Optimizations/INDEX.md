# UI 2.0 优化总览 (UI 2.0 Optimizations Index)

此文件夹专用于沉淀 2.0 版本迭代中对于 UI 细节、交互规范以及底层组件的优化规则。

## 已完成优化的组件与交互

1. **Dropdown / Select 交互优化**
   - 规则文件：[Dropdown-Interaction-Rules.md](./Dropdown-Interaction-Rules.md)
   - 重点：禁用了无意义的箭头翻转动画，统一使用触发器 (Trigger) 的 Active/Focus 状态来指示下拉展开，减少表单区的视觉噪音。

2. **滚动条优化 (Scrollbar)**
   - 规则文件：[Scrollbar-Rules.md](./Scrollbar-Rules.md)
   - 重点：沉淀了 Panel 级与组件级的滚动条颜色、尺寸、悬浮加粗逻辑，全量应用了 `color-mix` 保持和全局 Design Token 的动态一致。

3. **Shell Preview 样式与排版统一**
   - 规则文件：[Shell-Preview-Styling-Rules.md](./Shell-Preview-Styling-Rules.md) & [Shell-Typography-Unified-2.0.md](./Shell-Typography-Unified-2.0.md)
   - 重点：
     - Table/Figure/Listing 的 Title 统一使用 `t-body-medium`，外围信息统一使用 `t-small`。
     - 彻底摒弃 `table-auto`，采用绝对像素的 `table-fixed`。
     - 动态计算包裹器宽度，完美模拟 A4 排版，消除了长注脚撑爆容器引起的超大留白。

4. **Tooltip 规则**
   - 规则文件：[Tooltip-Rules.md](./Tooltip-Rules.md)
   - 重点：Tooltip 的触发与隐藏延迟，深色背景的对比度规范等。

---

## 🚧 待优化清单 (TODO)

以下是接下来需要重点优化的组件，这些问题已经被记录，后续将在本分支或未来迭代中逐一攻克：

### 1. 输入框 (Input Fields)
* **优化方向**：目前表单的 Input 交互反馈和报错状态（Error State）是否符合 2.0 的最高标准？
* **待定**：边框颜色 (Focus Ring) 与 `Dropdown` 是否完全统一？深浅色模式的适配。

### 2. 单选/多选框 (Checkbox / Radio)
* **优化方向**：Checkbox 的点击靶区（Hit Area）、悬浮反馈（Hover 时的底色或边框加深）、选中状态下的品牌色饱和度。
* **待定**：需要统一处理选中动画（微交互）。
