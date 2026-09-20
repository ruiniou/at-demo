# Switch

统一入口：`src/components/ui/Switch.tsx`。底层使用 Ant Design Switch，并通过 Atlas Design Token 定制。

- 默认尺寸为 28 × 16px，圆形 handle 为 12px。
- checked 使用 `brand-1`；hover 使用 `brand-1-hover`。
- unchecked 使用 `graphite-50`；disabled unchecked 使用 `graphite-20`。
- 必须提供 `ariaLabel`，描述被切换对象和属性。
- Switch 用于切换后即时生效的二元状态；需要表单提交确认的布尔选择使用 Checkbox。
- 与状态文案组合时，Available 使用 `text-primary`，Disabled 使用 `text-secondary`。
- 必须覆盖 checked、unchecked、hover、focus、disabled；异步提交时可使用 loading。
