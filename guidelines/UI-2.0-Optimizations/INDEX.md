# UI 2.0 优化总览 (UI 2.0 Optimizations Index)

此文件夹专用于沉淀 2.0 版本迭代中对于 UI 细节、交互规范以及底层组件的优化规则。

## 已完成优化的组件与交互

1. **Dropdown / Select 交互优化**
   - 规则文件：[Dropdown-Interaction-Rules.md](./Dropdown-Interaction-Rules.md)
   - 重点：禁用了无意义的箭头翻转动画，统一使用触发器 (Trigger) 的 Active/Focus 状态来指示下拉展开，减少表单区的视觉噪音。

2. **滚动条优化 (Scrollbar)**
   - 规则文件：[Scrollbar-Rules.md](./Scrollbar-Rules.md)
   - 重点：沉淀了 Panel 级与组件级的滚动条颜色、尺寸、悬浮加粗逻辑，全量应用了 `color-mix` 保持和全局 Design Token 的动态一致。

3. **Shell Preview 权威规范 (Master Spec 2.0)**
   - 权威文档：[Shell-Preview-Design-Spec-2.0.md](./Shell-Preview-Design-Spec-2.0.md)
   - 重点：
     - **全局排版**：Title 统一 `13px Medium` (`Small Text/Table`)，表头 `12px Medium`，Subgroup / Listing 行 `10px Regular`。
     - **表格规范**：Table Parent 行 24px fixed（顶端 1px 灰色线），Listing 18px fixed（无内部横灰色线，完全对标 Subgroup 行）；横向 2px 黑色粗线图层压顶 (`relative z-10`)。
     - **Hover & Listing 交互**：Table 块级 Hover，Listing 3 行内联表头与分割线列冻结，Figure 按 Component 拆分 Hover 块。
     - **全局点击跳转 Metadata**：点击 Table / Listing / Figure 任意区块自动展开并直达 Metadata 面板对应的 Block / Column / Component 卡片（非仅针对 Figure）。

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
