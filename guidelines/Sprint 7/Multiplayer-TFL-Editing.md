# TFL 多人编辑：页面占用与接手规则

适用范围：Event 详情页下每一个 TFL 的页面状态、Tree List 呈现、工具栏 Assignee 区域。
更新日期：2026-09-24

---

## 名词定义

| 名词 | 定义 |
|---|---|
| Output Assignee | 当前 TFL 的负责人（业务归属，见 PERM-12/13） |
| TFL Page Occupant | 当前正在该 TFL 页面上的用户（技术锁，非业务角色） |
| 占用态 | Assignee 正在该 TFL 页面，系统存在有效页面占用 |
| 离开态 | Assignee 已离开该 TFL 页面，无有效页面占用 |
| Unassigned | 该 TFL 没有 Assignee |
| Take over | Team Member 接手：将自己设为 Assignee，并建立页面占用 |

---

## 核心状态矩阵

| 用户身份 | TFL Assignee 状态 | 页面占用状态 | 页面状态 |
|---|---|---|---|
| 当前用户 = Assignee | 自己 | 占用态（自己） | 独占编辑 |
| Event Team Member | 他人 | 占用态（他人） | 锁定只读 |
| Event Team Member | 他人 | 离开态（无占用） | 可接手只读 |
| Event Team Member | Unassigned | — | 全员只读（不可编辑，不显示 Take over） |
| 非 Team Member | 任意 | 任意 | 纯查看只读 |

Unassigned 状态下，所有人包括 Team Member 均不可编辑，也不显示 Take over。

---

## Tree List — Status Icon 位置

该位置同时承载「任务状态」和「编辑中头像」两类信息，两者互斥显示：

| 条件 | 该位置显示 |
|---|---|
| 有人正在占用编辑（Page Occupant 存在） | 占用者头像，使用 `menu` 层级（20px） |
| 无人占用 | 原有 Status Icon（Pending / Error / AI Processing 等） |

头像规则：
- 使用 `menu` 尺寸（20px），从 `AVATAR_IDENTITIES` 读取颜色与缩写
- Hover 显示 Tooltip：`"[Name] is editing"`
- 头像本身纯展示，不承载点击行为（见 avatar.md 规则：头像本身不承担按钮行为）

---

## 工具栏右上角 — Assignee 区域

位置：工具栏最左侧，其余工具按钮的左侧。

### 视觉状态

| 状态 | 视觉表现 | 尺寸 |
|---|---|---|
| 占用态（他人 Assignee 正在页面） | 头像正常 opacity，可点击查看只读信息 | `page` 层级（24px） |
| 离开态（他人 Assignee 已离开页面） | 头像 50% opacity（disabled 规则，见 avatar.md） | `page` 层级（24px） |
| 当前用户 = Assignee，正在占用 | 头像正常 opacity，无交互，纯展示 | `page` 层级（24px） |
| Unassigned | 空头像图形 + "No Assignee" 文字（见 Event-Team-Member.md P1 规则） | `page` 层级（24px） |

### 点击行为

**占用态（他人 Assignee 正在页面）**：
- 点击头像展开 Popover，显示只读信息：
  - 占用者头像 + 全名（`menu` 尺寸）
  - 上次编辑时间（如 "2 min ago"）
- 无任何操作按钮，纯信息展示

**离开态（他人 Assignee 已离开页面）**：
- 点击头像展开 Popover，显示：
  - Assignee 头像 + 全名（`menu` 尺寸）
  - 上次编辑时间（如 "1 min ago"）
  - Take over 按钮（Danger 样式，使用 `status-error` 文字和图标色）
- 用户点击 Take over 后：
  1. 一步完成：确认无占用 → 变更 Assignee → 建立当前用户页面占用
  2. 成功后 Popover 关闭，页面直接切换为独占编辑态
  3. 所有联动位置同步更新（见下方「Take over 成功后联动」）

**当前用户 = Assignee，正在占用**：
- 头像无交互，不可点击，纯展示

**Unassigned**：
- 无点击行为

### Take over 成功后联动更新

| 位置 | 更新内容 |
|---|---|
| 工具栏 Assignee 区域 | 头像更新为当前用户，opacity 恢复正常 |
| Tree List 对应 TFL 行 | Status Icon 位置更新为当前用户头像 |
| Assignment 面板 Assignee 字段 | 姓名更新为当前用户 |
| 页面工具栏其余按钮 | 解锁为可编辑态 |

两人同时点击 Take over：服务端只有一人成功；另一人请求失败，前端刷新最新 Assignee 信息，保持只读。

---

## Take over Popover — 内容规格

参照设计参考图（离开态）：

```
[ 头像（20px） ]  [ Full Name     ]
                  [ N min ago     ]
[ ──────────────────────────────── ]
[ lock icon  Take over             ]  ← Danger 样式，status-error 色
```

样式规则：
- Popover 外框：8px radius，4px padding（见 dropdown.md 基准）
- Take over 按钮：MenuItem 语义，Danger 状态（`status-error` 文字和图标，hover 使用 `status-error-bg`）
- 上次编辑时间使用 `text-secondary` 色，相对时间格式（"N min ago" / "N hours ago"）

---

## 页面状态对应的写操作权限

| 页面状态 | Metadata 编辑 | Code 编辑/保存/Rollback | Copilot 对话/加 Session | Listing Preview Flag |
|---|---|---|---|---|
| 独占编辑（自己是 Assignee + 占用） | 可 | 可 | 可 | 可 |
| 锁定只读（他人占用） | 不可 | 不可 | 不可 | 不可 |
| 可接手只读（无占用，他人 Assignee） | 不可 | 不可 | 不可 | 不可 |
| Unassigned 只读 | 不可 | 不可 | 不可 | 不可 |
| 纯查看（非 Team Member） | 不可 | 不可（Copilot 区域隐藏） | 不可 | 不可 |

---

## Do / Don't

Do:
- 占用态头像与 Status Icon 互斥：有头像时彻底替换 Status Icon，不叠加显示
- Take over Popover 仅在离开态下包含 Take over 按钮；占用态 Popover 纯信息展示
- 当前用户自己是 Assignee 时，工具栏头像纯展示，无点击态
- Unassigned 时工具栏显示空头像 + "No Assignee"，不显示 Take over 入口

Don't:
- 不在占用态 Popover 中显示 Take over 按钮
- 不在 Unassigned 状态下允许任何 Team Member 直接写入
- 不对 Assignee 头像的颜色赋予权限或状态语义（颜色仅为身份识别）
- 不使用 Emoji 或角色图标替代头像

---

## 关联文档

- `guidelines/Sprint 7/Event-Team-Member.md` — Team Member 增删、分配规则、Unassigned 空状态
- `guidelines/Sprint 7/权限管理总览.md` — PERM-12 自助接手，PERM-13 编辑保存权限
- `guidelines/ui-standards/avatar.md` — 头像尺寸、disabled 样式、No Assignee 状态
- `guidelines/ui-standards/dropdown.md` — Popover 外框、MenuItem Danger 样式
