### 一、通用规则

**核心原则**

1. Confirm 只用于审查"非用户产生"的内容。用户自己编辑字段视为隐含确认，无需额外点击 Confirm。
2. Add Changes to Chat 是待更新态的唯一出口，执行后字段回到默认态，Confirm 状态不强制清零。
3. 只读 ≠ 不可 Confirm，两者是独立维度；只读字段的 Confirm checkbox 始终可点。

**通用状态转移**

| 当前状态 | 触发动作 | 内容状态 → | Confirm 状态 → |
| --- | --- | --- | --- |
| 默认态 | 用户手动编辑 | 待更新态 | ✓ 已 Confirm |
| 只读态 | 用户手动点击 Confirm checkbox | 只读态不变 | ✓ 已 Confirm |
| 待更新态 | 点击 Add Changes to Chat | 默认态 | 保留原 Confirm 状态 |

**视觉状态组合（均合法，无需禁止任何组合）**

| 组合 | 说明 |
| --- | --- |
| 默认态 + 已 Confirm | 历史已确认，未被改动 |
| 默认态 + 未 Confirm | 初始态，内容尚未审查 |
| 待更新 + 已 Confirm | 用户刚编辑完，尚未 Add Changes to Chat |
| 待更新 + 未 Confirm | 内容被系统改动，等待用户审查 |
| 只读 + 已 Confirm | 系统字段，用户已手动确认 |
| 只读 + 未 Confirm | 系统字段，尚未确认或刚被覆盖打回 |

---

### 二、Listing 专属规则（Shell Preview 同步机制）

仅 Listing 模块存在"Shell preview 编辑 → 同步回 Metadata"的反向链路（Table / Figure 的 Shell 为纯输入模板，不会反向同步），因此以下规则仅适用于 Listing。

**专属触发**

| 当前状态 | 触发动作 | 内容状态 → | Confirm 状态 → | 附加提示 |
| --- | --- | --- | --- | --- |
| 任意态（含只读 + 已 Confirm） | Shell preview 同步覆盖字段值 | 待更新态 | □ 未 Confirm | Meta 入口按钮显示 🔴 red dot |

**专属联动**

- **Confirm All 的回退粒度**：若使用 Confirm All 批量确认后，某个字段被 Shell 同步覆盖，仅该字段回退为未 Confirm，不影响其他已确认字段；Confirm All 入口呈现为 indeterminate（不定态），提示存在部分字段待重新确认。
- 点击 indeterminate 状态的 Confirm All 时，仅补齐当前未 Confirm 的字段，不重复确认已手动确认过的字段。
- **只读字段范围确认**：当前 Listing 中只读字段对应 idlist、idpage（系统计算字段），它们可被 Shell preview 同步更新，遵循上述专属规则。

---

## 规则边界

- Add Changes to Chat 执行后，字段回到默认态，但 Confirm 状态保留原值，不强制重置为未 Confirm。
- 只读字段的可编辑性与可 Confirm 性彼此独立，只读不影响 Confirm checkbox 的可交互性。
- Shell 同步覆盖导致的状态回退，仅影响被覆盖的单个字段，不会级联影响其他字段或整体 Confirm All 状态（除变为 indeterminate 外）。