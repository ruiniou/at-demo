# Metadata 面板 Dataset / Variable 依赖与交互规则规范 (v2.0)

## 1. 核心定位与设计原则
- **联合唯一性**：Variable 唯一性由 **`Dataset + Variable`** 联合键保证（如 `ADSL.SEX`），避免跨数据集/跨标准同名冲突。
- **Design Less To Solve Problems**：保持 Source Dataset(s) 与 Variable 两个字段独立，通过**非对称单向联动**与**高密度 GroupTag** 以最简交互解决跨数据集选词成本。

---

## 2. 依赖与联动规则（非对称联动）

| 维度 | 交互行为 | 规则说明 |
|---|---|---|
| **快速选择（Inline 下拉）** | **硬过滤** (Hard Filter) | • 当 `Source Dataset(s)` 非空时，仅展示该数据集范围内的变量，快速选词。<br>• 当 `Source Dataset(s)` 为空时，开放展示全部候选变量。<br>• 选中带跨数据集的变量时，自动触发向同 Block 的 Source Dataset(s) 增量追加。 |
| **完整浏览（Modal 弹窗）** | **软预选 + 允许越界** | • 默认按当前 `Source Dataset(s)` 预设筛选。<br>• 允许用户在 Modal 内自由切换 Standard / Dataset 勾选越界变量。<br>• 勾选越界变量时，Modal 内的 Dataset 筛选器即时自动勾选该数据集。 |
| **越界回写 (Write-back)** | **增量追加** | • 点击 Confirm 时，将新增的数据集增量追加写回父级 `Source Dataset(s)`（如已有 `ADSL`，新选了 `ADAE.AREL`，则 Dataset 自动变为 `ADSL, ADAE`）。 |
| **孤立警示 (Non-cascading)** | **非级联删除 + Warning** | • 手动删除 `Source Dataset(s)` 中的某数据集时，**不强制级联删除** Variable，而是在 Variable 字段显示 Warning 边框与提示：`N variable(s) outside dataset scope. Review or update dataset.` |
| **数据归一化 (Normalization)** | **向下兼容** | • 若传入无前缀纯变量名（如 `AGE`），组件自动结合同 Block 的 `Source Dataset(s)` 或全局变量库补全为联合键（`ADSL.AGE`）。 |

---

## 3. UI 呈现规范

### A. 复合胶囊展示（`GroupTag`）
已选变量无论在 Inline 输入框还是 Modal 顶部 Selected Bar，均按 Dataset 聚合为单个复合胶囊：
```
[ ADSL.  AAGE ✕ ,  SEX ✕ ,  ARACE ✕ ]   [ DM.  SEX ✕ ]
```
- **前缀**：浅灰色常规体（`ADSL.`）；
- **子项**：深色文字，子项间逗号分隔，每个变量带独立的 `10×10px` ✕ 关闭按钮；
- **微粒度删除**：点击单项仅删除该变量；该 Dataset 下变量全部删完后胶囊自动消解。

---

### B. Modal 布局与筛选层级（从上到下）

1. **第一行：Search Bar**（独占拉满全宽，横切搜索 Variable / Label / Dataset）；
2. **第二行：双 FilterChip 栏**：
   - **`Standard FilterChip`**：
     - 图标：`stack-line.svg`（规范层级模型）
     - 选项：`All Standards`（默认） / `ADaM only` / `SDTM only`（单选）
     - 联动：切换时重置下方 Dataset 候选池为对应 Standard 下的数据集。
   - **`Dataset FilterChip`**：
     - 图标：`database-2-line.svg`（数据库/数据集）
     - 模式：多选（带 Checkbox），文案完整拼接（如 `ADSL, ADAE...`）
     - 尺寸：`w-fit max-w-full`（未超长时紧凑贴合文字宽度，超长时占满整行剩余宽度并 `...` 截断，Hover 呈现完整 Tooltip）。
3. **第三行：Selected Bar**（条件展示：有已选变量时出现，采用 `GroupTag` 聚合排布）；
4. **第四行：Tabs**（仅当 Standard 选择 `ADaM` 时展示 `All Variables` 与 `VLM` 两个 Tab）；
5. **第五行：数据表格**（支持行 Checkbox 多选，VLM 为只读跳转/参考视图）；
6. **底栏：Modal Footer**：
   - **左下角动态提示**：当存在超出原 Dataset 范围的变量时，显示 `ⓘ +ADAE, ADLB will be added to Source Dataset(s)`；未越界时保持纯净留白；
   - **右下角操作按钮**：`Cancel` 与 `Confirm (N)`。

---

## 4. 文案与国际化标准
- **空状态**：`No Results Found`（搜索为空时提供 `Clear search` 快捷重置按钮）；
- **筛选标签**：`All Standards` / `All Datasets`；
- **回写提示**：`+Dataset1, Dataset2 will be added to Source Dataset(s)`。
