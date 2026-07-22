# Atlas Design System & Implementation Guide

## Overview
This document defines the UI infrastructure, design tokens, and global layout rules for the Atlas Design System. It serves as the single source of truth for visual consistency and optical alignment across components.

## Design Tokens

### Color Tokens
| Name | Hex | Usage |
| :--- | :--- | :--- |
| `brand-color-1` | `#830051` | Primary CTA background, Tags/Chips text, Link text, Accent icons |
| `AZ-secondary` | `#F4E8EE` | Tag background, Active selection background |
| `text-primary` | `#3C4242` | Headings, Paragraphs, Table body text |
| `text-secondary`| `#888E8E` | Secondary text, Status labels, Line numbers, Metadata |
| `graphite/10`  | `#EBECEC` | Inline highlight background, Icon button hover state |
| `bg-light`     | `#F8F7F7` | Panel background, Card hover, Code block background |
| `border-default`| `#D8DADA` | Component borders, Dividers, Table borders, Blockquote border |
| `status-error` | `#CC2C3C` | Error message text and border |
| `status-success`| `#1E7E34` | Diff addition text and border |

### Typography Tokens
*All general UI elements use **PingFang SC** font; code elements use **Menlo** font.*
*Note: Hardcoded `color` properties are removed from non-constant typography token CSS classes to enable clean overriding via Tailwind CSS classes (e.g. `text-secondary` for gray text, `status-error` for red warnings).*

| Token | Size | Weight | Line-Height | Default / Expected Color | Font | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `heading` | 16px | 600 | 22px | `#3C4242` | PingFang SC | Section titles, H1-H4 |
| `body` | 14px | 400 | 24px | `#3C4242` | PingFang SC | Body paragraphs, content bubbles |
| `body-secondary`| 14px | 400 | 20px | `#888E8E` | PingFang SC | Status label, secondary info |
| `body-compact` | 14px | 400 | 18px | `#3C4242` | PingFang SC | Tool name, Code diff lines metadata, Header label |
| `body-accent` | 14px | 500 | 24px | `#3C4242` | PingFang SC | Pending changes, Bold details |
| `caption` | 13px | 400 | 20px | Variable | PingFang SC | Inline tags, status details |
| `small` | 12px | 400 | 16px | Variable | PingFang SC | CTA Button text, Tag/Chip |
| `link` | 14px | 500 | 24px | `#830051` | PingFang SC | Markdown hyperlinks |
| `table` | 13px | 400 | 16px | `#3C4242` | PingFang SC | 表格正文（表头 weight: 500） |
| `input` | 14px | 400 | 24px | `#3C4242` | PingFang SC | Input box text |
| `code` | 13px | 400 | 1.25 | `#3C4242` | Menlo | Code block lines, Diff lines |

---

## Layout & Spacing

### Container Rules
- **Container Width**: Flexible content container sizing.
- **Content Padding**: Text content wraps with standard internal padding (`px-[10px]`).
- **Global Padding**: Main layout area uses `10px` gap between discrete content blocks.

### Vertical Spacing Spec
| Adjacent Relationship | Token | Value |
| :--- | :--- | :--- |
| Text Block → Text Block | `textBlockSpacing` | 8px |
| Text Block → Component Block | `componentSpacing` | 12px |
| Component Block → Text Block | `componentSpacing` | 12px |
| Component Block → Component Block | `componentSpacing` | 12px |

### Scrollbar Spec
- **Dimensions**: Thumb width/height `6px`, border-radius `8px`.
- **Track**: Vertical track width `10px`, Horizontal track height `10px`.
- **Width Occupation**: Scrollbar does **not** affect main container width (uses transparent border with `background-clip: content-box` to maintain stable layout).
- **Colors**:
  - *Default (Light/White bg)*: Thumb `#D8DADA` (`graphite/20`), Hover `#B2B4B4` (`graphite/40`).
  - *Colored Container (e.g. active states)*: Thumb `#E6CCDC` (`mulberry/20`), Hover `#CC99B9` (`purple/40`). Applies via `.scrollbar-colored` utility class.

---

## Markdown Rendering Spec

| Element | Token | Spacing | Special Rules |
| :--- | :--- | :--- | :--- |
| **Heading** | `heading` | `mb-10` | Section titles |
| **Paragraph**| `body` | `mb-10` | Supports inline highlights |
| **Link** | `link` | - | Underline on hover |
| **List** | `body` | `mb-10` | Bullet lists using `list-disc` and `pl-24` |
| **Quote** | `body` | `mb-10` | Border-left 3px `#D8DADA`, bg `#FAFAFA`, text `#3C4242` (no italics) |
| **Divider** | - | `my-12` | Height 0.5px, Color `#D8DADA` |
| **Code Block**| `code` | `mb-10` | Border `#D8DADA`, Rounded 4px, bg `#F8F7F7` |

### Table Special Rules
- **Default**: Text MUST wrap (`whitespace-normal`), no `...` truncation.
- **No-wrap Exceptions**: Numbers, Date/Time, Status (✓/Failed), IDs (AZ-123), Code snippets, Paths, Tags.
- **Overflow**: Horizontal scroll enabled (`overflow-x-auto`).
- **Header**: Short labels preferred; forced single-line (`whitespace-nowrap`).

