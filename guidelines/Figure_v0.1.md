# Figure 模块需求（当前版本 v0.1）

> 目的：记录 Demo 中新增 Figure 板块的当前设计决策，供团队对齐与后续追加设计使用。
> 范围：本版本仅覆盖「Tree list 中新增 Figure 节点 + Shell Preview 展示 KM Plot + Code 区展示 Figure SAS Code + 左右布局」这一最小改动。

---

## 1. 改动背景

当前 Demo 中 Tree list / Shell Preview / Code 仅覆盖 Table / Listing 类型，尚未体现 Figure（数据可视化）类型的呈现方式。本次先补齐 Figure 在现有工作台结构下的最小可见形态，作为后续 Forest Plot / Swimmer Plot 设计的基础范例。

---

## 2. 本次改动点

| 区域 | 当前改动 | 说明 |
|---|---|---|
| Tree list | 新增一个 Figure 文件节点 | Icon 使用 `Figure.svg`，与 Table/Listing 图标做区分 |
| Shell Preview | 展示一个 KM Plot（Kaplan-Meier 生存曲线） | 作为 Figure 类型的示例内容 |
| Code 区 | 展示 Figure 相关的 SAS Code | 遵循既定规则：**Figure 不使用 P code**（P code 概念仅存在于 Table） |
| 整体视图 | Shell Preview 与 Code 采用**左右布局** | 区别于 Listing 的上下布局（Preview 在上、Code 在下） |

---

## 3. 沿用的既有规则（不在本次改动范围，仅作依据说明）

- **Shell 是固定输入模板**，只有 Preview（渲染结果）随代码变化，Shell 本身不变。
- **Figure 不使用 P code**：T/F/L 分类在生成阶段已完成，Tree list 中 Figure 节点无需额外的"待归类"聚合视图。
- Metadata 面板的 Confirm / 三态规则（default / pending-update / read-only）是否适用于 Figure，尚未在本次改动中验证（见第 5 节 TBD）。

---

## 4. 未覆盖范围（Out of scope，本版本不做）

- Forest Plot、Swimmer Plot 的 Shell Preview 呈现（后续单独设计）
- Figure 的 Metadata 面板具体字段
- Figure 的 AI/Copilot 交互（需求分析驱动 Template/Macro 代码生成，即 Path B 方向）尚未纳入
- Group View 对 Figure 是否适用

---

## 5. TBD 待确认事项

| 待确认问题 | 当前假设 | Owner | 状态 |
|---|---|---|---|
| Figure 的 Metadata 面板是否复用 Table 的浮层卡片规则（悬浮锚定在 Shell Preview 内容区） | 暂沿用 Table 规则 | PM / Design Lead | 🟡 可后续跟进 |
| 同一父级下若有多个 Figure 类型（KM / Forest / Swimmer），Tree list icon 是否需要二级区分，还是统一用 Figure.svg | 统一用 Figure.svg，不做二级区分 | Design Lead | 🟡 可后续跟进 |
| Figure 是否需要 Shell-only / Code-only 的视图切换模式（类比 Listing 的待解决问题） | 暂不需要，默认左右布局 | PM | 🟡 可后续跟进 |
| Figure 是否有 Group / 汇总视图（类比 Table Code 合并后 Group 为只读汇总） | 暂不涉及 Group 概念 | PM | 🔴 需在 Forest/Swimmer 设计前确认 |

---

## 6. 附录

- 关联决策：Table 模块「Group Code 合并入 Table Code」「Confirm 与 pending-update 独立维度」等规则见既有 Metadata 面板文档。
- 关联待解决问题：Figure 设计挑战清单（Metadata 完整性问题、Copilot 精确报错定位、生成前输入窗口、Copilot 对话与 Preview 刷新的异步间隙、Swimmer Plot 跨页结构不完整性）——本次改动不涉及，仅作后续设计的背景提示。
