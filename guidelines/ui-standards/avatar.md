# Avatar

统一入口：`src/components/ui/Avatar.tsx`，提供 Avatar 和 AvatarGroup。

| 所处层级 | level | 直径 | 字号 |
| --- | --- | --- | --- |
| 页面正文、账户入口 | page | 24px | 10px |
| Modal 正文、表格 | modal | 20px | 9px |
| 菜单选项、筛选标签 | menu | 20px | 9px |

按头像直接所处的容器选择层级：Modal 内的菜单使用 menu。筛选标签使用 menu 紧凑尺寸，避免改变控件高度。

- 圆形、纯色背景、白色 Medium 大写缩写，水平和垂直居中。
- 普通头像无 stroke、外环、阴影，不允许各页面自行添加尺寸变体。
- 已知用户统一从 AVATAR_IDENTITIES 读取颜色和缩写，颜色不表示权限、角色或业务状态。
- 新用户可提供 color / initials；缺省使用 text-secondary 背景。多词姓名取首尾词首字母，单词姓名取前两个字符。
- 无 name 时显示 No Assignee 图形；disabled 使用 50% 透明度，不加背景容器。
- Owner / You 作为独立标签，不更改头像样式。
- AvatarGroup 默认使用 modal 层级，最多显示 5 人，重叠 6px，以 2px 白色外环分隔，无阴影。
- 超出人数显示 +N，使用 bg-panel 填充和 text-secondary 文字。
- 头像具有姓名的可访问标签和 title；头像本身不承担按钮行为。

成员下拉选项通常为 32px 高（20px 头像 + 上下各 6px 留白），使用 flex 居中；带 1px 边框的快捷选项使用上下各 5px 留白。选中、未选中和禁用项保持同样高度。
