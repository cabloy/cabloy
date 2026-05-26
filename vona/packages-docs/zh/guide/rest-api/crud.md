# 创建CRUD

可以使用`Cli命令`或者`菜单命令`创建一个 crud 的代码骨架。

比如，在模块 demo-student 中创建一个 student 的 CRUD。

## Cli命令

```bash
$ vona :tools:crud student --module=demo-student
```

## 菜单命令

::: tip
右键菜单 - [模块路径]: `Vona Tools/Generate Crud`
:::

## 目录结构

| 名称                   | 描述          |
| ---------------------- | ------------- |
| controller/student.ts  | Controller    |
| service/student.ts     | Service       |
| model/student.ts       | Model         |
| entity/student.ts      | Entity        |
| dto/studentCreate.ts   | Create Dto    |
| dto/studentUpdate.ts   | Update Dto    |
| bean/meta.version.ts   | Meta Version  |
| bean/meta.index.ts     | Meta Index    |
| config/locale/en-us.ts | Locale: en-us |
| config/locale/zh-cn.ts | Locale: zh-cn |
| test/student.test.ts   | Test          |
