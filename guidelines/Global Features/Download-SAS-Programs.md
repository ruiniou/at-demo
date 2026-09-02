# Download SAS Programs — PRD（简版）

## 1. 背景

Atlas首页Event下载入口，原用于分别下载SAS Program、TOC、Task List三类文件。原SAS Program下载弹窗仅支持勾选和确认，缺少搜索、筛选与依赖信息展示，选择效率低；同时TOC、Task List作为独立入口存在，用户需多次操作才能拿到一次交付所需的完整文件集合。

Download功能的本质是：将Atlas中产出的代码包交付到外部Runtime/SaaS环境运行。

## 2. 目标

优化"Download SAS Programs"弹窗，使其成为该Event下载操作的统一入口，在保留SAS Program逐项选择灵活性的同时，将TOC、Task List整合为同一流程内的可选项，减少用户跨入口重复操作。

## 3. 入口

- **首页**：Event列表的Download icon button，点击后直接打开"Download SAS Programs"弹窗，无下拉选项
- **详情页**：右上角新增Download icon button，位置在Segmented Control左侧，点击后打开同一个弹窗

## 4. 搜索

- 单一搜索框，同时匹配以下三个维度：T/L/F Title、Program Name、Macro名称
- Placeholder：*Search title, name, or macro*

## 5. 筛选

- Owner筛选、Locked Only筛选，两者为AND逻辑

## 6. 列表

表格布局，详见设计稿。

## 7. 底部Bundle说明

勾选至少1个SAS Program后，弹窗底部出现一行提示，说明本次下载包含的内容：

> This download includes: **{N} SAS Programs**, ☑ TOC and ☑ Task List for this Event

- SAS Program数量随勾选实时更新
- TOC、Task List为可勾选项，默认选中，用户可自行取消
- 未勾选任何SAS Program时，此提示不显示

## 8. 底部操作栏

- 左侧：Cancel按钮
- 右侧：Download按钮，未勾选任何SAS Program时禁用
- 点击Download后，Toast提示下载成功
