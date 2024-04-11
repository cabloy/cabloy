## The best practice of ts: make types invisible

Using ts in a project can bring many benefits of intelligent type prompts and type checks. At the same time, in order to reduce type annotations and achieve the effect of `making types invisible`, CabloyJS introduces the `ioc` and `dependency lookup` mechanisms. In the previous article, we created a business module `test-home`, and used the dependency lookup mechanism to demonstrate how to elegantly define and use resources, including: Service services, Config configurations, international language resources, and Error exceptions

In actual projects, we often encounter cross-module resource access scenarios. So, can CabloyJS's dependency lookup mechanism still achieve cross-module access elegantly? Let's take a look

## Modular system and task description

The front and back ends of the CabloyJS full-stack framework adopt a modular system. A CabloyJS project consists of multiple business modules. Each business module can contain resources related to its own business, such as: Service service, Config configuration, international language resources, Error exception, middleware, scheduled tasks, message queue, System startup items, etc.

Here, we create a new business module `test-work` and access the resources provided by `test-home` in `test-work`

## 1. Create a Business Module

``` bash
cabloy api:create:module test-work
```

## 2. Create a API Endpoint

Create a set of files at the same time through one command

``` bash
cabloy api:create:controller work
```

* Route: `src/module/test-work/src/routes.ts`
* Controller: `src/module/test-work/src/controller/work.ts`
* Service: `src/module/test-work/src/local/work.ts`

## 3.

