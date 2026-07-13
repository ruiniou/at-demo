# AZ-Brand-Color-Guidelines

> 来源：AZ Brand Guidelines - Color 章节
用途：Atlas UI Design System 色彩体系对齐参考
> 

---

## 1. Colour Values（色值表）

### 1.1 Core（核心色）

| 颜色名称 | HEX | RGB |
| --- | --- | --- |
| Mulberry | #830051 | 131/0/81 |
| Dark Mulberry | #4d0030 | 77/0/48 |
| Magenta | #d0006f | 208/0/111 |
| Gold | #f0ab00 | 240/171/0 |

### 1.2 Neutrals（中性色）

| 颜色名称 | HEX | RGB |
| --- | --- | --- |
| Graphite | #3f4444 | 63/68/68 |
| Platinum | #9db0ac | 157/176/172 |
| Light Platinum | #ebefee | 235/239/238 |
| White | #ffffff | 255/255/255 |

### 1.3 Secondary（次要色，仅点缀使用）

| 颜色名称 | HEX | RGB |
| --- | --- | --- |
| Purple | #3c1053 | 60/16/83 |
| Navy | #003865 | 0/56/101 |
| Light Blue | #68d2df | 104/210/223 |
| Lime Green | #c4d600 | 196/214/0 |

⚠️ **硬性规则：次要色（Purple / Navy / Light Blue / Lime Green）禁止用于背景或正文文字，只能作为点缀（accent）使用。**

---

## 2. Colour Balance

品牌整体印象应以 Mulberry 为主导。

| 颜色分组 | 角色 | 使用比例（按图示色块大小推断） |
| --- | --- | --- |
| Mulberry / White | 主导色（Predominant） | 占比最大，构成品牌主视觉 |
| Dark Mulberry / Magenta / Gold | 强调色（Illuminating，见第5节） | 中等占比 |
| Graphite / Platinum / Light Platinum | 中性色 | 中等占比，背景/次要文字/表格 |
| Purple / Navy / Light Blue / Lime Green | 次要色（Secondary） | 占比最小，“used sparingly” |

---

## 3. Accessibility（可访问性 —— 底色配文字色对比度等级）

规则来源：批准的高对比度组合，**未列出的组合一律不允许（“Other combinations are NOT permitted”）**。

### 3.1 AAA — 最高对比度，推荐（Recommended）

文字色 on 背景色

---

White on Mulberry

---

Light Platinum on Mulberry

---

White on Dark Mulberry

---

Light Platinum on Dark Mulberry

---

Gold on Dark Mulberry

---

White on Graphite

---

Light Platinum on Graphite

---

Dark Mulberry on Platinum

---

Mulberry on Light Platinum

---

Dark Mulberry on Light Platinum

---

Graphite on Light Platinum

---

Mulberry on White

---

Dark Mulberry on White

---

Graphite on White

---

### 3.2 AA — 中等对比度，次级推荐（**AstraZeneca 官方标准**）

文字色 on 背景色

---

Graphite on Gold

---

Mulberry on Gold

---

White on Magenta

---

Light Platinum on Magenta

---

Gold on Mulberry

---

Platinum on Mulberry

---

Gold on Graphite

---

Mulberry on Platinum

---

Magenta on Light Platinum

---

Magenta on White

---

> 给AZ做界面时，正文文字对比度**至少应达到AA级组合**，AAA更优但非强制门槛。
> 

---

## 4. Tints & Shades—— 仅限图表使用

### 4.1 使用范围限制

- **仅用于**：图表（charts）、表格（tables）、信息图（infographics）
- **例外**：Dark Mulberry 和 Light Platinum 本身可用于文字/UI，不受此条限制

### 4.2 阶梯规则

- 以 **20% 为步进单位**：20% / 40% / 60% / 80%（Shades方向）与 80% / 60% / 40% / 20%（Tints方向），中心为 **100%（纯色基准）**
- **可用区间下限20%，上限80%**——低于20%或高于80%的调子不在图表色板可用范围内（100%纯色本身作为基准色单独存在）
- 适用色系：Mulberry（黄绿色系Shade方向）、Dark Mulberry（深蓝）、Graphite（青灰）、Light Blue（蓝）、Magenta（品红）、Purple（紫）、Gold（金）、Platinum（灰绿）等，每个核心/次要色均有对应的shade-tint梯度

---

## 5. Illuminating Color

### 5.1 定义与用途

**Magenta、Gold、Light Blue、Lime Green** 是用于”点亮”与突出科学内容的强调色，专用于科学影像场景（science imagery）：

- 用于展示**发现的关键时刻**（moments of discovery）
- 用于标注**关键作用机制事件**（key mode-of-action events）

### 5.2 排版中的使用限制

| 颜色 | 可否用于文字排版（Typography）/ 背景 |
| --- | --- |
| Magenta | ✅ 可用于**突出关键事实与影响**（spotlight key facts and impact） |
| Gold | ✅ 可用于**突出关键事实与影响**（spotlight key facts and impact） |
| Light Blue | ❌ 禁止用于文字排版或背景 |
| Lime Green | ❌ 禁止用于文字排版或背景 |

### 5.3 三种典型应用场景（原文示例）

| 场景 | 说明 |
| --- | --- |
| Show moments of discovery（展示发现时刻） | 在科学插画中用圆点标记（Lime Green / Light Blue / Magenta）标注关键节点 |
| Illuminate scientific detail（点亮科学细节） | 在分子/科学影像上用强调色圆点突出细节区域（Magenta / Light Blue / Gold） |
| Spotlight impact（突出影响力数据） | Mulberry底色 + 白色正文 + **Gold高亮关键数字**（如 “3 billion doses”）——对应3.2节Gold在Mulberry上属于AA级 |

> ⚠️ 使用Illuminating色时仍需遵守第3节Accessibility规则，选色组合前先核对对比度等级表。
> 

---

## 6. 速查：设计决策对照表（便于团队/AI直接引用）

| 设计场景 | 适用规则 |
| --- | --- |
| 界面主背景/主色 | Mulberry / White，其余色”sparingly”使用 |
| 正文文字对比度 | 至少AA级组合（AZ官方标准），优先AAA |
| 大标题（18pt+） | 可用AA18组合 |
| 图表/数据可视化配色 | 仅用20%-80%区间的tint/shade，不可用于文字 |
| 科学插画/关键数据强调 | 用Magenta/Gold做highlight（Light Blue/Lime Green仅限图形点缀，不可进文字/背景） |
| 次要色（Purple/Navy/Light Blue/Lime Green） | 禁止做背景或正文文字，仅点缀 |