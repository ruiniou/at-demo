# Create Event — Use Existing 逻辑与交互规范

## 1. 问题背景

Create Event 表单中，ADaM Spec、SDTM、SAP 均为高频复用的必填文件字段。本次优化让 Use Existing 能力扩展至这三个核心字段，并与其所属 Study Code 的选择状态建立严密的状态机联动，避免新建 Study 时出现无数据可选或脏数据问题。

Shell file 每次基本为新文件，保持纯 Upload；TiFo、Custom JSON 暂不纳入。

## 2. Project Code / Study Code 与 Use Existing 的逻辑关系

**数据层级：** Project（1）→ Study（1或多）→ Event（1或多）。

**Study Code 状态联动：**

| Study Code 状态 | Use Existing 可用性 | 说明 |
|---|---|---|
| 未选择 (`UNSELECTED`) | 禁用（disabled，不可点击） | 无 Study 上下文，无历史数据源 |
| 选择「新建 Study Code」(`NEW`) | 禁用（disabled） | 该 Study 下尚无历史 Event |
| 选择「已有 Study Code」(`EXISTING`) | 启用 | 可从该 Study 下的历史 Event 中选择复用 |

**关键约束：**
- Use Existing 的候选范围**固定为当前选中 Study 下的历史 Event，不跨 Study**。
- Project Code 的选择**不影响** Use Existing 可用性。
- 若用户在已选定复用文件后，将 Study Code 切换为「新建」或清空，该字段自动清空并切回 Upload 待上传态。

## 3. 字段双存储状态机与交互规则

每个开放字段维护独立的数据模型：
```ts
Field = {
  mode: 'upload' | 'existing',
  uploadFile: null | File,
  linkedEvent: null | Event
}
```

### 3.1 切换 Mode（点击右上角 Segmented Toggle）
- **仅切换视图**：纯粹在 `Upload` 和 `Use Existing` 视图间切换，**不会清除**另一侧已有的 `uploadFile` 或 `linkedEvent`。

### 3.2 点击 Existing Tab 时的展开/展示规则
- `if linkedEvent == null` → 立即自动展开下拉选择器（`EXISTING_PICKING`）。
- `if linkedEvent != null` → 显示已复用态（`EXISTING_LINKED`），**不自动展开**。卡片展示链接图标 + 文件名 + 完成对勾 + 替换按钮；点击替换（`×`）才清除当前复用并重新展开下拉选择器。

### 3.3 点击 Upload Tab 时的展示规则
- `if uploadFile == null` → 显示空上传态（虚线框 + Upload 按钮）。
- `if uploadFile != null` → 显示已上传态（实线框 + 文件名 + 完成对勾 + 移除按钮）。

### 3.4 覆盖触发（仅实际完成新选择动作时清除另一侧）
- **完成一次新上传**（Upload 100% 完成）→ `uploadFile = 新文件`；`linkedEvent = null`（自动清空另一侧）。
- **在选择器中选中一个新 Event** → `linkedEvent = 选中Event`；`uploadFile = null`（自动清空另一侧）。

## 4. 下拉菜单与 UI 视觉规范

1. **开放字段：** ADaM Spec、SDTM、SAP（必填）。
2. **下拉列表内容与样式：**
   - **首项高亮：** 第一项固定为最近一次上传过的 Event，佩戴「Last Used」Tag（规范参考 Listing 冻结列 Tag：底色 `bg-az-secondary` `#F4E8EE`，文字 `text-brand-1` `#830051`，字号 12px，无叉号）。
   - **历史项列表：** 其余项按更新时间倒序排列，每项呈现两行（第一行 Event Name，第二行 File Name）。
   - **搜索与高度：** 顶部配备实时搜索框按 Event/File Name 过滤；列表区域最大高度 `max-h-[220px]`，超长开启垂直滚动。
   - **空状态：** 无历史记录或搜索无结果时显示 `No results found.`。
3. **已选定卡片（`EXISTING_LINKED`）：**
   - 呈现：链接图标 + 文件名 + 完成对勾 + 右侧替换/清除按钮（不再重复渲染 Study 标签）。

## 附：状态定义参考（供实现对照）

```
Field state: UPLOAD_EMPTY | UPLOAD_FILLED | EXISTING_PICKING | EXISTING_LINKED
Study state: UNSELECTED | NEW | EXISTING

Rule: UseExisting toggle enabled  ⟺  Study state == EXISTING
Rule: Study state changes away from EXISTING while Field state == EXISTING_LINKED
      → Field state resets to UPLOAD_EMPTY
```
