---
name: checklist_generator
description: 生成多维度、高精度的项目测试走查清单 (Testing Checklist)，结合代码分析自动补充边界情况和交互细节。
triggers:
  - "需要走查"
  - "做个checklist"
  - "生成测试单"
  - "checklist"
---

# Checklist Generator (测试走查清单生成器)

当用户要求“做个checklist”或“需要走查”时，激活此技能。你的目标是生成一份详尽、多维度的打包前测试记录清单，并主动通过分析项目代码来补充用户可能遗漏的边缘情况和影响面。

## 执行流程 (Workflow)

### 1. 需求确认与代码分析 (Code & Context Analysis)
- **获取基础输入**: 如果用户提供的上下文不够，主动询问本次走查的**范围 (Scope)**、**核心必查项 (Must-Check Items)**，以及相关的文件或设计稿链接。
- **主动代码溯源**: 核心步骤！根据用户提供的模块，**必须**使用文件读取和搜索工具去查看当前工程对应的组件代码 (React/CSS/状态管理等)。
    - **寻找隐藏状态**: 查找组件内的生命周期、事件监听 (如 `resize`, `scroll`)、Loading 状态、错误状态处理。
    - **边界与异常**: 检查空状态 (Empty State)、海量数据渲染、超长文本截断逻辑、API 失败兜底。
    - **影响面回归 (Side-effects)**: 如果得知本次修改了基础/公共组件 (如 Button, Modal, Nav)，必须全局搜索其被引用的地方，提取关键场景加入回归测试项。
- **结合设计规则**: 严格遵守项目中定义的全局设计规则（如 `.agents/AGENTS.md` 中的要求），确保 UI 走查项符合设计规范（例如：检查卡片边缘是否使用了非规范的粗线条高亮等）。

### 2. 生成 Artifact 清单 (Generate Checklist)
分析总结完成后，在当前的 brain 目录下创建一个名为 `testing_checklist.md` 的 Artifact，严格遵循以下规范生成表格。

#### 核心要求 (Rules)
1. **绝对不要在整个文档中使用任何 Emoji**。
2. 表格必须包含特定的列，尤其是 `验证维度 (Verification Dimension)`。
3. 语言描述保持专业、客观、简练。

#### 表格字段要求 (Properties)
- **模块 (Module)**: 归属大模块。
- **优先级 (Priority)**: P0 (核心链路/高优) / P1 (重要功能) / 优化 (体验及细节)
- **功能点 (Feature)**: 具体的组件或功能名称。
- **验证维度 (Verification Dimension)**: 必须且只能从以下几项中组合选择：
    - 功能是否跑通
    - UI还原度
    - 交互规则
    - 异常态&边界情况
    - 影响面回归
- **验证内容 (Test Cases)**: 详细描述需要操作及测试的具体场景（充分融合你进行代码分析后得出的隐性场景）。
- **期望结果 (Expected Behavior)**: 正确的展现形式或交互逻辑。
- **测试状态 (Status)**: `待测试 (Untested)` / `通过 (Pass)` / `未通过 (Fail)` / `阻塞 (Blocked)`，初始化时全填 `待测试`。
- **问题记录/备注 (Issue Record/Notes)**: 初始化留空。
- **参考资料 (References)**: 填入相关的 Figma 或 PR 链接。

### 3. 输出模板参考 (Artifact Template)

\`\`\`markdown
# 打包前测试记录清单 (Pre-release Testing Checklist)

## 字段说明 (Properties)
(此处列出上述的字段说明)

---

## [模块名称] 模块测试项

| 优先级 | 功能点 (Feature) | 验证维度 (Dimension) | 验证内容 (Test Cases) | 期望结果 (Expected Behavior) | 测试状态 | 问题记录 | 参考资料 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| P0 | 功能A | UI还原度 / 交互规则 | ... | ... | 待测试 | | |
| 优化 | 功能B | 异常态&边界情况 | ... | ... | 待测试 | | |
\`\`\`

完成 Artifact 生成后，在对话中向用户提供该文档的链接，并简述你通过代码分析主动补充了哪些易被忽略的核心场景，请用户审阅。
