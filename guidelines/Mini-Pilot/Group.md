# Group View 改版 Proposal

---

## ① 问题背景

现有 Group View 采用"Table View / Group View"左右分栏对照的形式：左侧为 Table Code，右侧为完整的 Local Setup SAS Code，中间详情区还包含 Basic Info / Format Values / Macro / Group Code 四个 Tab。

随着产品方向调整：

- **Local Setup Code 计划整体移除**（不再需要与 Table Code 并排对照）
- **详情内容收窄为仅 Group Code 一项**（Basic Info / Format Values / Macro 三个 Tab 不再保留）
- **Dataset / Variable / Format 附加信息行不再展示**

Group View 实际承载的信息量已经大幅减少，仅剩 **Group Code 代码本体 + Used in 引用关系**。若继续沿用与 T/L/F 主工作区（Treelist / Shell Preview / Code / AI）平级对照的重形态，会造成"入口权重与内容体量不对等"的问题——用户切换过去后，看到的只是一小段代码和一个引用列表，与主工作区的复杂度完全不成比例。

同时，Group Code 存在一类特殊情况：系统按规则提取 `%m_u_popn(...)` 与其对应的 `proc format` 定义组合生成 Group Code，若未能找到匹配的 Format 定义，仍保留该条记录，并需标记为"Format 未找到"，目前的展示形态没有承载这类状态的位置。

因此需要重新设计 Group Code 的入口形式与内容结构，使其与实际信息量匹配，同时保留"用户需要主动查看才能看到全貌"这一已确认的使用心智（Group Code 是跨 Table、跨 Section、Event/Study 维度的汇总视角，非某个 Table 的附属信息）。

---

## ② 主要改进点

| 维度 | 现状 | 改版后 |
|---|---|---|
| 入口形式 | Table View / Group View 顶部左右并列切换 | 右上角独立 Icon Button（与 Shell/Code 切换、Download 同排，视觉权重弱于主切换） |
| 展示形态 | 左右分栏对照（Table Code vs Local Setup Code） | 单栏浮层面板，样式复用 Metadata Panel（无左侧导航树） |
| 详情内容 | Basic Info / Format Values / Macro / Group Code 四个 Tab | 仅保留 Group Code，去 Tab 化，直接展示 |
| 附加字段 | 展示 Dataset / Variable / Format 行 | 移除 |
| Local Setup Code | 完整展示 localsetup.sas 全部内容 | 整体移除 |
| 同名 Group Code 处理 | 无区分机制 | 下拉选择器，选项附带区分参数（如 trtfmtC 取值），避免重名条目无法辨识 |
| Used in 展示 | 单条文本 | 竖排列表，超过 3 条折叠为"N More..."，点击展开 |
| 异常状态（Format 未找到） | 无对应展示 | 面板顶部 Warning Banner 提示，说明代码按原样提取展示 |
| 引用次数 | — | 不展示（明确不需要） |

---

## ③ 设计方案

### Happy Path

1. 用户在任意 T/L/F 页面，点击右上角 Group View Icon Button
2. 系统以 Metadata Panel 样式打开浮层面板（无左侧导航），面板内容对应当前上下文关联的 Group Code
3. 面板顶部为 Group Code 下拉选择器：若当前 Table 关联多条 Group Code（或存在同 gmacro 名称但参数不同的多条记录），可在此切换查看，默认选中与当前上下文最相关的一条
4. 面板依次展示：
   - Used in（引用该 Group Code 的 Table/Listing/Figure 列表）
   - Code Preview（Group Code 代码本体，proc format 片段 + %m_u_popn 片段组合展示）
5. 点击面板外部或关闭按钮，面板收起，主工作区状态不受影响

### 规则边界

- **只读**：面板内不提供任何编辑入口，Group Code 的修改仍需回到生成它的 Table Code 中进行
- **同名处理**：gmacro 名称相同、但参数或 Format 定义不同的记录，作为独立选项分别列出，不做合并；下拉选项中附带区分性字段，帮助用户辨识具体是哪一条
- **Used in 折叠规则**：默认展示前 3 条，超出部分折叠为"N More..."，点击后展开全部，不做分页
- **面板与主工作区解耦**：打开/关闭面板不改变 Treelist 选中状态、不改变 Shell/Code 视图状态，关闭后直接回到打开前的界面

### 失败场景

| 场景 | 处理方式 |
|---|---|
| 对应 Group Code 未找到匹配的 Format 定义 | 面板顶部展示 Warning Banner："Format Not Found"，说明代码按提取结果原样展示，不做遮挡或阻断 |
| 当前 Table 无关联 Group Code | Icon Button 保持可点击但面板内展示空状态提示（无 Group Code 关联），不隐藏入口本身，避免用户误以为功能缺失 |
| Used in 列表为空（理论边界） | 展示"暂无引用"提示，不展示折叠控件 |

### 安心感文案

- Format 未找到提示："No matching `proc format` definition was found for this Group Code. The macro call is shown as extracted." —— 明确说明"是什么状态、系统做了什么"，不做模糊表述，不使用告警式或指责性语言
- 空状态提示遵循"说明现状 + 不需要用户额外操作"的语气，不引导用户去"修复"（面板本身只读，不承担修复引导职责）

---

## ④ MVP 范围说明

**包含：**
- 右上角 Group View Icon Button 入口
- Metadata Panel 样式的单栏浮层展示（无左侧导航树）
- Group Code 下拉选择器（含同名记录的区分展示）
- Used in 竖排列表 + 展开更多
- Code Preview 代码展示
- Format Not Found 顶部 Banner 状态

**不包含：**
- Local Setup Code 展示（已整体移除）
- Basic Info / Format Values / Macro 等 Tab
- Dataset / Variable / Format 附加字段行
- 引用次数展示
- 任何编辑能力（新增、修改 Group Code）
- 跨 Group Code 的并排对比查看
- 与 Treelist 的层级集成（Group 不挂载到 Treelist 任何一级）

---

## ⑥ 附录

- Group Code 提取规则（原始 Jira 记录）：系统识别有效的 `%m_u_popn(...)` 调用，提取从宏调用开始到结束 `);` 的完整代码片段，读取其中 `trtfmtC` 参数指定的 Format Name，并在同一段代码中查找对应的 `proc format` 定义，两者组合形成一条 Group Code；提取时排除已注释的宏调用，对仅存在缩进/换行/空格差异的相同 Group Code 去重，参数值或 Format 定义不同的记录保留为独立条目；重复记录合并来源信息并展示引用次数（注：本次改版决定不在 UI 中展示引用次数）；若未找到对应 Format 定义，仍保留该 Group Code，标记为"Format 未找到"。
- 交互 Demo 参考：`group-view-drawer-demo.html`（注：Demo 为 Drawer 侧滑形态探索版本，本次 Proposal 确认改用 Metadata Panel 样式呈现，后续需基于 Metadata Panel 组件重新出图/出 Demo）
