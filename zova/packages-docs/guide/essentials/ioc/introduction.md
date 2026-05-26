# Introduction

We know that `IOC`(Inversion of Control) is an effective architectural design for system decoupling, and is also a supporting tool for the development of large-scale business systems.

## State Sharing: 4-in-1

In actual development, there are four scopes of state sharing: `component internal`, `between components`, `global` and `system`. In the traditional Vue3, different mechanisms are used to achieve these state sharing scopes, while only a unified IOC container mechanism is needed in Zova.

| Scope of state sharing | Traditional Vue3 | Zova |
| ---------------------- | ---------------- | ---- |
| Component internal     | Composable       | IOC  |
| Between components     | Provide/Inject   | IOC  |
| Global                 | Pinia            | IOC  |
| System                 | ES Module        | IOC  |

> Some people may ask, what is the difference between `global state sharing` and `system state sharing`?
>
> > Because in SSR scenarios, `global state sharing` is for each request, and `system state sharing` can cross requests

## IOC Containers

There are three types of ioc containers in Zova:

1. `sys container`: During system initialization, a unique sys ioc container will be automatically created. Bean instances created in this container are all singleton mode
2. `app container`: When requests coming, the system will create a app container for each of them. The Bean instances created in this container are `request-scoped` singletons
3. `ctx container`: When creating Vue component instances, the system will create a ctx ioc container for each of them. Bean instances created in this container can share data and logic within the scope of the component instance

## Bean Class

Zova adopts a modular system, and Bean Classes are provided by different modules.

## Injection Scope

Zova provides the following injection scopes:

1. `sys`: Inject in the sys container
2. `app`: Inject in the app container
3. `ctx`: Inject in the ctx container
4. `new`: Always create a new bean instance

## Injection Scope: Hierarchical injection

The injection scope also supports hierarchical injection, replacing the capabilities of Vue3 Provide/Inject:

1. `host`: the bean instance will be lookuped in the ctx container of the current component instance and all parent containers in turn
2. `skipSelf`: lookup the bean instance in all parent containers in turn

## Injection Methods

Zova provides two injection methods:

1. `Dependency Injection`: Provides property-based dependency injection through the `@Use` decorator
2. `Dependency Lookup`: Directly looks up the required bean instance through the ioc container, and automatically creates it if it does not exist
