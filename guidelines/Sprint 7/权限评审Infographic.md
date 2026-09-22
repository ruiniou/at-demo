# ATLAS 权限与关键流程

> 客户设计评审速览 · 2026-09-21  
> `Admin` 是固定系统角色；其余权限来自用户与具体 Study、Event 或 Output 的关系。权限可叠加。

## 1. 权限关系

```mermaid
flowchart LR
    A[Admin<br/>系统管理] -->|创建 Project / Study<br/>指定 Study Owner| B[Study Owner<br/>负责指定 Study]
    B -->|创建 Event<br/>指定或转移 Owner| C[Event Owner<br/>负责指定 Event]
    C -->|维护 Team<br/>分配 Output| D[Event Team Member<br/>参与指定 Event]
    D -->|接手或获派 Output| E[Output Assignee<br/>负责指定 Output]

    classDef primary fill:#F4E8EE,stroke:#830051,color:#3C4242,stroke-width:1.5px;
    classDef relation fill:#FFFFFF,stroke:#B8BCBC,color:#3C4242,stroke-width:1px;
    class A primary;
    class B,C,D,E relation;
```

权限按对象范围生效，同一用户拥有多种关系时取权限并集。

## 2. 权限矩阵

| Capability | Admin | Study Owner | Event Owner | Team Member | Output Assignee |
|---|---|---|---|---|---|
| Create Project / Study | Allowed | Not granted | Not granted | Not granted | Not granted |
| Change Study Owner | Allowed | Own Study | Not granted | Not granted | Not granted |
| Create Event | Not granted | Own Study | Not granted | Not granted | Not granted |
| Change Event Owner | Not granted | Own Study | Own Event | Not granted | Not granted |
| Edit / delete Event | Not granted | Not granted | Own Event | Not granted | Not granted |
| Add Team Member | Not granted | If member | If member | Allowed | If member |
| Remove Team Member | Not granted | Not granted | Own Event | Not granted | Not granted |
| Assign Output to others | Not granted | Not granted | Own Event | Not granted | Not granted |
| Assign Output to self | Not granted | If member | If member | Available Output | Available Output |
| Edit Output / use TFL Copilot | Not granted | If assigned | If assigned | If assigned | Assigned Output |
| Use Event Copilot / download | Not granted | If member | Allowed | Allowed | Allowed |
| View Event basics | Allowed | Allowed | Allowed | Allowed | Allowed |

**Legend**

- **Allowed**：该身份直接获得权限。
- **Own / Assigned / If member**：仅在对应对象关系成立时允许。
- **Not granted**：该身份本身不赋予此权限，用户可能通过其他关系获得。

## 3. 关键用户流程

### A. 建立 Project 与 Study

```mermaid
flowchart LR
    A[Admin creates Project] --> B[Admin creates Study]
    B --> C[Assign Study Owner]
    C --> D[Study available for Event creation]

    classDef action fill:#F4E8EE,stroke:#830051,color:#3C4242;
    classDef result fill:#FFFFFF,stroke:#B8BCBC,color:#3C4242;
    class A,B,C action;
    class D result;
```

### B. 创建 Event 与团队

```mermaid
flowchart LR
    A[Study Owner creates Event] --> B[Initial Event Owner assigned]
    B --> C[Event Owner adds Team Members]
    C --> D[Event Owner assigns Outputs]
    D --> E[Team starts Event work]

    T[Initial Owner rule<br/>TBD]
    B -.-> T

    classDef action fill:#F4E8EE,stroke:#830051,color:#3C4242;
    classDef result fill:#FFFFFF,stroke:#B8BCBC,color:#3C4242;
    classDef tbd fill:#FFF8E6,stroke:#C58A00,color:#3C4242,stroke-dasharray:4 3;
    class A,B,C,D action;
    class E result;
    class T tbd;
```

### C. 执行与协作

```mermaid
flowchart LR
    A[Team Member opens Event] --> B{Output assigned?}
    B -->|No| C[Assign to me]
    B -->|Yes| D[Open assigned Output]
    C --> D
    D --> E[Edit or use TFL Copilot]
    E --> F[Review Code Patch]
    F --> G[Accept and save]

    classDef action fill:#F4E8EE,stroke:#830051,color:#3C4242;
    classDef decision fill:#FFFFFF,stroke:#830051,color:#3C4242;
    classDef result fill:#FFFFFF,stroke:#B8BCBC,color:#3C4242;
    class A,C,D,E,F action;
    class B decision;
    class G result;
```

## 4. 客户需确认

| TBD | 当前 Demo 口径 |
|---|---|
| Event 初始 Owner | 创建 Event 的 Study Owner 自动成为 Owner |
| Owner 转移后的旧 Owner | 保留为普通 Event Team Member |
| Disabled Project / Study | 阻止新建，已有 Event 的可操作范围待确认 |
| Event Owner 账号失效 | 由 Study Owner 更换；提醒与限制方式待确认 |

