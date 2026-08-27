# UX Review

关联里程: AZ-2.0 (https://app.notion.com/p/AZ-2-0-37dc48b97b4f8067a44cf1dc3648de08?pvs=21)
分类: 会议
完成: 进行中
日期: 2026/08/26
相关项目: AZ-Atlas (https://app.notion.com/p/AZ-Atlas-352c48b97b4f806988acd17bc1319bcd?pvs=21)

## Metadata-Source dataset&Variable

## 背景

Source Dataset(s)和Source Variable(s)当前是两个互相独立维护的字段，缺乏依赖规则，导致用户想选一个当前Dataset范围外的Variable时，必须先退出去修改Dataset字段，产生额外往返成本。

#### 主要改进点

| 项目 | 现状 | 改进后 |
| --- | --- | --- |
| Source Dataset(s) / Variable(s)关系 | 两个字段互相独立，无联动规则 | 建立"非对称联动"规则（见下） |
| Standard（ADaM/SDTM）与Dataset的关系 | 未明确 | 确认为同一维度的上下级关系，非独立筛选轴 |

#### 设计方案

**核心依赖规则（Dataset ↔ Variable，非对称联动）：**

- Source Dataset(s)独立可编辑，允许"已声明Dataset但0个Variable被选中"的合法状态（如AI预选后用户手动清空）。
- 快速选择入口（下拉）：当Source Dataset(s)非空时，**硬过滤**——只展示这些Dataset下的Variable，不提供越界选项；范围提示以"当前范围：In [Dataset列表]"的文案呈现。Dataset(s)为空时开放全部。
- 完整浏览入口（Modal）：默认按Source Dataset(s)预设过滤（沿用已定的Standard推导规则：Dataset(s)为空→默认"All"；全部同属一个Standard→默认落在该Standard；混合→默认"All"），但**允许越级选择**。用户在Modal中选中过滤范围外的Variable时，触发反向填充——对应Dataset自动追加进Source Dataset(s)。
- 单向关系：Variable可以扩展Dataset(s)，但删除一个Source Dataset是否级联删除该Dataset下已选的Variable，需讨论
- 层级关系：Standard → Dataset → Variable嵌套，Dataset天然只属于一个Standard；Modal内的Dataset Filter是Standard之下的下一级收窄，不是独立筛选维度。

#### TBDs

| 待确认问题 | 当前状态 | 状态 |
| --- | --- | --- |
| Modal预设过滤器是否允许用户手动关闭 | 允许关闭 | ✅ |
| Modal内选中越界Variable后，当次过滤范围是否同步扩展 | 是，同步扩展 | ✅ |
| Modal的Dataset Filter与Standard Tab关系 | 父子关系；Dataset Filter选项直接取自Source Dataset(s)当前值，非独立维护列表 | ✅ |
| AI返回Variable无法匹配已知Dataset+Variable时的兜底规则 | 未覆盖，需后端/AI架构师另行确认 | 🔴 |
| Source Dataset(s)是否存在本方案未知的其他下游依赖 | 假设仅用于Metadata展示与Variable选择依赖 | 🟡 |