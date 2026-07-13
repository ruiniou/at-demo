# AI Copilot Markdown 渲染标签映射指南 (For Frontend)

在 AI Copilot 面板中，AI 返回的回复是原始的 Markdown 文本。为了使渲染出来的 HTML 标签（标题、正文、列表、链接、代码等）符合我们的 UI 规范，请使用 **`react-markdown`** 的 `components` 属性进行自定义标签映射，直接套用项目中已有的全局排版类（如 `t-body`, `t-heading` 等）。

---

## 一、 标签与全局样式类映射表

| Markdown 语法 | HTML 标签 | 推荐的 Tailwind / 全局类名 | 样式说明 |
| :--- | :--- | :--- | :--- |
| `# 标题一` | `h1` | `className="t-heading text-text-primary mb-[10px]"` | 大标题 (16px, Semibold, 颜色 #3C4242) |
| `## 标题二` | `h2` | `className="t-body-medium text-text-primary mb-[8px]"` | 中标题 (14px, Medium, 颜色 #3C4242) |
| `### 标题三` | `h3` | `className="t-body-medium text-text-primary mb-[6px]"` | 小标题 (14px, Medium) |
| `正文内容` | `p` | `className="t-body text-text-primary mb-[10px] leading-relaxed"` | 段落文本 (14px, 24px行高, 颜色 #3C4242) |
| `* 列表项` | `ul` | `className="list-disc pl-[20px] mb-[10px] flex flex-col gap-[4px]"` | 无序列表容器 |
| `1. 列表项` | `ol` | `className="list-decimal pl-[20px] mb-[10px] flex flex-col gap-[4px]"` | 有序列表容器 |
| `列表子项` | `li` | `className="t-body text-text-primary leading-relaxed"` | 列表单项文本 (14px) |
| `[链接](url)` | `a` | `className="t-link hover:underline transition-all"` | 超链接 (14px, 颜色 #830051) |
| `> 引用文本` | `blockquote` | `className="border-l-[3px] border-border-default bg-bg-panel pl-[12px] py-[8px] mb-[10px] rounded-r-[4px] t-heading text-text-primary"` | 引用/提示块 |
| `---` | `hr` | `className="h-[0.5px] bg-border-default w-full my-[12px] border-none"` | 分割线 |
| ``行内代码`` | `code` (inline) | `className="bg-graphite-10 px-[4px] py-[2px] rounded-[4px] t-code text-text-primary inline-block"` | 行内高亮 (12px 等宽, 背景 #EBECEC) |

---

## 二、 React 示例代码 (`react-markdown` 接入)

可以直接在项目中封装如下 Markdown 渲染组件：

```tsx
import React from 'react';
import ReactMarkdown from 'react-markdown';

interface AIMarkdownProps {
  content: string;
}

export const AIMarkdown: React.FC<AIMarkdownProps> = ({ content }) => {
  return (
    <ReactMarkdown
      components={{
        // 1. 标题类映射
        h1: ({ children }) => (
          <h1 className="t-heading text-text-primary mb-[10px]">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="t-body-medium text-text-primary mb-[8px]">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="t-body-medium text-text-primary mb-[6px]">{children}</h3>
        ),
        
        // 2. 段落与列表映射
        p: ({ children }) => (
          <p className="t-body text-text-primary mb-[10px] leading-relaxed">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="list-disc pl-[20px] mb-[10px] flex flex-col gap-[4px]">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal pl-[20px] mb-[10px] flex flex-col gap-[4px]">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="t-body text-text-primary leading-relaxed">{children}</li>
        ),
        
        // 3. 链接与引用映射
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className="t-link hover:underline transition-all">
            {children}
          </a>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-[3px] border-border-default bg-bg-panel pl-[12px] py-[8px] mb-[10px] rounded-r-[4px] t-heading text-text-primary">
            {children}
          </blockquote>
        ),
        
        // 4. 其他辅助元素
        hr: () => (
          <hr className="h-[0.5px] bg-border-default w-full my-[12px] border-none" />
        ),
        code: ({ node, inline, className, children, ...props }: any) => {
          // 行内代码样式，多行代码块可配合 react-syntax-highlighter
          return (
            <code className="bg-graphite-10 px-[4px] py-[2px] rounded-[4px] t-code text-text-primary inline-block">
              {children}
            </code>
          );
        }
      }}
    >
      {content}
    </ReactMarkdown>
  );
};
```

---

## 三、 间距系统规范 (Spacing System)

以下是当前代码中实际使用的精确**上下垂直间距（Vertical Spacing）**。由于许多元素的设置是相同的，你可以将它们合并编写：

### 1. 消息容器与卡片垂直间距
* **对话框外层总容器 (ChatConversation)**：
  - 上下内边距：`py-[10px]`
  - 对话一轮与一轮之间的垂直间距：`gap-y-[12px]`
* **AI 回答内部组件垂直间距**：
  - 状态标签、Markdown 区、代码卡片等块级元素之间的垂直间距：`gap-y-[12px]`

### 2. Markdown 内部元素垂直边距 (已合并同类项)
在 Markdown 容器内，**几乎所有直属块级子元素**都共享相同的下边距。你可以通过通用选择器（如 `.markdown-content > *`）进行合并设置：

* **统一的下外边距 (Margin Bottom)**
  - **`mb-[10px]`**：适用于所有块级子元素，包括 **`h1` / `h2` / `h3` / `p` / `ul` / `ol` / `blockquote` / `pre`** (上外边距统一为 `0`)。

* **特例垂直间距**
  - **分割线 (`hr`)**：上下外边距为 **`my-[12px]`** (上边距 12px，下边距 12px)。
  - **列表项 (`li`)**：列表项之间的垂直间距为 **`gap-y-[4px]`**。
  - **引用块 (`blockquote`)**：额外包含上下内边距 **`py-[8px]`**。
  - **多行代码块 (`pre`)**：额外包含上下内边距 **`py-[12px]`**。




