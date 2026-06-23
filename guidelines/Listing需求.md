# Listing需求

# 前置需求

区分判断Listing和Table

要素1：Title Type

Appendix肯定是Listing，Table也有可能是Listing

要素2：主体结构

row都是dummy data

要素3：Title

Key Subject Information等关键词

## 原始内容

```plaintext
ParsedListing
├── Title                           # 一级对象
│   ├── Type                        # 分类标签（ID 前的文本，如 "Appendix"）
│   ├── ID                          # 编号（如 "16.2.12"）
│   ├── title_label                 # 标题全文
│   ├── population_text             # 标题中的人群文本
│   └── subject_header              # 受试者级字段（标签即其内容）
│       ├── value                   # 提取的值/占位符（如 <<Exxxxxxx>>）
│       └── marker                  # 脚注标记（如 [a], [b], *）
├── Sub_Title                       # 一级对象
│   ├── section1                    # 副标题区域第 1 行/分节
│   │   ├── value                   # 变量占位符
│   │   └── marker                  # 脚注标记
│   ├── section2                    # 副标题区域第 2 行/分节（跨行时存在）
│   └── ...                         # 可多行
│
├── Listing                         # 一级对象
│   ├── header1                     # 第 1 列列头（列头文本即其内容）
│   │   ├── spanning_header         # 跨列父级列头（嵌套列头时存在）
│   │   │   └── marker              # 跨列头上的脚注标记
│   │   ├── marker                  # 列头上的脚注标记
│   │   ├── row1                    # 样例数据第 1 行
│   │   │   ├── example_data        # 样例值
│   │   │   └── alignment           # 对齐方式
│   │   ├── row2                    # 样例数据第 2 行
│   │   │   ├── example_data        # 四级对象
│   │   │   └── alignment           # 四级对象
│   │   └── ...                     # 可多行
│   ├── header2                     # 第 2 列列头
│   └── ...                         # 可多列
│
└── Footnote                        # 一级对象
    ├── Footnote1                   # 二级对象
    │   ├── marker                  #   三级对象：标记符号（如 [a], *, #）
    │   └── content                 #   三级对象：脚注全文
    ├── Footnote2                   # 二级对象
    │   ├── marker
    │   └── content
    └── ...                         # 可多列
└── Other note                      # standard note/programmer note等
```

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/meonarb1RDyarqXx/img/f97b89d9-88be-40b3-a6d1-9b6f5544412d.png)

额外输入：SDTM Spec

优先ADaM，找不到的SDTM，都没有的Derive待确认

SAP

# 单例Listing需求整理

## 数据需求

| 推断目标 | FR-01 来源 | 依赖知识 | 推断说明 |
| --- | --- | --- | --- |
| domain | title\_label | CDISC 域分类 | "Tumour assessment" → TR (Tumour Response) |
| Dataset(s)<br>primary\_dataset/merge\_datasets | domain + header 语义+value（subject\_header，sub\_title） | ADaM | TR domain → ADTR 为主数据集 |
| record\_grain |  |  | 推断数据维度-主键<br>Listing 需要的颗粒度 vs 实际数据颗粒度的差距及处理（拆分/合并/转宽） |
| Variables<br>直接映射/derived\_variables+derivation rule | column header 文本<br>value（subject\_header，sub\_title） | ADaM/SDTM | "Study day" → ASTDY<br>"Duration of actual exposure" → 需计算 |
| Display value处理 | row数据样例、footnote |  | 含：空值映射(NC/NA/NE)、多变量拼接、1-N 动态字段拼接、日期+Study day 拼接、转义字符等 |
| sub\_title处理 | sub\_title、footnote |  |  |
| pop\_flag | population\_text | ADaM | "(ITT analysis set)" → ITTFL="Y" |
| filter\_conditions | header 隐含范围<br>Title、Subtitle、Footnote |  | "Target lesion" → 仅靶病灶记录 |

record\_grain（记录结构层）  输入：source\_grain / target\_grain  输出：已确定颗粒度的中间数据集  职责：拆行 / 转宽 / 合并 → 只管"一行代表什么"  边界：完成后数据集的行数 = Listing 最终行数(不含Filter) data\_derivation（数据派生层）  输入：record\_grain 输出的数据集  输出：包含所有最终展示列的数据集  职责：变量映射 / 计算 / 拼接 / 空值映射 / 动态字段 → 只管"每列的值是什么"  边界：完成后 col0-colN 的值已确定 display\_formatting（展示格式层）  输入：data\_derivation 输出的数据集  输出：可直接传给 %m\_l 的数据集  职责：对齐 / 转义字符 / 列头换行 / 数值格式化 → 只管"值的外观"  边界：完成后数据只差排序和输出

## 展示需求

| 推断目标 | FR-01 来源 | 其他依据 | 推断说明 |
| --- | --- | --- | --- |
| page\_break\_by\_variable(Title) | subject\_header 内容 |  | 按 Subject identifier 分页（每个受试者独立一页） |
| page\_break\_by\_variable(Sub\_Title) | pageby per sub\_title |  |  |
| page\_break\_by\_column |  | / | column 太多时按宽度拆成多页 |
| page\_break\_by\_height |  |  | 单行数据高度估算，超出页高时自动切分（如 l\_cm.sas / l\_ae.sas） |
| sort\_order/分组内排序 | header 语义 + row 样例+Footnote |  | Study day → Lesion number → 时间序<br>组内按 Lesion number 1→5 排序 |
| 行分组模式 | row 空值模式 | 已经推断的variable的业务含义 | Study day 仅首行有值 → 按 Study day 分组 |
| spanning\_header | spanning\_header |  |  |
| 对齐方式 | alignment 推断 |  | 数值列右对齐/小数位对齐，文本列左对齐 |
| column\_width | header+spanning header | variable value长度 |  |

## Code需求

输入：上述整理的ListingRequirements+知识库

Code基本流水线：

%setup/%localsetup 初始化（无需关注）

取数和展示字段衍生：拼接日期+Study Day、把多变量合并成一列、统一数值小数位等

调用 %m\_l 或 %m\_u\_report 输出 RTF

有一个Macro，可覆盖80%场景，能用则用

inds=, pop\_flag=, whr=, pageByN=, pageByFmt=, varlist= headerlist= sortBy= lenlist=, **idcoln**\=合并单元格的列(1) indicating the number of initial columns that will not repeat values if they are the same as the previous row. 宽表跨页重复的列(2) indicating whether will be repeated in every new page (for wide page setting). ,

> Restriction：The `idcoln` option has no ORDER effect when `orderlist` option is specified. The `idcoln` option has no ID effect when `idlist` option is specified.

**orderlist**\=specifies whether to apply the ORDER option for each column, separated by "#". "Y" means order variable, which does not repeat the value from one row to the next if the value does not change. It can override `idcoln` function (1). **idlist**\=specifies whether to apply the ID option for each column, separated by "#". "Y" means ID variable, an ID variable and all columns to its left appear at the left of every page of a report. It can override `idcoln` function (2). If leave it as null or not to state it, the default values will be used. **idpage**\=specifies whether inserts a page break for each column, separated by "#". "Y" means this column and all columns to its right will appear on a new page. If leave it as null or not to state it, the default values will be used. **jdvarlist**\=specifies the list of variables that should be aligned by decimal points (variables only including digits). Variables are separated by "#". pg=, sfx=, deBug=<Y|N>

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/meonarb1RDyarqXx/img/122b2473-8cff-4780-8db0-64f038aa4011.png)

,orderlist=Y#Y#Y#Y#N#N#N#N#N#N

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/meonarb1RDyarqXx/img/88991d1e-f9c2-4905-af90-ef3ea370b0d0.png)

,idcoln=4

,idpage=N#N#N#N#N#N#N#N#Y#N#N#N#N

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/meonarb1RDyarqXx/img/d4030982-20da-45bc-a201-66fa0bfc43e7.png)

,idcoln=2

,orderlist=Y#N#N#N#N#N#N#N#N#N#N

,idpage=N#N#N#N#N#N#N#Y#N#N#N

```sas
data TITLE6;
  set tlf.titles(where=(upper(program) = upper("&program.") and index(parm,"TITLE4") and upper(suffix) = upper("&sfx.&list.")));
  value='"Subject identifier: &subj"';col1=strip(value);parm="TITLE6";            
run;
```

## Review需求

### Preview

原始Json结构和Table一致

普遍较宽且每一列都需要关注，Panel布局是否可以优化

column\_分页可参数化调整后预览（原始shell和效果预览是否区分开）UI关注

### Metadata

能快速review变量的映射

column\_分页可参数化调整后预览

### Code Editor

同Table，Autocomplete只需要l的macro

### Copilot

L特定的Tool/Skill

# 强化项

评估节点

校验节点

# 迭代规划

Sprint 4 AI探索实践+后端结构拓展

Sprint 5 初步生成并接入系统+Benchmark

Sprint 6 调优+Copilot+其他细节优化