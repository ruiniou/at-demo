# Proposal：Event Team Member

## ① 问题背景

当前 Event 下的成员归属和 TFL 分配之间没有显式的关联对象——Owner 只是 Event 的一个属性字段，没有独立可维护的入口；Programmer 分配候选范围也没有被 Team 边界收窄。

PM 需求明确了这条产品方向：把 **Event Team Member** 做成独立可维护的实体，作为 TFL 分配候选范围的唯一来源，同时承担 Owner 变更、成员增删的操作入口，并满足合规所需的可追溯性（谁在什么时候加入/被移除/变更了什么）。

## ② 主要改进点

| 维度 | Before | After |
|---|---|---|
| Team 归属 | Owner 是 Event 的隐式属性，无独立维护页面 | Team Member 是独立列表，Owner 是其中一条被标记的成员 |
| Programmer 候选范围 | 未明确收窄 | 严格收窄为当前 Event Team Member |
| 成员增删 | 无 | 支持 Add / Remove，Remove 限 Event Owner 操作 |
| Owner 变更 | 无独立入口 | Event Owner / Study Owner / Admin 可变更，选中非成员自动加入 |
| Remove 与分配的联动 | 无 | Remove 后受影响 TFL 的 Programmer 自动清空 |
| TFL 分配 | 单独发生在 Assignment 页 | 支持单个/批量分配，且支持"添加成员+分配"一步完成 |
| 分配决策依据 | 无负载参考 | Programmer 候选旁内联展示当前 Event 下已分配 TFL 数量 |

## ③ 设计方案

### Happy Path

> 已有入口：Event 首页单条 TFL 的 Actions 中已有"分配 Members"入口（现有能力，已上线）。点击后进入的团队配置页，即本次要新设计的内容——不是新开一个入口，是给已有入口接上新的目的地。

1. Event 创建 → Event Owner 自动成为 Team Member
2. Owner 进入 Event 详情页 → 通过入口进入 Team Member 列表页（**入口在详情页的具体位置待定，当前倾向放在页面右上角**，见待确认事项）
3. **Add Team Member**：从固定用户列表选人加入
4. **单个/批量分配 TFL**：在 Assignment 页，Programmer 下拉展示当前 Team Member（旁附当前 Event 下已分配 TFL 数量）；下拉最下方设一个 **New User** 小 Session，选项文案为 **Invite and Assign**，一步完成加入+分配
5. **Change Owner**：从除当前 Owner 外的用户中选人；若选中者不在 Team Member 列表中，自动加入，弹窗内以小字批注提示
6. **Remove Team Member**：二次确认，弹窗展示受影响 TFL 数量
7. **Create Event 流程 Step 2**（原有的 Team Member 分配表单）同步复用本次的新样式和交互，不单独维护一套视觉

### 规则边界

- Owner 不能被直接 Remove（需先 Change Owner，再对前 Owner 执行 Remove）
- Remove 后，受影响 TFL 的 Programmer 字段自动清空，需重新分配
- Change Owner 的自动加入与 Remove 采用不对称设计：前者是非阻断提示（小字批注），后者是阻断式二次确认——因为一个是增益操作，一个是破坏性操作，风险等级不同，不应该用同一种交互强度处理
- 未分配状态：Programmer 为空时展示为空头像（图标由设计提供，资产交付中）+ 文案 **No Assignee**

### 失败场景 Top 3

| 场景 | 应对设计 |
|---|---|
| Remove 一个仍有大量在办 TFL 的成员 | 二次确认弹窗内明确展示受影响 TFL 数量，防止误删导致批量返工 |
| Change Owner 选中一个不在列表里的人，用户未意识到会被自动加入 | 小字批注即时提示这个副作用，不用弹窗打断（信息对称，但不制造额外操作摩擦） |
| 批量分配时选中的人还不是 Team Member | 通过"+ 添加新成员并分配"统一处理，避免"选了人但分配失败"的空结果状态 |

### 用户安抚文案策略

- Remove 确认弹窗强调**后果**而非制造犹豫感："这些 TFL 将需要重新分配"，而不是笼统的"你确定吗"
- 自动加入类动作（Change Owner / 新增分配）用非阻断式小字提示，因为这是效率路径，不是风险操作，不应打断心流
- 分配数量始终以只读数字辅助判断，不做警示色渲染，避免在缺乏业务阈值依据时制造不必要的心理压力

## ④ MVP 范围说明

| 优先级 | 范围 |
|---|---|
| P0 | Team Member 列表页骨架（4 列）、Add/Remove 基础交互、Assignment 页 Programmer 候选范围收窄、Create Event Step 2 表单复用新样式 |
| P1 | Remove 二次确认展示 TFL 数量、Change Owner 自动加入及批注提示、Programmer 下拉内联分配数量、New User Session（Invite and Assign）、空状态头像 + No Assignee 文案 |
| P2 | 状态字段的具体定义与展示、负载超载视觉警示、Owner 变更后的通知机制 |

## ⑤ TBD 待确认事项

| 待确认项 | 当前假设 | Owner | 状态 |
|---|---|---|---|
| 添加 Team Member 的权限主体 | 沿用旧规则：任何 Team Member 都可添加 | PM | 🔴 |
| "由谁添加"字段的审计日志支持情况 | 假设后端已有埋点，未验证 | 架构师 | 🔴 |
| Remove 时若成员有已 Lock 的 TFL 是否需要额外拦截 | 暂不额外拦截，仅清空 Programmer | PM | 🟡 |
| Change Owner 后是否需要通知新 Owner | 暂不做通知 | PM | 🟡 |
| Assignment 页 Programmer 候选是否需要按角色再过滤 | 暂定不过滤，等于全部 Team Member | PM | 🟡 |
| Team 配置入口在 Event 详情页的具体位置 | 倾向放在页面右上角，待定 | Chimama / PM | 🟡 |
| 空状态头像图标资产 | 由 Chimama 提供，交付中 | Chimama | 🟡 |
| Remove 二次确认需展示受影响 TFL 数量 | 已确认 | PM | ✅ |
| Change Owner 自动加入用小字批注而非阻断弹窗 | 已确认 | PM | ✅ |
| 批量分配下拉底部改为 New User Session，选项文案为 Invite and Assign | 已确认 | PM | ✅ |
| 未分配状态展示为空头像 + No Assignee 文案 | 已确认 | PM | ✅ |
| Create Event Step 2 的 Team Member 分配表单同步复用新样式 | 已确认 | PM | ✅ |
| 本轮先出 UI 样式，不含技术实现评估 | 已确认 | PM | ✅ |

## ⑥ 附录

**涉及页面**
- Event 首页 TFL 列表的 Actions（已有的"分配 Members"入口，复用现有入口指向新团队配置页，非新建入口）
- Event 详情页（新增 Team Member 入口，具体位置待定）
- Team Member 列表页（新页面）
- Assignment 页（Programmer 字段调整为 Team Member 范围，下拉底部新增 New User Session）
- Create Event 流程 Step 2（原有 Team Member 分配表单，复用本次新样式）

**关联的既有确认规则**
- Admin 创建 Project/Study 并指派唯一 Study Owner
- Study Owner 创建 Event 并指派 Event Owner
- 所有用户可查看全部 Event 的 Shell/Code 面板与全局状态
- TFL 分配是路由/职责标签，不是编辑权限闸门
