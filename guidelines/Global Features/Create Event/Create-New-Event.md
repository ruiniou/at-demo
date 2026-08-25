# Create New Event Functionality Specification

本文档定义了“创建新事件 (Create New Event)”弹窗的交互规范、布局设计、组件组成及特殊异常处理流程。

---

## 1. 页面布局 (Page Layout)

创建新事件 (Create New Event) 弹窗采用左右分栏布局：

- **左侧区域（表单填写区）**：
  - 放置事件创建所需的各种必填及选填表单字段。
  - 必填项包括：Therapeutic Area (治疗领域)、Project Code (项目编码)、Study Code (研究编码)、Event Name (事件名称) 及 O_GEM Version (系统版本)。
  - 包含一个折叠展开控件 **Optional (选填项)**，**默认处于展开状态**。
- **右侧区域（上传区）**：
  - 放置各类规范文件的上传卡片 (Upload Cards)
- **弹窗尺寸**：
  - 高度设为 `740px`。

---

## 2. 组件组成 (Components)

### A. 字段填写组件 (Form Fields)
- **Input Field (输入框)**：如 Event Name、Program Path，支持占位符提示、必填星号标示及标准状态（Default, Focused）。
- **Dropdown (单选下拉选择框)**：如 Therapeutic Area, Reference Study, Reference Event, O_GEM Version。
- **MultiSelectDropdown (多选下拉选择框)**：
  - 应用于 Project Code, Study Code 以及 Tables to parse。
  - **标签折叠机制**：当用户选择的选项多于 3 个时，仅渲染前 3 个选中的 Tag，并在其后追加一个无背景色的文本按钮 `+N more...`。
  - **展开/收起交互**：用户点击 `+N more...` 时就地展开显示所有标签，尾部按钮文案变为 `Show less`；点击 `Show less` 收回。点击折叠标签时阻止事件冒泡，不触发下拉列表的开闭。
  - **超出最大宽度省略与 Tooltip**：单/多选下拉框的标签与文本设定了适应其外在容器的最大宽度（`calc(100% - 24px)`）。当标签/文本超出该宽度时以省略号（...）截断，并在鼠标悬浮 (Hover) 时通过 Tooltip 显示完整的名称。

### B. 上传卡片组件 (Upload Cards)
- 每个上传卡片拥有三种或以上状态：待上传 (Pending)、上传中 (Uploading)、已上传 (Uploaded)、失败 (Error)。

---

## 3. ADaM 校验与模式切换规则 (ADaM Spec Upload Mode Switching)

### 3.1 分段控件显示逻辑 (Segmented Control Visibility)
上传卡片顶部的模式切换分段控件（Segmented Control）采用**按需渲染**逻辑：
- **展示条件**：只有在满足以下两个条件时，分段控件才会被渲染在标题右侧：
  1. 上传卡片传入了 `showSegmentedControl={true}` 属性。
  2. 卡片的当前状态为 **`pending` (待上传)** 或 **`error` (上传校验失败)**。
  $$\text{showSegmented} = \text{showSegmentedControl} \land (\text{currentStatus} \in \{\text{"pending"}, \text{"error"}\})$$
- **隐藏条件**：一旦卡片状态转换为 **`uploading` (上传中)**、**`uploaded` (已上传新规格)** 或 **`use-existing` (使用已有规格)**，分段控件将自动**隐藏**，以防止用户在上传成功或上传中途误触修改配置模式。

### 3.2 模式切换与区域渲染逻辑 (Mode Selection & Area Rendering)
分段控件包含两个选项，切换时会动态渲染卡片的 `uploadArea`（主体操作区域）：
- **选项 0："Upload" (上传新文件模式)**：
- **选项 1："Use Existing" (选择已有文件模式)**：
  - 主体内容：渲染一个文件下拉选择框（Select Trigger）替代传统的拖拽上传区。
  - 下拉菜单交互：
    - 点击选择框会展开搜索框和已有文件列表（如 `sdtm_spec_v1.2.xlsx` 等）。
  - 清除操作：点击清除按钮后，卡片状态恢复至 `pending`，分段控件重新显现。

---

## 4. 特殊异常流程 (Special Cases & Error Handling)
详见Figma设计稿。
改进项	新增
ADaM 校验失败	Modal-上传卡片报错态
Shell 解析失败）	Modal-上传卡片报错态
	首页-卡片失败态
	详情页-Treelist: Event和单个失败条目-Error status
	详情页-面板：Error 占位+引导重传