# ADAM Spec Upload Mode Switching Rules

本规范定义了 **ADaM Spec (Dataset Specifications) 上传卡片** 在创建事件 (Create Event) 弹窗中的配置模式切换及 Segmented Control (分段控件) 的显示逻辑。

---

## 1. 分段控件显示逻辑 (Segmented Control Visibility)

上传卡片顶部的模式切换分段控件（Segmented Control）采用**按需渲染**逻辑：

- **展示条件**：只有在满足以下两个条件时，分段控件才会被渲染在标题右侧：
  1. 上传卡片传入了 `showSegmentedControl={true}` 属性。
  2. 卡片的当前状态为 **`pending` (待上传)** 或 **`error` (上传校验失败)**。
  $$\text{showSegmented} = \text{showSegmentedControl} \land (\text{currentStatus} \in \{\text{"pending"}, \text{"error"}\})$$

- **隐藏条件**：一旦卡片状态转换为 **`uploading` (上传中)**、**`uploaded` (已上传新规格)** 或 **`use-existing` (使用已有规格)**，分段控件将自动**隐藏**，以防止用户在上传成功或上传中途误触修改配置模式。

---

## 2. 模式切换与区域渲染逻辑 (Mode Selection & Area Rendering)

分段控件包含两个选项，切换时会动态渲染卡片的 `uploadArea`（主体操作区域）：

### A. 选项 0："Upload" (上传新文件模式)
- **主体内容**：渲染标准的上传区域（虚线框、上传图标与“Upload”按钮）。
- **交互逻辑**：
  - 点击“Upload”触发模拟上传流程，状态转为 `uploading`，显示上传进度百分比。
  - 上传成功后状态变为 `uploaded`，显示文件名称与“已完成”状态勾选图标。
  - 若从 "Use Existing" 模式切换回 "Upload" 模式，系统会自动关闭并隐藏已有的文件下拉菜单 (`dropdownOpen = false`)。

### B. 选项 1："Use Existing" (选择已有文件模式)
- **主体内容**：渲染一个文件下拉选择框（Select Trigger）替代传统的拖拽上传区。
- **下拉菜单交互**：
  - 点击选择框会展开搜索框和已有文件列表（如 `sdtm_spec_v1.2.xlsx` 等选项）。
  - 支持在下拉框内对已有文件进行实时模糊搜索过滤。
  - **状态触发**：选中列表中的任一文件后，状态转换至 `use-existing`，卡片边框变实线并展示链接图标、文件名以及“已完成”勾选图标。
- **清除操作**：点击清除按钮后，卡片状态恢复至 `pending`，分段控件重新显现。
