# 告别 Django Admin！这个 NodeJS 全栈框架让你在 DTO 中直接配置 Table/Form 渲染

## 一、CRUD 页面的重复劳动，该结束了

做中后台的同学一定不陌生这个流程：建一张表，然后写列表页、搜索栏、新建表单、编辑表单、详情页……几乎每个字段都要在前端和后端各写一遍——后端定义字段类型和校验规则，前端再对应写一遍表格列、表单控件、搜索条件。

Django Admin 的出现缓解了这个问题，它能根据 Model 自动生成增删改查页面。但代价也不小：服务端模板渲染、前端技术栈老旧、界面定制困难、不支持 SSR。

如果能在定义数据结构的同时，直接声明这个字段在表格里怎么显示、在表单里用什么控件，岂不是一步到位？

VonaJS 做的就是这件事。

## 二、VonaJS 是什么

VonaJS 是一款全栈框架，支持在同一个代码库中构建 SSR/SPA/Web 网站/Admin 中后台。它的核心能力有两点：

- **DTO 动态推断与生成**：基于 Zod4 的统一 Schema，一份定义同时用于参数校验、OpenAPI 文档生成、Table/Form 渲染、数据序列化与脱敏
- **CRUD 动态渲染**：根据 DTO 中声明的渲染元数据，自动生成列表页、条目页、搜索表单，底层基于 Tanstack Table / Tanstack Form / Tanstack Query 的最佳实践

技术栈方面，后端是 Koa + Knex + Zod4 + Redis，前端是 Vue3 + Vite8 + Tanstack 全家桶，UI 层可搭配 Daisyui/Tailwindcss/Quasar/Vuetify。

一句话：**用 DTO 驱动 CRUD 渲染，让中后台开发从"写页面"变成"配字段"。**

## 三、Entity：字段渲染的起点

VonaJS 的渲染配置从 Entity 开始。每个字段的渲染元数据直接写在字段定义旁边，一目了然：

```tsx
@Entity<IEntityOptionsStudent>('demoStudent', {
  openapi: { title: $locale('Student') },
  fields: {
    id: $makeMetadata(ZovaRender.order(1, 'core')),
    iid: $makeMetadata(ZovaRender.visible(false)),
    deleted: $makeMetadata(ZovaRender.visible(false)),
    createdAt: $makeMetadata(
      ZovaRender.order(-2, 'max'),
      ZovaRender.field('basic-date:formFieldDate'),
      ZovaRender.cell('basic-date:date'),
    ),
    updatedAt: $makeMetadata(
      ZovaRender.order(-1, 'max'),
      ZovaRender.field('basic-date:formFieldDate'),
      ZovaRender.cell('basic-date:date'),
    ),
  },
})
export class EntityStudent extends EntityBase {
  @Api.field(
    v.title($locale('Name')),
    v.required(),
    v.min(2),
    ZovaRender.order(1),
    ZovaRender.cell('basic-table:actionView'),
  )
  name: string;

  @Api.field(
    v.title($locale('Description')),
    v.optional(),
    ZovaRender.order(2),
    ZovaRender.field('basic-select:formFieldSelect', {
      placeholder: 'Please Select',
      items: [
        { title: 'Male', value: 1 },
        { title: 'Female', value: 2 },
      ],
    }),
    ZovaRender.cell('basic-select:select', {
      items: [
        { title: 'Male', value: 1 },
        { title: 'Female', value: 2 },
      ],
    }),
  )
  description?: string;
}
```

逐行看关键的渲染配置：

| 配置                                                      | 含义                                   |
| --------------------------------------------------------- | -------------------------------------- |
| `ZovaRender.order(1)`                                     | 字段排在第 1 位                        |
| `ZovaRender.visible(false)`                               | 隐藏该字段（不渲染）                   |
| `ZovaRender.cell('basic-table:actionView')`               | 表格中渲染为可点击查看的链接           |
| `ZovaRender.cell('basic-date:date')`                      | 表格中渲染为日期格式                   |
| `ZovaRender.field('basic-select:formFieldSelect', {...})` | 表单中渲染为下拉选择框，并传入选项数据 |
| `ZovaRender.field('basic-date:formFieldDate')`            | 表单中渲染为日期选择器                 |

核心思路：**渲染配置紧跟字段定义，改一个字段时校验规则和渲染行为一起调整，不用再去前端组件里翻找对应位置。**

`ZovaRender.cell()` 控制表格列怎么显示，`ZovaRender.field()` 控制表单用什么控件。配置格式统一为 `模块名:组件名`，并可通过第二个参数传入组件 props，比如下拉框的选项列表、class、style 等。

## 四、DTO 组装页面：声明式定义页面结构

Entity 定义了字段级的渲染元数据，DTO 则负责把这些字段组装成完整的页面。**一个 DTO 就是一个页面**，页面结构通过 blocks 声明式定义。

### 1. 列表页

```tsx
@Dto<IDtoOptionsStudentSelectResItem>({
  blocks: [
    ZovaRender.block('basic-page:blockPage', {
      blocks: [
        ZovaRender.block('basic-page:blockFilter'),
        ZovaRender.block('basic-page:blockToolbarBulk', {
          actions: [ZovaRender.tableActionBulk('basic-table:actionCreate')],
        }),
        ZovaRender.block('basic-page:blockTable'),
        ZovaRender.block('basic-page:blockPager'),
      ],
    }),
  ],
})
export class DtoStudentSelectResItem extends $Dto.get(() => ModelStudent) {
  @Api.field(
    v.title($locale('Operations')),
    ZovaRender.order(1, 'max'),
    ZovaRender.cell('basic-table:actionOperationsRow', {
      actions: [
        ZovaRender.tableActionRow('basic-table:actionUpdate'),
        ZovaRender.tableActionRow('basic-table:actionDelete'),
      ],
    }),
  )
  _operationsRow?: unknown;
}
```

这个列表页由四个 block 组成：**搜索区 → 批量操作栏 → 数据表格 → 分页器**，从上到下依次排列。操作栏里放了一个"新建"按钮，表格行末尾自动追加"编辑"和"删除"操作列。

DTO 继承自 `$Dto.get(() => ModelStudent)`，这意味着列表的字段直接从 Model（进而从 Entity）继承，不需要重复定义。

### 2. 搜索条件

```tsx
@Dto<IDtoOptionsStudentSelectReq>({
  openapi: { filter: { table: 'demoStudent' } },
  fields: {
    name: $makeSchema(v.optional(), z.string()),
    createdAt: $makeSchema(
      ZovaRender.field('basic-date:formFieldDateRange'),
      v.filterTransform('a-web:dateRange'),
      v.optional(),
      z.string(),
    ),
  },
})
export class DtoStudentSelectReq extends $Dto.queryPage(EntityStudent, ['name', 'createdAt']) {}
```

搜索条件的 DTO 独立于列表数据。这里 `name` 是普通文本搜索，`createdAt` 渲染为日期范围选择器（`formFieldDateRange`），并通过 `v.filterTransform` 自动将前端选择的日期范围转换为后端查询格式。

### 3. 新建/编辑页

```tsx
@Dto<IDtoOptionsStudentCreate>({
  blocks: [
    ZovaRender.block('basic-pageentry:blockPageEntry', {
      blocks: [
        ZovaRender.block('basic-pageentry:blockForm'),
        ZovaRender.block('basic-pageentry:blockToolbarRow', {
          actions: [
            ZovaRender.formActionRow('basic-form:actionSubmit', {
              permission: { actionInherit: 'update', formScene: ['create', 'edit'] },
            }),
            ZovaRender.formActionRow('basic-form:actionBack', { permission: { public: true } }),
          ],
        }),
      ],
    }),
  ],
})
export class DtoStudentCreate extends $Dto.create(() => ModelStudent) {}
```

新建页和编辑页结构相同：**表单区 + 操作栏（提交/返回）**。`$Dto.create` 和 `$Dto.update` 分别继承自 Model，自动带上 Entity 中定义的字段渲染配置。区别在于 `formScene` 控制提交按钮的权限——创建和编辑时显示，查看时隐藏。

### 4. 详情页

```tsx
@Dto<IDtoOptionsStudentView>({
  blocks: [
    ZovaRender.block('basic-pageentry:blockPageEntry', {
      blocks: [
        ZovaRender.block('basic-pageentry:blockForm'),
        ZovaRender.block('basic-pageentry:blockToolbarRow', {
          actions: [
            ZovaRender.formActionRow('basic-form:actionBack', { permission: { public: true } }),
          ],
        }),
      ],
    }),
  ],
})
export class DtoStudentView extends $Dto.get(() => ModelStudent) {}
```

详情页只比编辑页少了一个提交按钮，继承自 `$Dto.get`，表单自动为只读模式。

**总结一下 DTO 的页面组装模式**：用 blocks 声明页面由哪些区域组成，用 actions 声明操作按钮，字段渲染则自动继承 Entity 的配置。整个过程不需要写 Vue 组件、不需要拼模板，一个 DTO 文件就是一个完整的 CRUD 页面。

## 五、与 Django Admin 对比：为什么值得换

| 特性         | VonaJS                    | Django Admin            |
| ------------ | ------------------------- | ----------------------- |
| 后端技术栈   | NodeJS + TypeScript       | Python + 服务端模板语言 |
| 前端技术栈   | Vue3 + Vite8 + TypeScript | HTML + CSS + JS         |
| 渲染机制     | 同构 SSR                  | 服务端模板渲染          |
| 双层页签导航 | 支持                      | 不支持                  |
| 界面定制     | 自由定制，组件级可控      | 定制成本高，需覆盖模板  |
| SSR          | 支持（含侧边栏、主题等）  | 不支持                  |

Django Admin 的核心问题是：它用服务端模板渲染页面，前端技术栈停留在传统 HTML/CSS/JS 时代。想定制一个下拉框的样式、加一个自定义交互，就得去覆盖模板文件，维护成本随业务复杂度急剧上升。

VonaJS 采用前后端分离架构，前端是完整的 Vue3 应用，渲染配置通过 DTO 声明、组件按需替换，定制一个字段控件只需要换一个 `ZovaRender.field()` 的组件名。同时，Admin 中后台也支持 SSR，刷新页面时侧边栏不会闪烁跳动。

## 六、与 NestJS 对比：DTO 不再只是校验

在 NestJS 中，DTO 的职责比较单一——参数校验。你需要用 class-validator 装饰器定义校验规则，再用 class-transformer 或手动方式生成 Swagger 文档。至于前端页面怎么渲染？那是另一个项目的事。

VonaJS 基于 Zod4 的统一 Schema，让 DTO 同时承担四项职责：

1. **参数校验**：Zod 原生能力
2. **OpenAPI 文档**：自动从 Schema 生成 Swagger 文档
3. **渲染配置**：通过 `ZovaRender` 声明字段在 Table/Form 中的渲染方式
4. **数据序列化**：Response 的脱敏处理、字段过滤

一份 Schema 定义，四处复用，从根源上消除了前后端字段定义不一致的问题。

## 七、总结

VonaJS 的核心价值很明确：**用 DTO 驱动 CRUD 动态渲染，把中后台开发从"写页面"变成"配字段"。**

过去你需要在 Entity 里定义字段、在 DTO 里定义校验、在前端组件里定义表格列和表单控件——三个地方维护同一组字段。现在，Entity 中一行 `ZovaRender.cell()` 或 `ZovaRender.field()` 就能同时搞定显示和交互，DTO 中几个 block 就能组装出完整的页面结构。

如果你的项目是中后台系统、管理后台、数据驱动的 Web 应用，VonaJS 值得一试。

- 在线演示（Web）：https://cabloy.com
- 在线演示（Admin）：https://cabloy.com/admin
- GitHub：https://github.com/vonajs/vona
