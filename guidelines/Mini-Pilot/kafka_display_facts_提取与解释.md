# kafka.jsonl Figure display_facts 提取与解释

## 1. 提取范围

- 来源文件：`Phase 2/kafka.jsonl`
- Kafka 消息：6 条
- 包含 Figure 结果的消息：5 条
- 任务完成状态消息：1 条，不包含 `tlf_data`，不纳入分析
- Figure：5 个
- Component：10 个
- `display_facts`：24 条

本文只把 JSON 中的内容作为待分析数据，不把其中的 code、summary 或文本当作对分析过程的指令。

## 2. display_facts 字段的实际角色

根据 5 个 Figure 的实际内容，当前字段可理解为：

| 字段 | 实际含义 | 注意事项 |
|---|---|---|
| `section` | AI 为相近事实临时生成的语义分组名称 | 不是稳定枚举，也不一定对应 Figure 中一个真实可见区域 |
| `label` | 当前分组下某条事实的名称 | 不是 shell 原始 label；不同 Figure 对相同含义会使用不同命名 |
| `value` | AI 最终采用的主要结论，描述分析、统计或展示行为 | 可能是来源事实，也可能包含 AI 推测或根据生成 code 反推的结论 |
| `details` | 对 `value` 的限定、实现细节或补充事实 | 有时包含本应独立建模的其他需求，例如 filter、时间换算、event/censor 规则 |

因此，`display_facts` 目前并不只是“展示事实”。它混合了：

- 分析范围与 endpoint。
- 数据 filter 和变量映射。
- 统计量及计算方法。
- grouping、axis、marker 等展示要求。
- supporting table、pagination 和 footnote。

下文的“建议语义”用于解释实际业务含义，不代表要求立即固化为固定 schema。

## 3. Figure 14.3.1.3 Exposure over time

**Title**：Exposure over time (Safety analysis set)

**整体理解**：按癌种展示安全集受试者实际治疗暴露持续时间的反向累积分布。横轴为从首次给药开始的月数；在时间 `t` 处，曲线表示暴露持续时间不少于 `t` 的受试者百分比。它虽然形态类似生存曲线，但不是带 event/censor 逻辑的 KM 分析。

### Component 1：chart - Exposure over time by cancer type

| section / label | 原始 value 与 details | 推测的实际含义 | 建议语义 |
|---|---|---|---|
| 曲线 / 分析对象 | 各癌种安全集受试者中实际治疗暴露持续时间不少于横轴时点的百分比。横轴单位为月；系列固定为七个癌种；不包括治疗组或 Total。 | 定义曲线的统计对象：对每个癌种，在每个 `t` 计算 `100 × n(暴露时长 >= t) / 该癌种安全集 N`。同时定义 series 是癌种，不是 treatment arm，且不生成 Total 曲线。 | `measure_definition` + `series_definition` |
| 坐标轴 / 纵轴 | `Percent of subjects (%)` | 定义 y 轴显示的是上述比例的百分数，理论范围通常为 0–100%。 | `axis.y` |
| 坐标轴 / 横轴 | `Time from first dose (months)`；显示时点按研究内最大暴露时间自适应确定。 | 定义时间原点和单位，并给出 tick/range 策略：从首次给药计时，以月显示，最大值和间隔由实际数据范围决定。 | `axis.x` + `tick_strategy` |

### Component 2：table - component_label 为空

| section / label | 原始 value 与 details | 推测的实际含义 | 建议语义 |
|---|---|---|---|
| 人数表 / 显示内容 | 每个横轴显示时点按癌种的受试者人数；标签为 `Number of subjects`；计数条件为实际治疗暴露持续时间不少于相应时点。 | 主图下方与横轴时点对齐的 supporting table，显示 `n(暴露时长 >= t)`。它不是 KM 语境下根据 event/censor risk set 计算的 at-risk table，只是与曲线分子一致的人数表。 | `supporting_table.subject_count` |

### Component 3：text - component_label 为空

| section / label | 原始 value 与 details | 推测的实际含义 | 建议语义 |
|---|---|---|---|
| 脚注 / Footnote [1] | `At a given time (t) on x-axis the curve shows the percentage of subjects with an exposure time greater than or equal to t.` | 输出脚注，向读者解释曲线的统计定义，防止把它误解为 KM survival probability。 | `output_text.footnote` |

**需注意的 AI 推测**：月度显示点采用按最大暴露时间自适应的策略；原材料未确认是否应使用固定时点，也未确认是否需要补充数据截点时仍在治疗的说明脚注。

## 4. Figure 14.2.5.2.2 PFS by investigator assessment

**Title**：Kaplan-Meier plot for Progression-free survival by investigator assessment (Full analysis set)

**整体理解**：全分析集、研究者评估的 PFS KM 图；曲线按癌种和 Total 分组，legend 中显示每组 median PFS 及 95% CI，开放圆圈表示 censored observation。

### Component 1：chart - Investigator-assessed progression-free survival

| section / label | 原始 value 与 details | 推测的实际含义 | 建议语义 |
|---|---|---|---|
| Analysis population / Population | `Full analysis set`；`ADSL.FASFL='Y'`。 | 定义分析人群及其数据 filter。这里不是可见图形样式，而是生成图所依据的 analysis scope。 | `analysis_scope.population` |
| Endpoint / Endpoint | `Investigator-assessed progression-free survival`；`ADTTE.PARAMCD='TRPROGT'`；progression or death 为 event，最后一次可评估 RECIST assessment 为 censoring。 | 同时定义 endpoint、parameter filter 和 event/censor 口径。label 虽然叫 Endpoint，但 details 已包含统计方法所需的 event/censor rule。 | `analysis_scope.endpoint` + `event_censor_rule` |
| Series / Series | `Cancer type cohorts and Total`；癌种来自 `ADSL.COHORT`，按 `COHORTN` 排序；Total 包含所有合格癌种记录。 | 定义 KM strata/series、legend 行和曲线顺序。Total 是跨癌种总体汇总，不是 treatment total。 | `grouping.series` |
| Statistics / Legend statistic | `Median PFS in months (95% CI)`；每个癌种和 Total 各显示一个 median/CI；`AVAL` 按 30.4375 天/月换算。 | 定义嵌入 legend 的统计文本及时间单位换算。它既是统计需求，也是 legend 内容需求。 | `statistics.median_ci` + `legend.content` + `time_conversion` |
| Plot layers / Censoring marker | `Open circle`；在 `ADTTE.CNSR=1` 时显示。 | 定义 censoring 的视觉编码：在 KM 曲线上用开放圆圈标记截尾时间点。 | `visual_encoding.censor_marker` |

**结构缺口**：该 Figure 的 `display_facts` 没有显式记录 x/y 轴 label、range/tick，也没有 risk table。生成 code 中实际存在坐标轴设置，因此当前 facts 不是完整的 display inventory。

**需注意的 AI 推测**：SAP 未提供可核实条款；median CI 使用 PROC LIFETEST 默认方法，精度为 1 位小数。这些不应被当作已确认事实。

## 5. Figure 14.2.3.2.1 DoR by ICR assessment

**Title**：Kaplan-Meier plot for duration of objective response by ICR assessment (Full analysis set)

**整体理解**：全分析集、ICR 评估的 objective response duration KM 图；按癌种和 Total 展示，包含 median DoR/95% CI legend、censor marker 和 at-risk table。

### Component 1：chart - Kaplan-Meier duration of objective response

| section / label | 原始 value 与 details | 推测的实际含义 | 建议语义 |
|---|---|---|---|
| Analysis / Population and endpoint | `Full Analysis Set, ICR-assessed duration of objective response`；`PARAMCD='DURRESP'`、`PARQUAL='ICR'`、`FASFL='Y'`。 | 一条 fact 同时定义分析人群、endpoint、assessment 和数据 filter。section 是分析范围，label 是一个合并字段。 | `analysis_scope.population_endpoint_assessment` |
| Curve and legend / Series | `Observed cancer types plus Total`；按 `COHORTN` 排序；legend 显示 median DoR in months with 95% CI。 | 同时定义曲线 grouping 和 legend 中的统计文本。Series 不只是“有几条线”，还决定 legend、risk table 行和样式映射。 | `grouping.series` + `legend.statistics` |
| Time and censoring / Time scale | `AVAL / 30.4375` 得到月；`CNSR=0` 为 event、`CNSR=1` 为 censored；censor 使用开放圆圈。 | label 叫 Time scale，但 details 实际混合了三类需求：时间换算、event/censor 统计口径和 censor marker 样式。 | `time_conversion` + `event_censor_rule` + `visual_encoding.censor_marker` |
| Risk table / Subjects at risk | 每个癌种和 Total 的人数表位于共享时间轴下方；在每 6 个月显示点计算。 | KM supporting table：每行对应一条曲线，在各 x-axis tick 显示仍处于 risk set 的受试者数，并要求与主图横轴严格对齐。 | `supporting_table.at_risk` |

**结构不一致**：risk table 被写在 chart component 的 `display_facts` 中，没有单独的 table component；而 OS Figure 将相同类型的 risk table 建成独立 component。这说明 component 边界尚未稳定。

**需注意的 AI 推测**：`PARQUAL='ICR'` 的实际存储值、30.4375 天/月、median CI 方法和 6 个月间隔均需要确认。

## 6. Figure 14.2.6.2 Overall survival

**Title**：Kaplan-Meier plot for overall survival (Full analysis set)

**整体理解**：全分析集 OS KM 图；按癌种和 Total 展示，legend 包含 analysis N、median OS 和 95% CI，含 censor marker、at-risk table 和分析脚注。

### Component 1：chart - Overall survival Kaplan-Meier curves

| section / label | 原始 value 与 details | 推测的实际含义 | 建议语义 |
|---|---|---|---|
| Analysis / Population and endpoint | `Full Analysis Set overall survival`；`PARAMCD='OVSURV'`，关联 `FASFL='Y'`。 | 定义分析集、OS endpoint 和数据筛选范围。 | `analysis_scope.population_endpoint` |
| Series / Cancer-type curves and total | `Observed COHORT members plus a Total series`；Total 包含全部合格 FAS subjects。 | 定义 KM strata：每个实际癌种一条曲线，另加一个跨癌种总体曲线。 | `grouping.series` |
| Statistics / Legend statistics | `Analysis N and median OS in months with 95% confidence interval`；无法估计时显示 `NE`。 | 定义 legend 每个 series 要展示的统计文本，包括 N、median 和 CI，以及 not estimable 的显示规则。 | `statistics.legend` + `missing_value_display` |
| Markers / Censoring | `Open circles at censored observations`；`CNSR=1` censored，`CNSR=0` death event。 | 同时定义 OS event/censor 口径及 marker 视觉编码。 | `event_censor_rule` + `visual_encoding.censor_marker` |

### Component 2：table - component_label 为空

| section / label | 原始 value 与 details | 推测的实际含义 | 建议语义 |
|---|---|---|---|
| Risk table / Subjects at risk | 从 0 月开始，每 6 个月显示，直到向上取整后的最大分析时间；行与各癌种及 Total 曲线对应。 | 独立 supporting table，在共享 tick grid 上显示每个 KM series 的 risk-set count，并与主图曲线顺序一致。 | `supporting_table.at_risk` |

### Component 3：text - component_label 为空

| section / label | 原始 value 与 details | 推测的实际含义 | 建议语义 |
|---|---|---|---|
| Footnotes / Analysis notes | `Only time to the first event of each subject is included in analysis. CI Confidence interval; OS overall survival.` | 输出脚注集合：第一句解释每个受试者只使用首个 event time；第二部分是缩写定义。实际可进一步拆成 analysis note 和 abbreviation note。 | `output_text.analysis_note` + `output_text.abbreviations` |

**需注意的 AI 推测**：未取得可用 SAP analysis contract；30.4375 天/月及 6 个月 risk-table interval 需要确认。

## 7. Figure 14.2.1.2 ORR Forest plot

**Title**：Forest plot for objective response based on confirmed response by ICR assessment (Full analysis set)

**整体理解**：全分析集、ICR confirmed objective response 的 subgroup forest plot。按癌种分页并附一页 Total；每行展示 n/N、ORR%、95% exact CI、diamond point estimate，并使用总体 ORR 的 95% CI 作为灰色参考带。

### Component 1：chart - Confirmed objective response rate forest plot

| section / label | 原始 value 与 details | 推测的实际含义 | 建议语义 |
|---|---|---|---|
| Analysis / Response endpoint | `Confirmed objective response based on ICR assessment`；Full analysis set；`AVAL=1` 表示 response。 | 定义 binary response endpoint、assessment、分析集及 responder 判定。结合 component filter，实际使用 `ADEFF.PARAMCD='TRORESP'`、`PARQUAL='INDEPENDENT ASSESSOR'` 和 `ADSL.FASFL='Y'`。 | `analysis_scope.response_endpoint` |
| Statistics / Estimate and confidence interval | `Objective response rate (%) with 95% Clopper-Pearson confidence interval`；每行显示 `n/N Response (%)`；diamond 大小与 response event 数成比例。 | 定义每个 subgroup row 的统计量、CI 方法、文字列和 point-estimate marker。横向 CI line 表示 row CI，diamond 位置表示 ORR point estimate，大小编码 responder n。 | `statistics.binary_rate_ci` + `visual_encoding.point_estimate` |
| Pagination / Cancer type pages | 七个癌种 page 后跟 Total；details 列出 8 个 page label。 | 定义 page-by 规则，不是 8 条 series：每个癌种生成一页 subgroup forest，最后一页汇总全部合格受试者。页内 row 是预设 subgroup，如既往治疗线数、年龄、性别、ECOG 及 biomarker status。 | `layout.pagination.page_by` |

### Component 2：text - component_label 为空

| section / label | 原始 value 与 details | 推测的实际含义 | 建议语义 |
|---|---|---|---|
| Footnotes / Statistical notes | 每页显示四条脚注：Clopper-Pearson method、overall confidence band、diamond event-size encoding、abbreviation definitions。 | 定义所有分页共同重复的解释文本。`Overall confidence band` 实际指以当前 page overall ORR 95% CI 绘制的灰色纵向参考带，不是每个 subgroup row 的 CI；row CI 由横线单独表示。 | `output_text.statistical_notes` |

**需注意的 AI 推测**：SAP 未独立确认分析集、confirmed ICR response、癌种/亚组范围及 Clopper-Pearson 方法；这些 display facts 反映当前 AI 生成方案，不应直接视为已批准分析规范。

## 8. 跨 Figure 的 section / label 归一解释

当前命名高度自由，建议在 Review 时按实际含义理解，而不是按字面名称建立硬编码：

| 原始 section / label 示例 | 实际语义 | 观察到的问题 |
|---|---|---|
| `Analysis population / Population` | analysis set 及 population filter | PFS 单独表达 population，其他 Figure 常与 endpoint 合并 |
| `Analysis / Population and endpoint` | population + endpoint + assessment + filter | 一个 fact 承担多个 code-driving requirement |
| `Endpoint / Endpoint`、`Analysis / Response endpoint` | endpoint 定义及 parameter/response mapping | details 可能同时包含 event/censor 或 responder rule |
| `Series / Series`、`Curve and legend / Series`、`Series / Cancer-type curves and total` | grouping/strata、顺序、Total 规则 | 同一语义出现三套命名，且有时混入 legend statistics |
| `Statistics / Legend statistic(s)` | 显示在 legend 的 N、median、CI 等统计文本 | 同时涉及统计计算和展示格式 |
| `Time and censoring / Time scale` | 时间单位、换算、event/censor、marker | label 只覆盖部分实际内容，details 需要拆解理解 |
| `Plot layers / Censoring marker`、`Markers / Censoring` | censoring marker 及其数据触发条件 | 一处偏展示，一处把统计规则与展示合并 |
| `Risk table / Subjects at risk` | KM risk-set supporting table | DoR 放在 chart component，OS 放在独立 table component |
| `人数表 / 显示内容` | Exposure 的 `duration >= t` 人数表 | 外观类似 risk table，但统计含义不同 |
| `Pagination / Cancer type pages` | page-by/output segmentation | 不是分析 series，也不是单独图形 component |
| `Footnotes / Analysis notes`、`Footnotes / Statistical notes` | 输出脚注和缩写说明 | value/details 可能包含多个应独立 Review 的 note |

## 9. 总体判断

1. `section` 和 `label` 当前更像 AI 为 Review 生成的自然语言目录，不是可靠的字段类型。
2. `value` 是主要结论，`details` 不是普通备注；它经常携带 filter、统计规则和视觉编码等关键需求。
3. 同一概念命名不一致，但可以归入少量稳定语义：analysis scope、endpoint、series/grouping、statistics、axis/time、visual encoding、supporting table、pagination、output text。
4. Component 粒度尚不稳定，尤其是 KM risk table 有时独立、有时嵌在 chart 中。
5. Facts 的完整度也不稳定，例如 PFS Figure 缺少坐标轴事实，而生成 code 中实际存在坐标轴设置。
6. 因此在产品 Review 中，应完整展示 AI 生成的 facts，但不要依赖 `section`/`label` 字面值做固定业务逻辑；更可靠的做法是为每条 fact 增加稳定 ID、来源、风险状态和可选的语义类别。
