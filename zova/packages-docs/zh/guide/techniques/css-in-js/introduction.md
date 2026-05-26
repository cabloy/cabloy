# 简介

Zova 通过[TypeStyle](https://github.com/typestyle/typestyle) 实现了`css-in-js`的能力，让样式的开发更加灵活、便捷，同时提供了开箱即用的 theme 切换能力。

- 强烈建议了解 TypeStyle 的基本用法：[TypeStyle](https://github.com/typestyle/typestyle)

## 特性

- `Scope样式`：避免样式冲突
- `动态样式`：可以基于响应式变量动态生成样式
- `token`：提炼出与 UI 库无关的 token 定义与使用机制
- `theme`：提炼出与 UI 库无关的 theme 定义与使用机制，并且提供开箱即用的 theme 切换能力
- `便于调试`：在开发阶段为生成的样式 className 自动添加模块名称前缀，从而方便排查问题
- `内置模版代码`：为内置的几个 UI 库提供开箱即用的模版代码，包括：Antdv/Element/Quasar/Vuetify
