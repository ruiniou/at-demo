## 任务：Shell Preview - Listing Column Header 展示 Variable Mapping（试验版）

### 背景
Listing类型的Shell preview中，在每个column header的上方或下方，直接展示该column对应的
dataset-variable mapping信息，作为hover方案的备用试验方案，用于评估直接展示的可读性和效果。

### 展示内容
- 格式：`dataset.variable`（例：`ADSL.USUBJID`）
- 若该column配置了rule，追加显示rule内容，格式：`dataset.variable | rule: {rule内容}`
- 若该column未匹配到variable，不展示该项（留空，不显示占位符或警告）
- 不展示output variable name

### 展示位置
- 每个column header下方，作为一行小字附加信息
- 字号/样式需明显小于/弱于column header本身，避免喧宾夺主

### 数据来源
- Metadata面板当前保存的值（非Code解析结果）

### 范围限制
- 仅Listing类型生效，Table类型不在本次范围内（Table仍走hover方案）
- 仅试验性质，用于效果评估，非最终交互方案，命名/结构上请勿与正式Shell规则耦合过深，
  方便后续可以整体移除或替换为hover方案

### 交互属性
- 纯静态展示，无点击/hover交互，无状态变更

## 任务：Shell Preview - Listing Column Header 展示规范更新（迭代版）

### 背景
上一版Listing column header直接展示variable mapping的试验方案，存在两个问题需要修正：
1. Rule内容过长时自由换行，导致同一行内不同column的header高度不一致，视觉参差
2. 未匹配到variable的column完全不展示信息，导致该column的header高度低于其他列，同样造成对齐问题

### 展示结构（更新）
每个column header下方固定为三行结构，各行独立：

- Line 1：Column Header（原有样式不变，加粗）
- Line 2：dataset.variable（灰色小字）
- Line 3：rule: {内容}（灰色小字，仅当该column配置了rule时显示文字，否则该行留空占位）

### Rule超长处理（新增规则）
- Line 3最多显示2行文字
- 超过2行的内容，第2行末尾截断并显示省略号（...）
- 点击Line 3区域（无论是否截断），展开该column对应的Metadata面板，查看完整rule内容
- 不使用hover展开（与本Listing方案整体不使用hover的原则保持一致）

### 未匹配列对齐处理（新增规则）
- 若column未匹配到variable：
  - Line 2、Line 3依然保留（占位），但不显示任何文字
  - 该column的header整体高度需与同一行内其他已匹配column保持一致
- 目的：避免因内容有无导致同一行内header高度参差

### 展示位置与样式（不变）
- Line 2/Line 3字号、颜色需明显弱于Line 1（Column Header），避免喧宾夺主
- 三行整体靠左对齐

### 范围限制（不变）
- 仅Listing类型生效，Table类型不在本次范围内
- 仍为试验性质，用于效果评估，命名/结构上避免与正式Shell规则耦合过深，方便后续整体移除或替换为hover方案

### 交互属性（更新）
- Line 1：无交互变化
- Line 2：纯静态展示，无交互
- Line 3：可点击，点击后展开对应Metadata面板；无其他状态变更

## 任务：Listing Column宽度规则（更新）

- Column宽度 = max(数据内容最小宽度, metadata内容宽度)，上限封顶240px
- 不区分是否开启水平滚动，统一按此规则执行
- 超过240px时：Line 3 (rule) 维持已定规则——最多2行，超出截断+省略号，点击展开Metadata面板
- 目的：保护数据列（主内容）布局不被metadata（辅助信息）挤压