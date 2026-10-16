# Wayfarer Supply 分模块开发计划

**依据：** [PRD](./PRD.md) · [UI 设计](./UI-DESIGN.md) · [技术设计](./TECHNICAL-DESIGN.md)
**开发策略：** 按模块串行推进；每个模块实现后做最小针对性验证，通过后单独 commit，再开始下一模块。按快速迭代要求，不重复执行完整浏览器矩阵或独立 TypeScript 检查。

**执行状态：** 模块 0–4 已完成；各模块按下方门槛构建、冒烟验证并独立提交。线上部署和真实支付不在本轮范围。

## 1. 执行规则

1. 每个模块开始前确认上一模块已通过验证并已提交。
2. 只在当前模块涉及的文件和行为范围内修改；如发现前序模块问题，先修复并重新验证。
3. 每个模块只执行一次 `npm run build`（其中包含 TypeScript 检查）；只对该模块新增的关键交互做一次简短冒烟，不重复跑完整视口矩阵。
4. 构建或关键冒烟失败时留在当前模块修复，不提交失败版本，也不进入下一模块。
5. 每个通过的模块单独提交；commit message 说明完成的功能范围。
6. 不推送远端、不部署线上，除非后续另行要求。

## 2. 模块顺序与提交门槛

### 模块 0：项目基座

**范围**

- Vite + React + TypeScript 初始化，严格类型配置和 `@/*` 路径别名。
- Tailwind CSS 与 shadcn/ui 初始化；加入 Button、Input、Dialog、Sheet、Badge、Select、Separator、Toast 等基础组件。
- 建立基础目录、应用入口、README 启动命令。

**验证门槛**

- `npm run build` 成功生成 `dist/`（包含 TypeScript 检查）。
- 首次启动的本地开发服务器已加载并显示 Vite 基础页面。

**提交**：`chore: scaffold React storefront foundation`

### 模块 1：视觉系统与页面骨架

**范围**

- 建立深色霓虹 CSS tokens、全站背景网格、响应式容器和字体层级。
- 实现 SiteHeader、HeroSection、品类入口占位、精选/商品区骨架和 Footer。
- 建立英语/简体中文文案字典和语言切换控件。
- 动态背景响应 `prefers-reduced-motion`。

**验证门槛**

- `npm run build` 成功。
- 在浏览器简短检查语言切换和减少动态效果开关；完整断点检查留到模块 4。

**提交**：`feat(ui): add neon shell and bilingual navigation`

### 模块 2：商品目录与发现

**范围**

- 建立 Product / Category 类型及 8–10 件双语模拟商品数据，覆盖至少 4 个类目，目标覆盖 5 类。
- 实现 CategoryExplorer、商品卡片、搜索、类目筛选和空结果状态。
- 实现排序（若时间受限可放到 P1，不阻塞模块提交）。

**验证门槛**

- `npm run build` 成功。
- 浏览器做一次搜索 + 类目筛选冒烟，确认结果列表会更新；其余语言/空结果/图片失败场景在最终验收抽查。

**提交**：`feat(catalog): add bilingual product discovery`

### 模块 3：商品详情与购物车

**范围**

- 实现商品详情 Dialog、数量控件、购物车 reducer/actions、加购反馈。
- 实现 CartSheet、数量增减、删除、空状态、商品总件数和小计。
- 不提供真实支付流程；演示结账提示需明确不可付款，或不显示结账按钮。

**验证门槛**

- `npm run build` 成功。
- 浏览器走一次加购 → 数量调整 → 删除的购物车冒烟，并核对小计；其它关闭/焦点行为并入最终验收抽查。

**提交**：`feat(cart): complete product detail and cart flow`

### 模块 4：响应式收尾、持久化与最终验收

**范围**

- 处理移动端详情/购物车全屏布局、动态网格与关键动作动画、图片 fallback。
- 以 `localStorage` 保存 locale/cart（P1），加入损坏数据和不可用存储 fallback。
- 收尾 README、已知问题及最终验收说明。

**验证门槛**

- `npm run build` 成功。
- 最终只做一次集成冒烟：搜索/筛选 → 打开详情/加购 → 调整购物车 → 切换语言；抽查手机宽度与减少动态效果模式。
- 若有持久化，再在该流程中刷新一次确认状态恢复；不单独重复全视口或存储异常测试。

**提交**：`feat: finalize responsive and persisted storefront experience`

## 3. 模块间依赖

```mermaid
flowchart LR
  M0[0 项目基座] --> M1[1 视觉与页面骨架]
  M1 --> M2[2 商品目录与发现]
  M2 --> M3[3 商品详情与购物车]
  M3 --> M4[4 响应式/持久化/最终验收]
```

## 4. 验证命令约定

在 `package.json` 提供以下脚本，模块门槛使用同一套命令：

```json
{
  "scripts": {
    "dev": "vite",
    "typecheck": "tsc -b",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  }
}
```

手工浏览器验证是补充而非替代 TypeScript 检查和构建。若需新增自动化测试，将只为已明确的业务纯函数/交互回归增加最小覆盖，并在相应模块的验证门槛中记录结果。

## 5. 风险与处理

- **shadcn 初始化/依赖下载耗时：** 优先按官方 Vite + React TS 路径初始化，只加入实际使用的组件。
- **动效影响性能或可读性：** CSS 优先，减少大面积 blur；商品图和文本置于稳定表面层，并实现减少动态效果模式。
- **模块验证失败：** 修复当前模块并重新执行全部门槛；不提前开发后续模块。
- **提交失败或缺少 Git 身份：** 停在当前已验证模块，说明阻塞原因，不以未提交状态开始下一模块。
