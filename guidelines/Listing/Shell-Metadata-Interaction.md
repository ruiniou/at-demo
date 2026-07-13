# Shell 表格面板 与 Metadata 面板联动交互逻辑

## 一、面板开关联动

| 触发动作 | 数据流 | 效果 |
|---------|--------|------|
| 点击 Shell 表头列名按钮 | `onBlockClick()` → App.tsx `setMetadataOpen(true)` | 打开 Metadata 面板 |
| 点击 Shell 工具栏的 Metadata 按钮 | `handleMetadataToggle()` | 切换 Metadata 面板开关 |
| 点击 Metadata 面板关闭按钮 | `onCloseMetadata()` → `setMetadataOpen(false)` | 关闭 Metadata 面板 |
| 切换 Page Preview 模式 | `handlePagePreviewToggle` → 如果 metadata 打开则先 `onCloseMetadata()` | 关闭 Metadata 面板，进入分页预览 |

---

## 二、冻结列（Repeat Column）联动

这是两个面板之间最核心的联动，涉及**双向数据流 + baseline 对比机制**。

### 2.1 Shell → Metadata（Shell 端操作冻结）

```
用户 hover 列头 → 出现 "Repeat" pill 按钮
  → 点击 pill → setFrozenUntilIndex(columnIndex)
  → Shell 表格渲染冻结列（sticky + 左偏移 + 阴影 + 冻结线）
  → frozenUntilIndex 作为 prop 传递给 MetadataPanel
  → MetadataPanel 的 "Repeat Column" 字段显示对应数值（frozenUntilIndex + 1）
```

**冻结线拖拽**：冻结边界线可拖拽（`handleFrozenBoundaryDragStart`），拖拽时实时更新 `frozenUntilIndex`。

### 2.2 Metadata → Shell（Metadata 端修改 Repeat Column）

```
用户在 MetadataPanel 修改 "Repeat Column" 数字输入框
  → setDraftFrozenUntilIndex(nextIndex)   [草稿状态]
  → 点击 "Sync to Shell" 按钮
  → onSyncToShell({ frozenUntilIndex: draftFrozenUntilIndex, ... })
  → ShellPreview 中 setFrozenUntilIndex(values.frozenUntilIndex)
  → Shell 表格立即更新冻结列
```

**直接联动**：`onRepeatColumnChange` 回调直接绑定到 `setFrozenUntilIndex`，即修改数字输入框时**立即**更新 Shell 冻结状态（无需点 Sync）。

---

## 三、分页线（Page Break Column）联动

### 3.1 Shell → Metadata

```
用户 hover 列间间隙 → 出现 col-resize 光标区域
  → 点击 → addPageBreak(columnIndex) → setPageBreakColumns([...])
  → pageBreakColumns 作为 prop 传递给 MetadataPanel
  → MetadataPanel 的 "Page Break Column" 字段显示选中状态
```

### 3.2 Metadata → Shell

```
用户在 MetadataPanel 的 "Page Break Column" 下拉中切换
  → setDraftPageBreakColumns(next)
  → 点击 "Sync to Shell"
  → onSyncToShell({ ..., pageBreakColumns: draftPageBreakColumns })
  → ShellPreview 中 setPageBreakColumns(normalizePageBreakColumns(values))
  → Shell 表格立即渲染/移除分页线
```

**直接联动**：`onPageBreakColumnsChange` 回调也直接更新 Shell 的 `pageBreakColumns`。

---

## 四、Sync to Shell 按钮

位于 MetadataPanel 底部，**仅在存在编辑（`hasAnyEdits`）时显示**：

```
点击 Sync to Shell
  → onSyncToShell({
      frozenUntilIndex: draftFrozenUntilIndex,     // 草稿冻结索引
      pageBreakColumns: draftPageBreakColumns       // 草稿分页列
    })
  → ShellPreview 更新 frozenUntilIndex + pageBreakColumns
  → 同时更新 repeatColumnBaseline
  → 向上冒泡到 App.tsx 的 onSyncToShell 回调
```

---

## 五、数据流总览图

```
┌─────────────────────────────────────────────────────────────┐
│                    ShellPreview (父组件)                      │
│                                                              │
│  State:                                                      │
│   • frozenUntilIndex     ← 冻结到第几列                       │
│   • repeatColumnBaseline ← 冻结列的基线（用于对比）             │
│   • pageBreakColumns    ← 分页线所在列                        │
│   • pageSepActive       ← 分页预览开关                        │
│   • pageColumnCounts    ← 每页列数                            │
│   • idpageBaseline / idlistBaseline ← ID基线                  │
│                                                              │
│  ┌──────────────────┐       ┌──────────────────────────┐     │
│  │  Shell 表格       │       │  MetadataPanel (子组件)   │     │
│  │                  │       │                          │     │
│  │ • 列头点击       │──────→│ 打开面板 + autoNavigate   │     │
│  │ • Repeat pill    │──────→│ frozenUntilIndex prop    │     │
│  │ • 冻结线拖拽     │──────→│ 更新 frozenUntilIndex     │     │
│  │ • 分页线点击     │──────→│ pageBreakColumns prop    │     │
│  │                  │       │                          │     │
│  │                  │←──────│ onRepeatColumnChange     │     │
│  │                  │       │  (直接更新 frozenUntil)   │     │
│  │                  │←──────│ onPageBreakColumnsChange │     │
│  │                  │       │  (直接更新 pageBreak)     │     │
│  │                  │←──────│ onSyncToShell            │     │
│  │                  │       │  (批量同步 draft → shell) │     │
│  │                  │←──────│ onRepeatColumnBaseline.. │     │
│  │                  │       │  (更新 baseline)          │     │
│  └──────────────────┘       └──────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## 六、涉及的核心文件

| 文件 | 角色 |
|------|------|
| [ShellPreview.tsx](src/app/components/ShellPreview.tsx) | 父组件，管理所有联动状态，渲染 Shell 表格 + 嵌入 MetadataPanel |
| [MetadataPanel.tsx](src/app/components/MetadataPanel.tsx) | 子组件，接收 props 展示/编辑元数据，通过回调通知父组件 |
| [App.tsx](src/app/App.tsx) | 顶层组件，控制面板开关 (`metadataOpen`) 和 `onSyncToShell` 回调 |

---

## 七、Props 传递关系（ShellPreview → MetadataPanel）

```typescript
<MetadataPanel
  onClose={onCloseMetadata}                    // 关闭面板
  isLocked={isLocked}                          // 锁定状态
  frozenUntilIndex={frozenUntilIndex}          // Shell 当前冻结列索引
  pageSepActive={pageSepActive}                // 分页预览开关
  pageColumnCounts={pageColumnCounts}          // 每页列数
  pageBreakColumns={pageBreakColumns}          // 分页线列数组
  columnCount={columns.length}                 // 总列数
  repeatColumnBaseline={repeatColumnBaseline}  // 冻结列基线
  onRepeatColumnBaselineChange={setRepeatColumnBaseline}  // 更新基线
  onRepeatColumnChange={setFrozenUntilIndex}               // 直接更新冻结列
  onPageBreakColumnsChange={(next) => {                   // 直接更新分页线
    setPageBreakColumns(normalizePageBreakColumns(next));
  }}
  idpageBaseline={idpageBaseline}              // ID page 基线
  idlistBaseline={idlistBaseline}              // ID list 基线
  onIdpageBaselineChange={setIdpageBaseline}   // 更新 ID page 基线
  onIdlistBaselineChange={setIdlistBaseline}   // 更新 ID list 基线
  onAddToChat={onAddToChat}                    // 添加到 AI Copilot
  onSyncToShell={(values) => {                // 批量同步到 Shell
    setFrozenUntilIndex(values.frozenUntilIndex);
    setPageBreakColumns(normalizePageBreakColumns(values.pageBreakColumns));
    onSyncToShell?.(values);
  }}
  autoNavigateToPending={metadataAutoNavigate}  // 自动导航到 pending 字段
/>
```
