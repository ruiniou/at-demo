# 临床试验术语速查表（UX视角）

> 按使用频率排序，高频术语标注 ⭐

---

## A

**ALCOA+** ⭐
数据质量原则。A=Attributable（可溯源到操作人）、L=Legible（清晰可读）、C=Contemporaneous（及时记录）、O=Original（原始记录）、A=Accurate（准确）。"+"代表：Complete（完整）、Consistent（一致）、Enduring（持久）、Available（可获取）。
*UX影响*：任何数据录入界面都要支持这些属性，尤其是"谁在什么时间做了什么"的追踪。

**AE（Adverse Event）** — 不良事件
临床试验中受试者发生的任何不良医学事件。
*UX影响*：AE报告流程通常有时效要求，界面需要清晰的紧急程度标识和快速录入路径。

**申办方（Sponsor）**
发起并资助临床试验的机构，通常是药企或医疗器械公司。
*UX影响*：申办方是eTMF系统的主要付费方和权限管理者，对数据可见性要求高。

---

## C

**CRA（Clinical Research Associate）** ⭐ — 临床研究助理/监查员
申办方委派到研究现场的人员，负责监查试验进行情况、文件完整性。是iCTA移动端的核心用户。
*UX影响*：CRA经常在研究中心现场操作，网络不稳定、时间紧张，需要高效的离线容错设计。

**CRC（Clinical Research Coordinator）** ⭐ — 临床研究协调员
在研究中心（医院）工作的协调人员，协助研究者和CRA。
*UX影响*：CRC是研究现场的日常操作者，对系统熟悉度高但工作量大，需要批量操作和快捷功能。

**CRO（Contract Research Organization）** — 合同研究组织
代替申办方承接临床试验管理工作的第三方机构。
*UX影响*：CRO可能同时管理多个申办方的项目，权限隔离和多项目切换是关键。

**CTR（Clinical Trial Registration）** — 临床试验注册

---

## E

**eTMF（Electronic Trial Master File）** ⭐⭐
电子试验主文件系统。存储临床试验全生命周期所有文件的系统，是GCP法规要求。
*UX影响*：文件分类（按TMF Reference Model）、版本管理、权限控制、稽查追踪是核心设计点。
*太美相关*：iCTA包含eTMF归档功能。

---

## G

**GCP（Good Clinical Practice）** ⭐⭐ — 临床试验质量管理规范
国际通行的临床试验操作标准，确保试验数据的完整性和受试者安全。
*UX影响*：几乎所有设计决策的合规底线，尤其是数据完整性和操作可追溯性。

---

## I

**ICF（Informed Consent Form）** ⭐ — 知情同意书
受试者参与试验前必须签署的文件，是重要的TMF文件之一。
*UX影响*：电子签名合规（21 CFR Part 11）、版本管理、受试者身份确认。

**IND（Investigational New Drug）** — 新药研究申请
向FDA或NMPA申请开展临床试验的程序。

**IRB/IEC（伦理委员会）**
审查和批准临床试验伦理合规性的机构。相关文件是TMF的必要组成部分。

---

## M

**监查（Monitoring）** ⭐
CRA定期访问研究中心，核查试验进行情况和文件完整性的活动。是CRA使用iCTA的主要场景。
*UX影响*：监查访视前中后有不同的操作需求，任务状态管理很重要。

**监查报告（Monitoring Report）** ⭐
CRA每次访视后生成的报告，记录发现的问题和后续行动项。
*UX影响*：报告生成流程的自动化程度影响CRA工作效率，是重要的设计场景。

---

## N

**NMPA** — 国家药品监督管理局（中国FDA）

---

## P

**PI（Principal Investigator）** ⭐ — 主要研究者
临床试验中对整个研究负责的医生。
*UX影响*：PI的签名和审批权限在系统中有特殊地位，需要单独的权限设计。

**Protocol（方案）** ⭐
临床试验的完整研究计划，规定了试验的所有程序。
*UX影响*：方案版本管理影响很多下游文件，版本变更通知是关键UX点。

---

## Q

**QC（Quality Control）** ⭐ — 质量控制
文件归档前的质量检查步骤，包括查重、格式验证、完整性检查等。
*UX影响*：QC步骤在归档流程中的位置和反馈方式是iCTA设计的核心挑战。

---

## R

**受试者（Subject/Participant）**
参加临床试验的患者或健康志愿者。

---

## S

**SAE（Serious Adverse Event）** — 严重不良事件
导致死亡、住院等严重后果的不良事件，有严格的上报时限（通常24小时内）。

**SDV（Source Data Verification）** ⭐ — 原始数据核查
CRA将CRF数据与原始资料（医疗记录）对比核查的活动。
*UX影响*：SDV结果需要被记录和追踪，是监查访视中的核心操作。

**Site（研究中心）** ⭐
开展临床试验的医院或机构。一个试验通常有多个Site。
*UX影响*：多Site管理是CRA/申办方的核心需求，地理分布和状态差异化很重要。

---

## T

**Tifo（Title & Footnote）** ⭐
统计编程行业标准的Shell输入格式之一，与Shell PDF、MOSAIC ARS JSON同类（均属于Atlas新建Event时的Shell input方式）。核心字段包括：sect_num/sect_ttl（章节号/标题）、tocnumber（目录编号）、Output Type（Table/Listing/Figure）、Title、azsolid（AZ内部标准模板编号，疑似Cross-TA命名差异来源，待确认）、PROGRAM（程序命名主干，如t_ds）、SUFFIX（人群/分析集后缀，如fas/mono）、OUTFILE（PROGRAM+SUFFIX拼接，即最终Program Code命名）、title1-7/footnote1-9（实际标题脚注文本）。
*UX影响*：原始Tifo文件的PROGRAM字段通常是系统自动生成的UUID占位符，SUFFIX为通用占位值，需要经过转换填入规范命名才能得到最终Program Code——这个转换发生的时机（Event创建时批量完成，还是任务分配后逐条补充）直接影响导航栏和Metadata review流程的设计，目前仍是TBD（对应AZ需求NAV-022）。

**TMF（Trial Master File）** ⭐⭐ — 试验主文件
临床试验中所有文件的集合，证明试验按照GCP标准进行。电子版即eTMF。
*UX影响*：TMF的文件分类、完整性和及时性是合规审查的重点。

**TMF Reference Model** ⭐
行业标准的TMF文件分类体系（由TMF Reference Model Working Group维护），定义了文件的区域/国家/研究中心/研究/受试者等层级分类。
*UX影响*：iCTA的文件归档分类体系应对应此模型，是文件属性字段设计的基础。

---

## 21 CFR Part 11

FDA关于电子记录和电子签名的合规要求。核心要求：
- Audit trail（操作日志，不可篡改）
- 电子签名与个人身份绑定
- 系统访问控制
*UX影响*：几乎所有涉及数据录入和签名的功能都需要考虑此合规要求。
