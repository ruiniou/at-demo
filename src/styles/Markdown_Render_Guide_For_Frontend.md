# AI Copilot Markdown 渲染标签映射指南 (For Frontend)

在 AI Copilot 对话流中，AI 返回的回复为原始 Markdown 文本。为了保证渲染出的 HTML 标签（标题、正文、列表、链接、引用、Callout、表格、代码块等）严格符合 AstraZeneca Design System 规范，建议前端基于 **`react-markdown`** + **`remark-gfm`** 的 `components` 映射机制进行接入。

---

## 一、 Markdown 核心样式与 Token 映射清单 (Design Spec)

| Markdown 语法 | HTML 标签 / 组件 | 视觉规格与排版约束 (Typography & Token) | 容器与圆角约束 (Radius & Border) | 推荐的 Tailwind / 全局类名 |
| :--- | :--- | :--- | :--- | :--- |
| `# 标题一` | `h1` | • 字号: `16px` (`font-bold`)<br>• 字色: `#3F4444` (`text-text-primary`)<br>• 字体: `var(--font-body)`<br>• 边距: `mb-[10px]` | 无边框与圆角 | `className="text-[16px] font-bold text-text-primary mb-[10px]"` |
| `## 标题二` | `h2` | • 字号: `14px` (`font-bold`)<br>• 字色: `#3F4444` (`text-text-primary`)<br>• 边距: `mb-[6px]` | 无边框与圆角 | `className="text-[14px] font-bold text-text-primary mb-[6px]"` |
| `### 标题三` | `h3` | • 字号: `14px` (`font-semibold`)<br>• 字色: `#3F4444` (`text-text-primary`)<br>• 边距: `mb-[4px]` | 无边框与圆角 | `className="text-[14px] font-semibold text-text-primary mb-[4px]"` |
| `正文内容` | `p` | • 字号: `14px` (`t-body`)<br>• 行高: `24px` (`leading-relaxed`)<br>• 字色: `#3F4444` (`text-text-primary`)<br>• 边距: `mb-[6px]` (末尾元素 `last:mb-0`) | 无 | `className="t-body text-text-primary leading-relaxed mb-[6px]"` |
| `**加粗**` | `strong` / `b` | • 字重: `600` (`font-semibold`)<br>• 字色: `#3F4444` (`text-text-primary`) | 继承父级 | `className="font-semibold text-text-primary"` |
| `*斜体*` | `em` / `i` | • 倾斜: `italic`<br>• 字色: 继承父级 | 继承父级 | `className="italic"` |
| `~~删除~~` | `del` / `s` | • 划线: `line-through`<br>• 字色: `#8C8F8F` (`text-text-secondary`) | 继承父级 | `className="line-through text-text-secondary"` |
| `` `行内代码` `` / `==高亮==` | `code` (inline) / `<InlineHighlight>` | • 字体: `font-mono`<br>• 字号: `13px`<br>• 字色: `#830051` (`text-brand-1` 品牌酒红)<br>• 背景: `#ECECEC` (`bg-graphite-10`)<br>• 内边距: `px-[4px] py-[2px]`<br>• 行高: `leading-none mx-[2px]` (不撑高所在行) | **4px 圆角** (`rounded-[4px]`) | `className="inline-block px-[4px] py-[2px] rounded-[4px] bg-graphite-10 text-[13px] font-mono text-brand-1 leading-none mx-[2px]"` |
| `[链接](url)` | `a` / `<Hyperlink>` | • 字号: `14px` (`t-link`)<br>• 字重: `500`<br>• 字色: `#830051` (`text-brand-1`)<br>• 悬浮: 下划线 (`hover:underline`) | 无 | `className="t-link text-brand-1 hover:underline transition-all cursor-pointer"` |
| `> 引用文本` | `blockquote` / `<Blockquote>` | • **样式**: 纯粹标准正文 (`t-body text-text-primary`)，无斜体和大字号<br>• 背景: `#F8F7F7` (`bg-bg-panel`)<br>• 内边距: `pl-[12px] pr-[12px] py-[8px]`<br>• **Callout 线**: **左侧 3px 品牌色** (`border-l-[3px] border-brand-1` `#830051`) | **右侧 8px 圆角** (`rounded-r-[8px]`) | `className="border-l-[3px] border-brand-1 bg-bg-panel pl-[12px] pr-[12px] py-[8px] mb-[10px] rounded-r-[8px]"` |
| `> [!NOTE]` / `> [!TIP]` 等 | `<Callout>` (GFM Alert 扩展) | • 左侧 3px 语义彩色竖条 + 四周 1px Graphite/15 边框 (`border border-graphite-15`)<br>• 顶部 14px 专属 SVG 图标 + 13px 粗体标题<br>• 内容为 13px 正文 (`leading-[20px]`)<br>• 颜色: Note (灰), Tip (绿), Warning (黄), Caution (红) | ❌ **必须保持无圆角直角** (`rounded-none`) + 外边框 **1px Graphite/15** (`border border-graphite-15`) | 见下方 Callout 组件规范 |
| `\| 表格 \|` | `table` / `<MarkdownTable>` | • 容器: 横向滚动 (`overflow-x-auto`)<br>• 表头 `th`: `13px` (`t-table`), 浅灰底 `#F8F7F7` (`bg-bg-panel`), 不换行 (`whitespace-nowrap`)<br>• 单元格 `td`: `13px` (`t-table`), 底部边框 `border-b border-graphite-15`, 数字/状态防折行<br>• 数字排版: 推荐应用 `tabular-nums` 防抖动 | **卡片 8px 圆角** (`rounded-[8px]`) + 外边框 **1px Graphite/15** (`border border-graphite-15`) | 见下方 Table 组件规范 |
| ` ```sas ` / ` ```python ` / ` ```tsx ` (多行代码块) | `pre > code` / `<CodeBlock>` | • 顶部 Header: 32px 高度，浅灰底，**Code Panel 同款 Slash 图标** (`code-s-slash-line.svg`) + **既有标题 Token** (`.t-small-medium font-mono uppercase tracking-wider`)（注：复制按钮默认隐藏）<br>• 代码区: SAS 语言接入 `highlightSAS` 语法染色（非 SAS 语言保持等宽纯文本排版或接入 Prism/Highlight.js），字体绑定 **`.t-code-editor`** 与 `var(--font-mono)` | **卡片 8px 圆角** (`rounded-[8px]`) + 外边框 **1px Graphite/15** (`border border-graphite-15`) + 内部滚动条 `scrollbar-code` | 见下方 CodeBlock 组件规范 |
| `* 无序项` | `ul` > `li` | • 列表标志: `list-disc`<br>• 缩进: `pl-[20px]`<br>• 列表项垂直间隔: `gap-[4px]` | 无 | `ul: "list-disc pl-[20px] mb-[10px] flex flex-col gap-[4px]"`<br>`li: "t-body text-text-primary"` |
| `1. 有序项` | `ol` > `li` | • 列表标志: `list-decimal`<br>• 缩进: `pl-[20px]`<br>• 列表项垂直间隔: `gap-[4px]` | 无 | `ol: "list-decimal pl-[20px] mb-[10px] flex flex-col gap-[4px]"`<br>`li: "t-body text-text-primary"` |
| `- [x] 待办` | Task list / Checklist | • 14px 方框 (`rounded-[3px]`) + 白色 Check 图标<br>• 间距: `gap-[8px]`<br>• 文本字号: **`14px`** (`t-body text-text-primary`)，与无序/有序列表保持完全一致<br>• 已完成项添加删除线 (`line-through text-text-secondary`) | 无 | `className="flex items-center gap-[8px] t-body text-text-primary"` |
| `---` | `hr` / `<Divider>` | • 高度: `0.5px`<br>• 颜色: `#D9DADA` (`bg-border-default`)<br>• 边距: `my-[10px]` | 无 | `className="h-[0.5px] bg-border-default w-full my-[10px] border-none"` |

---

## 二、 特殊块级卡片组件封装代码 (Copy-Paste Ready)

### 1. 代码块组件 (CodeBlock)
> **设计约束**：**8px 圆角**、Header 图标与 **Code Panel 保持 100% 同款** (`code-s-slash-line.svg`)、标题严格绑定既有 Token **`.t-small-medium font-mono`** (`uppercase tracking-wider`)、复制按钮默认隐藏 (`showCopy = false`，可按需开启)、与 Code Panel 100% 相同的语法着色、代码主体字体绑定 `var(--font-mono)` 与 `.t-code-editor`。

```tsx
import React, { useState } from "react";

// SAS 词法高亮解析器 (与 Code Panel 保持完全一致)
export function highlightSAS(code: string): React.ReactNode {
  const regex = /(\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*")|('(?:[^'\\]|\\.)*')|(\b(?:proc sql|proc|sql|quit|data|run|create table|select|from|where|left join|group by|on|and|not|options|title\d|footnote\d|as|in)\b)|(%[a-zA-Z_0-9]+)|(\b(?:inds|inda|cols|col_labels|freeze_cols|page_cols|page_num|orientation|out_rtf)\b)|(\b\d+\b)/gi;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(code)) !== null) {
    if (match.index > lastIndex) {
      parts.push(code.substring(lastIndex, match.index));
    }
    const [full, comment, doubleQuoteStr, singleQuoteStr, keyword, macroCall, param, number] = match;
    const key = `${match.index}-${full}`;

    if (comment) {
      parts.push(<span key={key} className="text-[#008000] italic">{full}</span>);
    } else if (doubleQuoteStr || singleQuoteStr) {
      parts.push(<span key={key} className="text-[#A31515]">{full}</span>);
    } else if (keyword) {
      parts.push(<span key={key} className="text-[#005CC5]">{full}</span>);
    } else if (macroCall) {
      parts.push(<span key={key} className="text-[#830051]">{full}</span>);
    } else if (param) {
      parts.push(<span key={key} className="text-[#7952B3]">{full}</span>);
    } else if (number) {
      parts.push(<span key={key} className="text-[#098658]">{full}</span>);
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < code.length) {
    parts.push(code.substring(lastIndex));
  }
  return <>{parts}</>;
}

// 常用编程语言规范展示映射表
export const LANGUAGE_DISPLAY_MAP: Record<string, string> = {
  sas: "SAS",
  tsx: "TSX",
  ts: "TypeScript",
  typescript: "TypeScript",
  jsx: "JSX",
  js: "JavaScript",
  javascript: "JavaScript",
  python: "Python",
  py: "Python",
  r: "R",
  sql: "SQL",
  markdown: "Markdown",
  md: "Markdown",
  json: "JSON",
  html: "HTML",
  css: "CSS",
  bash: "Bash",
  sh: "Shell",
  yaml: "YAML",
  yml: "YAML",
  xml: "XML",
};

export function getLanguageLabel(lang?: string): string {
  if (!lang || lang.trim() === "") return "Code";
  const normalized = lang.trim().toLowerCase();
  return LANGUAGE_DISPLAY_MAP[normalized] || lang.toUpperCase();
}

export function CodeBlock({ code, language = "sas", showCopy = false }: { code: string; language?: string; showCopy?: boolean }) {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const lines = code.split('\n');
  const isSas = language?.trim().toLowerCase() === 'sas';

  return (
    <div className="relative w-full mb-[10px] rounded-[8px] border border-graphite-15 bg-bg-panel overflow-hidden">
      {/* Header bar: Code Icon + 动态语言标签 (未提供时显示 Code) */}
      <div className="flex h-[32px] items-center justify-between px-[12px] border-b border-graphite-15 bg-[#F0EFEF]">
        <div className="flex items-center gap-[6px]">
          {/* Code Panel 同款 Icon: code-s-slash-line.svg */}
          <svg className="w-[14px] h-[14px] text-text-secondary shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23 12L17.8145 17.1855L16.5182 15.889L20.4073 12L16.5182 8.11091L17.8145 6.81455L23 12ZM3.59273 12L7.48181 15.889L6.18545 17.1855L1 12L6.18545 6.81455L7.48181 8.11091L3.59273 12ZM9.97275 20.25H8.02175L14.0273 3.75H15.9782L9.97275 20.25Z" fill="currentColor"/>
          </svg>
          <span className="t-small-medium font-mono uppercase tracking-wider text-text-secondary">
            {getLanguageLabel(language)}
          </span>
        </div>
        {showCopy && (
          <button
            type="button"
            onClick={handleCopy}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] hover:bg-black/5 active:scale-[0.96] transition-colors cursor-pointer"
            title={copied ? "Copied!" : "Copy Code"}
            aria-label="Copy Code"
          >
            {/* Copy Icon: Default secondary color, Hover primary, Copied brand-1 */}
            <svg className="w-[14px] h-[14px]" viewBox="0 0 24 24" fill="none" stroke={copied ? "#830051" : isHovered ? "var(--color-text-primary)" : "var(--color-text-secondary)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
        )}
      </div>

      {/* Code body: SAS 走专用染色，其他语言保持等宽纯文本排版 (或接入 Prism) */}
      <div 
        style={{ fontFamily: 'var(--font-mono)' }}
        className="t-code-editor p-[10px] text-text-primary overflow-x-auto scrollbar-code"
      >
        {lines.map((line, idx) => (
          <div key={idx} className="whitespace-pre">
            {line.trim() === '' ? '\u00A0' : (isSas ? highlightSAS(line) : line)}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### 2. 引用组件 (Blockquote)
> **设计约束**：做简单，字体为标准正文样式，右侧 8px 圆角，左侧 Callout 竖线为 Brand-color1 (`#830051`)。

```tsx
export function Blockquote({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full">
      <blockquote className="border-l-[3px] border-brand-1 bg-bg-panel pl-[12px] pr-[12px] py-[8px] mb-[10px] rounded-r-[8px]">
        <p className="t-body text-text-primary leading-relaxed">
          {children}
        </p>
      </blockquote>
    </div>
  );
}
```

---

### 3. 提示块组件 (Callout)
> **设计约束**：**严禁加圆角 (直角风格)**，左侧 3px 语义彩色高亮条，配合对应业务状态底色与 SVG 图标。

```tsx
export type CalloutType = 'note' | 'tip' | 'warning' | 'caution';

export function Callout({ 
  type = 'note', 
  title, 
  children 
}: { 
  type?: CalloutType; 
  title?: string; 
  children: React.ReactNode 
}) {
  const configs = {
    note: {
      accentBorder: 'border-l-[#888E8E]',
      bg: 'bg-bg-panel',
      titleColor: 'text-text-primary',
      defaultTitle: 'Note',
    },
    tip: {
      accentBorder: 'border-l-[#1E7E34]',
      bg: 'bg-[#F0F9F2]',
      titleColor: 'text-[#1E7E34]',
      defaultTitle: 'Tip',
    },
    warning: {
      accentBorder: 'border-l-[#F0AB00]',
      bg: 'bg-status-warning-bg',
      titleColor: 'text-[#3F4444]',
      defaultTitle: 'Warning',
    },
    caution: {
      accentBorder: 'border-l-status-error',
      bg: 'bg-status-error-bg',
      titleColor: 'text-status-error',
      defaultTitle: 'Caution',
    },
  };
  const cfg = configs[type];

  return (
    <div className={`border border-graphite-15 ${cfg.accentBorder} border-l-[3px] ${cfg.bg} px-[12px] py-[10px] mb-[10px]`}>
      <div className="flex items-center gap-[6px] mb-[4px]">
        <span className={`text-[13px] font-semibold ${cfg.titleColor}`}>{title || cfg.defaultTitle}</span>
      </div>
      <div className="t-body text-text-primary text-[13px] leading-[20px]">
        {children}
      </div>
    </div>
  );
}
```

---

### 4. 表格组件 (MarkdownTable)
> **设计约束**：**8px 圆角**、外框 **1px Graphite/15** (`border border-graphite-15 rounded-[8px]`)，表头与单元格横向分割线使用 `border-b border-graphite-15`，表头浅灰底 `#F8F7F7` (`bg-bg-panel`)，容器横向滚动 (`overflow-x-auto`)，关键数值防折行 (`whitespace-nowrap`)。

```tsx
import React from "react";

export function MarkdownTable({ 
  headers, 
  rows 
}: { 
  headers: string[]; 
  rows: string[][]; 
}) {
  return (
    <div className="overflow-x-auto mb-[10px] border border-graphite-15 rounded-[8px]">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-graphite-15 bg-bg-panel">
            {headers.map((h, i) => (
              <th key={i} className="text-left t-table py-[8px] px-[12px] whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rIdx) => (
            <tr key={rIdx} className="border-b border-graphite-15 last:border-0">
              {row.map((cell, cIdx) => (
                <td key={cIdx} style={{ fontWeight: 400 }} className="t-table py-[8px] px-[12px] whitespace-nowrap">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## 三、 推荐的前端接入架构 (`AIMarkdown.tsx`)

使用 `react-markdown` + `remark-gfm` 时的完整 `components` 配置：

```tsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Blockquote } from './Blockquote';
import { CodeBlock } from './CodeBlock';

export const AIMarkdown: React.FC<{ content: string }> = ({ content }) => {
  return (
    <div className="markdown-stream text-text-primary text-[14px]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // 标题
          h1: ({ children }) => <h1 className="text-[16px] font-bold text-text-primary mb-[10px]">{children}</h1>,
          h2: ({ children }) => <h2 className="text-[14px] font-bold text-text-primary mb-[6px]">{children}</h2>,
          h3: ({ children }) => <h3 className="text-[14px] font-semibold text-text-primary mb-[4px]">{children}</h3>,
          
          // 正文与文本修饰
          p: ({ children }) => <p className="t-body text-text-primary leading-relaxed mb-[6px] last:mb-0">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold text-text-primary">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          del: ({ children }) => <del className="line-through text-text-secondary">{children}</del>,
          
          // 链接与引用
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="t-link text-brand-1 hover:underline transition-all cursor-pointer">
              {children}
            </a>
          ),
          blockquote: ({ children }) => <Blockquote>{children}</Blockquote>,
          
          // 列表
          ul: ({ children }) => <ul className="list-disc pl-[20px] mb-[10px] flex flex-col gap-[4px]">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-[20px] mb-[10px] flex flex-col gap-[4px]">{children}</ol>,
          li: ({ children }) => <li className="t-body text-text-primary leading-relaxed">{children}</li>,
          hr: () => <div className="h-[0.5px] bg-border-default w-full my-[10px]" />,

          // 代码：兼容 react-markdown v8/v9 的行内高亮与多行代码块
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            const lang = match ? match[1] : undefined;
            // v9 中 inline 属性可能缺省，通过是否存在换行及语言类名精准判定是否为行内代码
            const isInline = inline ?? (!match && !String(children).includes('\n'));
            if (isInline) {
              return (
                <code className="inline-block px-[4px] py-[2px] rounded-[4px] bg-[#ECECEC] text-[13px] font-mono text-[#830051] leading-none mx-[2px]">
                  {children}
                </code>
              );
            }
            return <CodeBlock code={String(children).replace(/\n$/, '')} language={lang} />;
          },

          // 表格映射：防止 Tailwind Preflight 将表格样式全部清空重置
          table: ({ children }) => (
            <div className="overflow-x-auto mb-[10px] rounded-[8px] border border-graphite-15">
              <table className="w-full border-collapse text-left">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-bg-panel border-b border-graphite-15">{children}</thead>,
          tbody: ({ children }) => <tbody className="divide-y divide-graphite-15">{children}</tbody>,
          tr: ({ children }) => <tr className="border-b border-graphite-15 last:border-0">{children}</tr>,
          th: ({ children }) => (
            <th className="px-[12px] py-[8px] text-[13px] font-medium text-text-primary whitespace-nowrap bg-bg-panel">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-[12px] py-[8px] text-[13px] text-text-primary align-top">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
```
