---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: 'Vona'
  text: '是一款全栈框架'
  tagline: 同一个代码库实现SSR/SPA/Web网站/Admin中后台
  actions:
    - theme: brand
      text: 快速开始
      link: /zh/guide/start/introduction
    - theme: alt
      text: 演示
      link: https://cabloy.com/admin
    - theme: alt
      text: GitHub
      link: https://github.com/vonajs/vona

features:
  - title: 全栈能力
    details: 可在同一个代码库中实现SSR/SPA/Web网站/Admin中后台
  - title: Admin中后台支持SSR
    details: 为`Admin中后台`提供完整的 SSR 支持，刷新页面时侧边栏不会闪烁跳动
  - title: CRUD动态渲染
    details: 可动态渲染CRUD的列表页、条目页、搜索表单，并且提供了Tanstack Table/Tanstack Form/Tanstack Query的最佳实践
  - title: DTO动态推断与生成
    details: 提供 DTO 动态推断与生成能力，减少重复的类型定义工作，提升开发效率
  - title: 双层页签导航
    details: 支持双层页签导航，实现高效页面切换，并保持页面状态
  - title: IOC & AOP
    details: 优先使用`依赖查找`策略，从而使用更少的装饰器函数，使用更少的类型标注，从而让 IOC 容器更加简洁、直观
  - title: 多租户
    details: 内置了开箱即用的多租户能力，同时支持共享模式和独立模式
  - title: 多数据库、多数据源
    details: 支持多数据库、多数据源，还提供了开箱即用的读写分离和动态数据源能力
  - title: 菜单命令
    details: 通过菜单来执行 Cli 命令，从而显著降低心智负担，提升开发体验
---
