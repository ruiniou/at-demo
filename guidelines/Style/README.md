# Atlas Design System - Style Guide

## Overview
This document defines the UI infrastructure and design tokens for the Atlas Design System. It serves as a single source of truth for component styles.

## Design Tokens

### Color Tokens
| Name | Hex | Usage |
| :--- | :--- | :--- |
| `brand-color1` | `#830051` | Primary CTA background, Tags text, Blockquote border/text, Check icons |
| `AZ-secondary` | `#F4E8EE` | Tag background, Blockquote background |
| `text-primary` | `#3C4242` | Headings, Paragraphs, Table body text |
| `text-secondary`| `#888E8E` | Secondary text, Status labels, Line numbers, Metadata |
| `graphite/10`  | `#EBECEC` | Inline highlight background, Icon button hover state |
| `bg-light`     | `#F8F7F7` | Panel background, Card hover, Code block background |
| `border-default`| `#D8DADA` | Component borders, Dividers, Table borders |
| `status-error` | `#CC2C3C` | Error message text and border |
| `status-success`| `#1E7E34` | Diff addition text and border |

### Typography Tokens
| Token | Size | Weight | Line-Height | Color | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `Heading 1` | 16px | 600 | 22px | `#3C4242` | Section titles |
| `Body (Primary)` | 14px | 400 | 24px | `#3C4242` | Standard paragraphs, lists |
| `Body (Secondary)`| 14px | 400 | 24px | `#888E8E` | Secondary text |
| `Caption`   | 13px | 400 | 20px | Variable | Tags, Tool names, Status text |
| `Code`      | 13px | 400 | 125% | `#3C4242` | Code blocks, Diff content (Font: Menlo) |

## Layout & Spacing

### Container Rules
- **Content Container**: Flexible padding and width rules.
- **Global Padding**: Layout uses standard gap rules between discrete message blocks.

### Vertical Spacing
| Scenario | Spacing | Rule |
| :--- | :--- | :--- |
| Between Sections | 12px | Gap between major layout sections |
| Inside Card | 12px | Gap between Status, Content, and Component cards |
| Inside Markdown | 10px | Margin-bottom for paragraphs, tables, and blocks |

## Markdown Rendering Spec

| Element | Token | Spacing | Special Rules |
| :--- | :--- | :--- | :--- |
| **Heading** | `Heading 1` | `mb-10` | Only H1 and H3 supported |
| **Paragraph**| `Body (Primary)` | `mb-10` | Supports inline highlights |
| **Link** | `Body (Primary)` | - | Color: `#830051`, Underline on hover |
| **List** | `Body (Primary)` | `mb-10` | `list-disc`, `pl-24` |
| **Quote** | `Body (Primary)` | `mb-10` | Border-left 3px `#830051`, Bg `#F4E8EE`, Color `#830051` |
| **Divider** | - | `my-12` | Height 0.5px, Color `#D8DADA` |
| **Code Block**| `Code` | `mb-10` | Border `#D8DADA`, Rounded 4px, Bg `#F8F7F7`, Syntax highlighting |

### Table Special Rules
- **Default**: Text MUST wrap (`whitespace-normal`), no `...` truncation.
- **No-wrap Exceptions**: Numbers, Date/Time, Status (✓/Failed), IDs (AZ-123), Code snippets, Paths, Tags.
- **Overflow**: Horizontal scroll enabled (`overflow-x-auto`).
- **Header**: Short labels preferred; forced single-line (`whitespace-nowrap`).

## Key UI Components

| Component | Token | Size / Height | States |
| :--- | :--- | :--- | :--- |
| `Status Label` | `Caption` | 36px (Height) | Spinning icon + text |
| `Tool Call Card`| `Caption` | - | Hover: `bg-[#F8F7F7]` |
| `CTA Button` | `Caption` | 28px (Height) | Primary (Brand), Secondary (White/Border) |
| `Icon Button` | - | 24x24px | Hover: `bg-[#EBECEC]` |
| `Tag / Chip` | `Caption` | 20px (Height) | Rounded 4px, Left padding 2px, Right 6px |
| `Code Diff` | `Code` | - | Collapsed by default; Line numbers `#888E8E` |

