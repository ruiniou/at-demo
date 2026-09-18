# Project/Study管理页面：访问权限

功能群组: A-权限与协作基础
状态: 未开始
预估工作量(天): 1.0

访问权限：
仅 Admin 和 Study Owner 可访问 Project / Study 管理页面。

- Admin 可查看和管理全部 Project 及其 Study。
- Study Owner 仅可查看及操作自己负责的 Study；可查看该 Study 所属 Project 的基本信息，但不可查看或操作该 Project 下其他 Study。

Project 管理：

- Admin 可创建 Project。
- 创建 Project 时，系统通过 LSAF 接口查询已有 Project 及相关信息。
- 系统保存 LSAF 返回的 Project 唯一标识，并基于该标识实时获取并展示 Project Name 等信息。
- 系统应避免重复创建同一 LSAF Project。
- Admin 可禁用或重新启用 Project。

Study 管理：

- Admin 可在指定 Project 下创建 Study。
- 创建 Study 时，系统通过 LSAF 接口查询该 Project 下已有的 Study 及相关信息。
- 系统保存 LSAF 返回的 Study 唯一标识，并基于该标识实时获取并展示 Study Name、TA 等信息。
- 系统应校验 Study 与 Project 的隶属关系，并避免重复创建同一 LSAF Study。
- Admin 可禁用或重新启用 Study。

Study Owner 维护：
Admin 与该 Study 的 Study Owner 均可维护该 Study 的 Owner 信息。

- 每个 Study 仅允许配置一个 Study Owner。
- Study Owner 必须为平台中已存在且有效的用户。
- Owner 邮箱支持通过接口搜索、选择并保存。
- Owner 变更后，权限应立即按最新配置生效。

禁用与重新启用规则：
禁用或重新启用 Project / Study 不影响已创建的 Event。

- 禁用 Project 后：
    - 该 Project 下所有 Study 均视为禁用；
    - 相关 Study Owner 不可创建新的 Event；
    - Admin 不可在该 Project 下新增 Study；
    - 不展示其下属 Study 的“Disable”“Enable”操作；
    - Admin 与各 Study Owner 仍可维护 Study Owner 信息。
- 重新启用 Project 后：
    - 其下属未被单独禁用的 Study 恢复可用；
    - 对于仍处于禁用状态的 Study，需由 Admin 单独重新启用；
    - 可恢复创建 Study 和新 Event 的权限。
- 禁用 Study 后：
    - 该 Study 的 Study Owner 不可创建新的 Event；
    - Admin 与该 Study Owner 仍可维护 Study Owner 信息。
- 重新启用 Study 后：
    - 该 Study 的 Study Owner 恢复创建新 Event 的权限。