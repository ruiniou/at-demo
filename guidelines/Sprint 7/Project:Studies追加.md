# Proposal：Projects & Studies 管理页面

范围声明：本 Proposal 覆盖页面布局、支持功能、不同权限角色的可见性差异。Tree List 的多级视觉展开方式暂不在本次范围内，沿用当前的可折叠分组表格。

## ① 问题背景

- 现有 Atlas 首页改造方案（Events 主页）是 Event Owner / Team Member 视角，Sidebar 只有 Recent 列表，没有任何 Project / Study 管理入口。
- 已确认的权限文档（权限管理总览、Project/Study 管理页面：访问权限）定义了 Admin 与 Study Owner 对 Project/Study 的操作边界（PERM-01/02/09/10 等），但没有落到具体页面结构，导致创建、维护、禁用/启用这几件事没有归属的 UI。
- Project/Study 是 Atlas 权限模型的顶层对象（Study Owner → Event Owner → Event Team Member 全部挂在 Study 之下），这个页面缺失会阻塞 Event 创建链路的起点。

## ② 主要改进点

| 项目 | 原假设 / 现状 | 本次设计决策 |
| --- | --- | --- |
| 页面入口 | 未定义，Sidebar 无相关导航 | Events 为全角色共享主入口（对应 PERM-07 的 Logged-in User baseline 可见性）；Admin / Study Owner 在 Sidebar Footer 多一个齿轮入口进入 Projects & Studies，Team Member 不显示 |
| Project 创建字段 | 依赖 LSAF 接口，字段未定（🔴 待确认） | 本轮不接 LSAF，仅需 Project Name 一个必填字段 |
| Study 创建字段 | 同上，且依赖 Stardate 自动带出 TA（🔴 待确认） | 本轮仅需 Study Name / TA（下拉） / Study Owner（用户选择器）三个必填字段 |
| 状态呈现 | 无具体设计 | Enabled/Disabled 用 Switch 组件表达，比纯文字点击的可发现性更好；Project 与 Study 分别展示状态，此前的草案漏了 Project 层级 |
| 级联禁用 | 文字规则存在（"不展示其下属 Study 的 Disable/Enable 操作"），无交互设计 | Project 禁用需二次确认（弹窗提示影响 N 个 Study），确认后 Study 的 Switch 变为锁定态（灰色不可点），不是简单隐藏 |
| 列表信息 | 草案曾包含 Events 数量列 | 移除。Event 工作量/完成度属于 Dashboard（PERM-18/19/20）职责范围，避免两处数据源不一致的维护成本 |
| 行内操作 | 草案曾用独立"操作"列 | 折叠进 Owner（hover 出现编辑图标）与 Status（Switch 本身即操作）两处，减少一列冗余信息密度 |

## ③ 设计方案

### Happy Path

1. Admin 登录，Sidebar Footer 出现管理入口（齿轮图标），点击进入 Projects & Studies。
2. 页面展示全部 Project，按 Project 分组、Study 嵌套的表格；表头为 Study/Project · Owner · Status 三列。
3. 点击 "+ New Project" → 弹窗填写 Project Name → Create → 新 Project 出现在列表顶部（空 Study）。
4. 在该 Project 行点击 "+ New Study" → 弹窗填写 Study Name / TA / Study Owner → Create → Study 出现在该 Project 下，默认 Enabled。
5. 后续维护：鼠标移到 Owner 上出现编辑图标，点击可重新指定 Owner；点击 Status 的 Switch 可直接切换 Enable/Disable（Study 级即时生效，Project 级二次确认）。
6. Study Owner 登录后默认落在 Events 首页；若其账号同时具备 Study Owner 关系，Sidebar Footer 同样出现齿轮入口，进入后只看到自己负责的 Study（及其所属 Project 的只读基本信息），只能维护自己 Study 的 Owner，看不到"+ New Project/Study"、看不到 Disable 开关。

### 规则边界（对应已确认的权限文档）

| 规则 | 页面表现 |
| --- | --- |
| Admin 可查看/管理全部 Project 及 Study | 表格展示全量数据，全部操作可见 |
| Study Owner 仅可查看/操作自己负责的 Study | 表格按 Study Owner 过滤，只保留其名下 Study 所属的 Project 分组，Project 内其他 Study 不展示 |
| Project 没有 Owner 概念 | Owner 列在 Project 分组行留空，不虚构一个"Project Owner" |
| Admin 不自动获得业务协作权限 | 本页面与 Event/Copilot/下载权限无关，不额外处理 |
| 禁用 Project → 下属 Study 视为禁用，且不展示其独立开关 | Study 的 Switch 呈锁定态（灰、不可点），文案标注"继承自 Project" |
| 重新启用 Project 不自动恢复单独禁用的 Study | Study 若在被 Project 禁用之前就已经是 Disabled，Project 恢复后该 Study 仍显示 Disabled，需要 Admin 单独再启用一次（本轮实现里通过保留 Study 自身 status 字段、不做覆盖写入来保证） |
| 禁用/启用不影响已创建的 Event | 各类提示文案中明确说明，避免 Study Owner 误以为数据会被清除 |
| 每个 Study 仅允许一个 Study Owner（PERM-01/02） | Owner 列展示单一用户；⚠️ 详见 TBD，与近期补充信息存在口径冲突，未最终定稿 |

### 失败场景 Top 3

| 场景 | 处理方式 | 安抚文案示例 |
| --- | --- | --- |
| 创建 Project/Study 时必填字段为空提交 | 阻止提交，字段下方红字提示，不清空已填内容 | "Project Name 不能为空" |
| Admin 禁用一个仍有多个进行中 Event 的 Study/Project | 二次确认弹窗说明影响范围，但不阻止操作（业务规则本身允许禁用不影响已有 Event） | "禁用 {Project} 将同时禁用其下 {N} 个 Study，不影响已创建的 Event，可随时重新启用" |
| 创建/切换状态时接口请求失败 | Toast 报错，表单内容不丢失，Switch 状态回滚到操作前，不出现"界面显示已切换但后端未生效"的假成功 | "保存失败，请重试" + 保留原表单数据 |

## ④ MVP 范围说明

**本轮做（P0）**

- Projects & Studies 页面骨架：分组表格（Project → Study），Owner/Status 内嵌交互
- Create Project（仅 Project Name）、Create Study（Study Name / TA / Study Owner）
- Owner 维护（hover 编辑图标 + 弹窗指定新 Owner）
- Enable/Disable Switch，含 Project 级联二次确认与 Study 锁定态
- 按角色（Admin / Study Owner）的可见性与操作差异

**本轮明确不做（推迟到后续迭代，避免范围蔓延）**

- LSAF 接口对接（查重、Project/Study 唯一标识回填）
- Tree List 的多级视觉展开方式
- Dashboard（Event 数量、工作量、完成度等报表型信息）
- 审计记录页面（文档定义 Sprint 8 再做）
- 账号级权限例外、角色权限配置页
- Runtime 权限接入

## ⑤ TBD 待确认事项

| 分类 | 问题 | 当前假设 | Owner | 状态 |
| --- | --- | --- | --- | --- |
| Study Owner 数量 | Study 是否支持多个 Owner，还是仍是唯一 Owner？ | 本轮按唯一 Owner 实现，与 PERM-01/02 一致；但近期补充信息提到"Owner 可为多人"，两者冲突未消解 | PM / Architect | 🔴 |
| Project/Study 必填字段 | 完整必填字段（TA/Code/LSA 接口字段）是什么？ | 本轮仅 Name（Project）、Name+TA+Owner（Study），其余待 LSA 接口明确后再加 | PM / AZ / Architect | 🔴 |
| TA 自动带出 | Stardate 创建时能否自动带出 TA？ | 本轮 TA 为手动下拉选择 | PM / AZ / Architect | 🔴 |
| LSA 接口 | LSA 接口规范和示例何时提供？ | 未提供前不影响本轮 MVP，但会阻塞下一轮字段扩展 | Architect / AZ IT | 🔴 |
| Project 级联禁用二次确认 | 弹窗提示是否足够，还是需要更强的阻断（如要求二次输入 Project 名称确认）？ | 本轮按轻量二次确认（Cancel/Disable 按钮）实现 | PM / UX | 🟡 |
| Dashboard 相关 | Event/Study/Global Dashboard 各层展示目的、入口位置、Unit 定义 | 与本页面无关，仅供后续排期参考 | PM / UX / AZ | 🔴 |
| Runtime 权限 | 后续 Runtime 接入采用哪种权限关系 | 首期默认拒绝，本轮不涉及 | Architect / PM | 🔴 |

## ⑥ 附录

### 权限矩阵（最终版，本轮范围内）

| 操作 | Admin | Study Owner |
| --- | --- | --- |
| 查看 Project 列表 | 全部 | 仅自己 Study 所属 Project（只读基本信息） |
| 创建 Project / Study | ✅ | ❌ |
| Enable/Disable Project / Study | ✅ | ❌ |
| 维护 Study Owner | ✅（任意 Study） | ✅（仅自己负责的 Study） |
| 查看其他 Study | ✅ | ❌ |

### Status 组件语义

| 状态 | 视觉 | Admin 交互 | Study Owner 交互 |
| --- | --- | --- | --- |
| Enabled | Switch 打开（绿） | 可点击切换 | 只读 |
| Disabled | Switch 关闭（灰） | 可点击切换 | 只读 |
| Disabled（继承自 Project） | Switch 关闭 + 锁定态（半透明、不可点） | 不可点击，Tooltip 说明继承原因 | 不可点击 |

### 关联需求引用

- 权限管理总览：PERM-01、PERM-02、PERM-03、PERM-09、PERM-10、关键边界表
- Project/Study 管理页面：访问权限（禁用/启用规则、Owner 维护规则）
- 交互 Demo：Atlas — Role-Based Navigation Demo（已发布，含三种账号视角切换）
