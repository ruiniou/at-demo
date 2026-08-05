Shell Preview — Small 变体设计规范
基于原始 Shell-Preview-Design-Spec.md，记录 Small 变体的实际实现差异。 适用于 Table (Small) 和 Figure (Small)。

1. 与原 Spec 的关键差异
项目	原 Spec (Default)	Small 变体
画布外边距	24px	20px
Study Info → Title Block	16px (原 Spec) / 8px (实现)	12px
Title 字号	14px / Medium / 24px lh	13px / Medium / 16px lh
表头字号	13px / Medium / 16px lh	12px / Medium / 20px lh
数据/行标签字号	12px / Regular / 18px lh	10px / Regular / 14px lh
Parent 行标签字号	12px / Medium	10px / Medium / 14px lh
单元格内边距	上下 6px / 左右 8px	Parent 行: 6/6/6/6；Subgroup 行: 1/1/6/6
Parent 行高	24px (FIXED)	24px (FIXED) — 不变
Subgroup 行高	20px (Default 实现)	18px (FIXED)
表头高度	44px	52px
Subgroup 行间分隔线	存在但隐藏	不显示 (visible: false)
2. Text Style Token 绑定
2.1 Shell 通用区域（Header / Footnote）
区块	Text Style Token	字号结果	颜色 Token
Title	Small Text/Table	13px / Medium / 16px lh	text-primary
Study Info (AZ 行)	Small Text/Footnote	10px / Regular / 14px lh	text-primary
Study Info (Study 行)	Small Text/Footnote	10px / Regular / 14px lh	text-secondary
Subtitle	Small Text/Footnote	10px / Regular / 14px lh	text-secondary
Population (Figure)	Small Text/Footnote	10px / Regular / 14px lh	text-secondary
Footnotes	Small Text/Footnote	10px / Regular / 14px lh	text-secondary
2.2 表格区域（Table 独有）
区块	Text Style Token	字号结果	颜色 Token
表头	Small Text/Small Medium	12px / Medium / 20px lh	text-primary
Parent 行标签	Small Text/Micro	10px / Medium / 14px lh	text-primary
Non-parent 行标签 (n, Mean, SD…)	Small Text/Footnote	10px / Regular / 14px lh	text-secondary
数值单元格	Small Text/Footnote	10px / Regular / 14px lh	text-primary
3. 边框 Token 绑定
位置	粗细	颜色 Token	备注
表格顶边 (table frame strokeTop)	2px	text-primary	
表头底边	2px	text-primary	
Parent 行顶边	1px	Graphite/10	仅第一个 group
Parent 行底边	1px	Graphite/10	
Subgroup 行底边	1px	Graphite/10	visible: false（不显示）
关键规则：Subgroup 行之间不含可见 Divider。 行间分隔线定义存在但设为隐藏。

4. 行高规则
行类型	高度	layoutSizingVertical
Parent 行 (row-label)	24px	FIXED
Subgroup 行 (row-n, row-mean, row-sd…)	18px	FIXED
表头	52px	—
5. Spacing 量表（Small）
档位	用途
1px	Subgroup 单元格上下内边距
4px	同组文字行间（Title 组、Footnote 组）
6px	Parent 行单元格上下/左右内边距
12px	Study Info → Title Block
16px	跨区块间距（Header → Content → Footnote）
20px	画布外边距
6. 层级总结
Code block
13px Medium (Title)
  └─ 12px Medium (表头)
       └─ 10px Medium (Parent 行标签)
            └─ 10px Regular (数据 / Non-parent 标签 / Footnote)
字重区分层级：Medium → Regular 颜色区分层级：text-primary → text-secondary（Non-parent 行标签降级）

7. Figure 变体差异
Figure Small 与 Table Small 共用 Header 和 Footnote 规则，仅内容区不同：

项目	说明
内容区	KM 曲线图（保持原始尺寸）
图表文字	不由 Shell 控制，保持图表内部样式
Content Area 对齐	水平居中