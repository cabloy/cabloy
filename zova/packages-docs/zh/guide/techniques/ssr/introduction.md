# 简介

Zova 内置了开箱即用的 SSR 解决方案，同时支持 B 端和 C 端应用。

Zova SSR 底层采用`@quasar/app-vite`，并优化了大量细节，让 SSR 的开发体验更加自然、更加便捷。关于 SSR 原理性的介绍请参见：[Quasar-SSR](https://quasar.dev/quasar-cli-vite/developing-ssr/introduction)

## 特性：

1. `UI库无关`：可与不同的 UI 库结合使用，并且内置几个 UI 库的开箱即用的 SSR 解决方案
2. `精细的主题支持`：针对 C 端应用，可提供暗黑主题的切换能力。针对 B 端应用，可基于 Cookie 提供两个维度的主题切换能力，参见：[$theme](../css-in-js/theme.md)
3. `侧边栏支持`：针对 B 端应用，可基于 Localstorage 实现侧边栏的切换能力
4. `初始化数据`：以非常直观的方式在服务端准备好初始数据，并同步到客户端，自动完成水合
5. `SEO Meta`：针对 SEO 优化，可提供更加灵活的 Meta 设置机制
6. `Env配置`：提供 env 环境变量，非常方便的配置某些功能和特性的表现行为
