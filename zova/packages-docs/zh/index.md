---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: 'Zova'
  text: '直观的前端框架'
  tagline: = Vue3 响应式 + React TSX + Angular IOC
  actions:
    - theme: brand
      text: 快速开始
      link: /zh/guide/start/introduction
    - theme: alt
      text: 演示
      link: https://cabloy.com/admin
    - theme: alt
      text: GitHub
      link: https://github.com/zovajs/zova

features:
  - title: Vue3 + React + Angular
    details: 提供更直观、更优雅、更强大的代码风格，融合 Vue3、React、Angular 的核心设计
  - title: SSR
    details: 内置开箱即用的SSR解决方案，可在同一个代码库中实现`SSR/SPA/Web网站/Admin中后台`
  - title: 双层页签导航
    details: 支持双层页签导航，实现高效页面切换，并保持页面状态
  - title: CRUD动态渲染
    details: 可动态渲染CRUD的列表页、条目页、搜索表单，并且提供了Tanstack Table/Tanstack Form/Tanstack Query的最佳实践
  - title: UI库
    details: 可以搭配任何 UI 库使用，并且内置了几款 UI 库的项目模版，便于开箱即用，包括：daisyui、quasar和vuetify
  - title: 响应式系统
    details: 有了IOC容器的加持，定义响应式状态不再需要 ref/reactive。因为不用 ref，自然也就不用再写大量的 ref.value
  - title: CSS-in-JS
    details: 内置CSS-in-JS的能力，让样式的开发更加灵活、便捷，同时提供了开箱即用的主题切换能力
  - title: 统一状态管理
    details: 采用统一的Model机制封装状态数据，包括Cookie、Localstorage和TanStack Query管理的服务端数据
  - title: IOC + AOP
    details: 提供强大的 IOC + AOP 能力，让系统具有无与伦比的可扩展性和可维护性
---
