# Proposal：Shell Preview Metadata Hover 核查机制

## ① 问题背景

Atlas的Table/Listing/Figure在生成阶段依赖AI将Shell解析为SAS Code，其中Metadata（变量映射、Population、统计规则等）是否被AI正确理解和填写，目前用户只能通过点击打开完整Metadata面板逐项核对，缺乏"不打开面板、快速判断这里大概率对/错"的核查手段。

参考浏览器DevTools Elements面板的交互模式（hover定位 + 信息展示区域固定、不遮挡目标内容本身），收敛为统一方案：**Table与Listing均采用Hover触发展示关键Metadata**，作为AI转换结果的只读校验工具，非通用查看功能。

## ② 主要改进点

| 项目 | 内容 |
|---|---|
| Listing展示方式 | Hover触发，展示Column对应的dataset/variable/rule |
| Table展示方式 | Hover Block，展示分级关键信息 |
| Table/Listing交互一致性 | 统一为Hover模式 |
| 展示内容颗粒度 | 分优先级：P1 Key Variable Mapping / P2 Population / P3 Display-Statistic Rule，本次全部覆盖 |
| Listing列头冻结功能冲突 | 原Column Header的Hover用于触发列冻结交互，与本次新增的Metadata Hover存在冲突，需将列头冻结的触发方式改为Hover列与列之间的边界线，释放Column Header区域给Metadata Hover使用 |

## ③ 设计方案

### Happy Path

1. 用户鼠标Hover至目标对象（Listing: Column Header；Table: Block）
2. 80–100ms过渡动效后，展示Tooltip
3. Tooltip固定显示在目标对象上方（安全区域，不遮挡Block本身/Column数据）
4. Tooltip内容按P1→P2→P3优先级排列关键Metadata
5. 鼠标移出，Tooltip消失
6. 如需查看完整信息，点击目标对象打开完整Metadata面板（沿用已有机制）

### 规则边界

| 规则 | 说明 |
|---|---|
| Hover对象 | Listing: Column Header；Table: 整个Block（非Block内子元素）|
| 显示方向 | 默认对象上方；遇上方空间不足时触发碰撞检测，反向显示于下方 |
| Tooltip宽度 | 由内容中最长的单条字段值/名决定，Table与Listing统一封顶**240px** |
| 宽度超限处理 | 单条文本超过240px时换行（wrap），不做截断——Tooltip为浮层，纵向空间相对充裕 |
| 显示动效 | 80–100ms淡入过渡 |
| Table多变量Block | 单Block可能对应多个Variable Mapping（如baseline continuous-summary block中n/Mean/SD/Median等来自同一Analysis Variable的不同统计量，非不同变量映射），展示时按Primary Variable优先排列 |
| Table P1 Variable Mapping条数限制 | 单Block最多显示**4条**，Primary Variable固定排首位；超过4条时第4条位置替换为"+N more" |
| Table P3 Display Rule超长处理 | 最多显示2行，超出部分截断并显示省略号（与Listing Rule截断规则一致）|
| Tooltip整体高度 | 设最大高度上限（具体数值待验证）；若P1+P2+P3总高度超限，优先压缩P3，P1/P2保持完整不压缩 |
| Table内容优先级 | P1 Key Variable Mapping（含Primary Variable判断） / P2 Population / P3 Display-Statistic Rule，三者均在本次范围内实现 |
| Listing内容 | dataset + variable + rule（非空时显示）|
| Listing列头冻结交互调整 | 列冻结触发方式由"Hover Column Header"改为"Hover列与列之间的边界线"，避免与Metadata Hover功能区域冲突 |
| 取值来源 | Metadata面板当前保存值（非Code解析结果），Metadata↔Code为单向关系 |
| 未匹配字段 | 不展示该Hover项 |
| 交互属性 | 纯只读展示，Hover本身不产生任何状态变更，与Confirm机制无关联 |
| Shell/Runtime范围 | 本次仅覆盖Preview阶段，不涉及Runtime |

### 失败场景

| 场景 | 触发条件 | 推荐处理方式 |
|---|---|---|
| Hover内容为空/未匹配 | 该字段未匹配到任何Variable/Population/Rule | 不展示该Hover项，不显示占位符或警告 |
| Tooltip超出屏幕边界 | Block/Column位于视口边缘 | 触发碰撞检测，自动反向显示 |

## ④ MVP范围说明

**本次范围内：**
- Listing：Hover展示dataset/variable/rule
- Table：Hover展示P1（含Primary Variable）+ P2（Population）+ P3（Display/Statistic Rule）
- 统一的Hover定位、碰撞检测、动效规则
- Listing列头冻结交互方式调整（Hover触发区域由Column Header改为列边界线）

**本次范围外：**
- Runtime相关的Hover展示
- Metadata与Code不一致时的"未同步"状态提示
- Hover内的任何确认/编辑操作（保持纯只读）
- Listing平铺展示方案（不再推进）

