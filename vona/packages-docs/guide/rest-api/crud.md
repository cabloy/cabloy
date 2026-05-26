# Create CRUD

We can use `Cli command` or `Menu command` to create a crud code skeleton.

For example, we create a student CRUD in the module demo-student.

## Cli command

```bash
$ vona :tools:crud student --module=demo-student
```

## Menu command

::: tip
Context Menu - [Module Path]: `Vona Tools/Generate Crud`
:::

## Directory structure

| Name                   | Description   |
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
