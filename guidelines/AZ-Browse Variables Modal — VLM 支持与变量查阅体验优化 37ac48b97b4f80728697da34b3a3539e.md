# AZ-Browse Variables Modal — VLM 支持与变量查阅体验优化

分类: 周任务, 日任务
日期: 2026/06/09

# 问题背景

统计程序员在核查 Block 的 Variable 配置时，当前面板存在两个核心问题：

- 变量查阅体验差-Variable 字段采用下拉，滚动区域有限，无法快速查阅
- VLM 变量无查阅入口-部分特殊变量（如 PARAM、AVAL）的含义依赖条件逻辑——同一变量在不同 PARAM 取值下，AVAL 的计算逻辑完全不同。这类信息来自 VLM sheet，目前系统内没有任何入口呈现，Programmer 只能线下查阅 SAP 文档，无法在工具内完成完整的决策闭环。

# 主要改进点

| 维度 | 改造前 | 改造后 |
| --- | --- | --- |
| 变量 Spec 查阅 | 点击下拉逐个展开，信息碎片化 | Browse Modal 表格集中展示，支持搜索 |
| VLM 变量信息 | 系统内无入口，线下查 SAP | Modal 内 VLM tab 集中呈现条件逻辑 |
| 变量选择操作 | 下拉框内操作，查阅与选择混在一起 | Modal 内查阅与选择分离，操作路径清晰 |
| 多变量管理 | 无已选变量全局视图 | 已选 bar 固定展示，跨 tab 状态同步 |

## 设计方案

查阅 + 决策 + 选择完整流程

```
1.	Programmer 点击 Variable 字段，展开 Inline 搜索（快速替换路径）
2.	若需要深度查阅，点击列表底部”Browse All Variables”，打开 Modal
3.	Modal 默认进入 All Variables tab，已选变量高亮显示在已选 bar
4.	搜索或滚动定位目标变量，点击行内 VLM ↗ 标签跳转 VLM tab 查看条件逻辑
5.	返回 All Variables tab，勾选目标变量（支持多选）
6.	点击 Confirm 写回 Block 的 Variable 字段
```

## Incline Option List

每行显示Variable name+label。比如AESIFL；Age at Enrollment Flag
Input field已选变量，也可以点标签叉号取消选择。

### Modal 整体结构

```jsx
┌─────────────────────────────────────────────────────┐
│  Browse Variables                              [×]  │
│                                                     │
│  [Search...]              [All Variables] [VLM]    │
│  ─────────────────────────────────────────────────  │
│  Selected：AESIFL ×  ATOXGR ×  AVAL ×                  │
│  ─────────────────────────────────────────────────  │
│  [Variable Table]                                   │
│                                                     │
│                        [Cancel]  [Confirm (3)]      │
└─────────────────────────────────────────────────────┘
```

**已选 bar**：固定在搜索栏下方，以 tag 形式展示已选变量，点击 × 可直接取消选择。跨 tab 状态实时同步。

**Confirm 按钮**：括号内显示当前已选数量。

**All Variables Tab**

支持查看和选择，列结构：

| 列 | 说明 |
| --- | --- |
| ☑（checkbox） | 选中即加入已选 bar |
| Dataset Name | 变量所属 ADaM dataset |
| Variable | 变量名，VLM 变量右侧附 `VLM ↗` 标签 |
| Label | 变量中文/英文描述 |
| Type / Length | ODM 类型与长度 |
| Display Format | 显示格式 |
| Derivation | 计算逻辑，默认两行截断，点击展开 |

**VLM ↗ 标签**：点击后直接跳转 VLM tab 并自动定位到该变量相关行，查完后返回 All Variables tab 继续操作。

**VLM Tab**

定位：纯查阅，不支持选择。

VLM 的行单位是”PARAM 取值 × AVAL 逻辑”的组合，与 Variable 粒度不一致，在此 tab 引入选择操作会造成重复选中状态的歧义。选择统一在 All Variables tab 完成。

列结构：

| 列 | 说明 |
| --- | --- |
| Dataset Name | 变量所属 dataset |
| Parameter Name | PARAM 的具体取值 |
| Where Clause | 触发条件 |
| Variable Name | 对应变量（如 AVAL） |
| Type / Length | 类型与长度 |
| Display Format | 显示格式 |
| Derivation | 该条件下的计算逻辑，默认两行截断，点击展开全文 |

**Top 3 失败场景**

| 场景 | 触发条件 | 处理方式 |
| --- | --- | --- |
| 目标变量在 All Variables 中不存在 | 该 study 未 derive 该变量 | 搜索无结果时提示”当前 study 中未找到该变量，请确认 ADaM dataset 是否已包含” |
| VLM tab 内容为空 | 当前 study 无 VLM 定义 | Tab 显示空态文案”当前 study 暂无 VLM 变量定义” |

## TBD 待确认事项

| 事项 | 当前假设 | Owner | 状态 |
| --- | --- | --- | --- |
| Variable 平铺展示中的 AI 选择原因字段 | 有则展示，无则不占位 | PM | 🟡 可评审后跟进 |
| All Variables 表格的数据来源 | 来自当前 study 已 derive 的 ADaM dataset | PM / 研发 | 🔴 评审前确认 |
| Block 是否有 Variable 数量上限 | 暂无限制 | 研发 | 🟡 可评审后跟进 |
| VLM tab 是否需要支持按 Dataset 筛选 | 暂不支持 | PM | 🟡 可评审后跟进 |
| Inline 搜索候选项的排序规则（已选优先？） | 已选变量置顶 | PM / 研发 | 🟡 可评审后跟进 |

## 附录

VLM 数据示例（ADEXSUM dataset）

| Parameter Name | Variable Name | Derivation（节选） |
| --- | --- | --- |
| Duration of Exposure (Months) | AVAL | Total exposure (months) = (min(last dose date + 20, date of death, date of DCO) – first dose date + 1) / (365.25/12) |
| Actual Duration of Exposure (Months) | AVAL | Actual exposure = total exposure – total duration of dose interruptions… Ref SAP 4.7.1.1 |