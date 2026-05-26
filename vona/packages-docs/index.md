---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: 'Vona'
  text: 'A fullstack framework'
  tagline: Building SSR/SPA/Website/Admin in one codebase
  actions:
    - theme: brand
      text: Get Started
      link: /guide/start/introduction
    - theme: alt
      text: Demo
      link: https://cabloy.com/admin
    - theme: alt
      text: GitHub
      link: https://github.com/vonajs/vona

features:
  - title: Fullstack
    details: Building SSR/SPA/Website/Admin in one codebase
  - title: Admin Supports SSR
    details: Provides full SSR support for Admin applications, preventing sidebar flickering on page refresh
  - title: CRUD Dynamic Rendering
    details: Dynamically render CRUD list pages, entry pages, and search forms, while demonstrating best practices for Tanstack Table, Tanstack Form, and Tanstack Query
  - title: DTO Infer & Generation
    details: Dynamically infer and generate DTOs to eliminate redundant type definitions and boost development productivity
  - title: Dual-layer Tabs Navigation
    details: Supports dual-layer tabs navigation, enabling efficient page switching while maintaining page state
  - title: IOC & AOP
    details: Recommended to use the `dependency lookup` strategy, so as to use fewer decorator functions and fewer type annotations, making the IOC container more concise and intuitive
  - title: Multi-tenancy
    details: Built-in out-of-the-box multi-tenancy capabilities, supporting both shared and isolated modes
  - title: Multi-database & Multi-datasource
    details: Supports multi-database and multi-datasource, and provides out-of-the-box read-write splitting and dynamic datasource capabilities
  - title: Menu Commands
    details: Execute Cli commands through the menus, significantly reducing mental overhead and improving the development experience
---
