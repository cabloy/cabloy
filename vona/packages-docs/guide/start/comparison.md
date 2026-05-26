# Comparison with Other Frameworks

This document compares VonaJS with other mainstream frameworks (such as Next.js, NestJS, and Django Admin), highlighting VonaJS's advantages in fullstack development, backend capabilities, SSR support, and more.

## Comparison with Next.js

| Feature                      | VonaJS                                    | Next.js                          |
| ---------------------------- | ----------------------------------------- | -------------------------------- |
| Fullstack Mechanism          | Frontend and backend separation           | Frontend and backend integration |
| Backend Capability           | Powerful, comparable to `NestJS`/`Spring` | General                          |
| Admin Dashboard Supports SSR | ✅                                        | ❌                               |
| Dual-layer Tabs Navigation   | ✅                                        | ❌                               |

- **Fullstack Mechanism**: VonaJS adopts a frontend-backend separation architecture. The frontend uses the ZovaJS framework, placing the built JS bundle into the VonaJS backend for direct SSR rendering on the backend
  - The backend generates Swagger/OpenAPI Schema for generating API SDK on the frontend
  - The frontend generates types for icons, routes, and components for providing type hints on the backend
- **Backend Capability**: VonaJS provides more powerful and complete backend capabilities, easily handling the development of large business systems, including `multi-tenancy`, `multi-database`, `multi-datasource`, `two-layer cache`, `queues`, `broadcast`, `scheduled tasks`, `distributed locks`, `DTO dynamic inference and generation`, and more
- **Admin Dashboard Supports SSR**: VonaJS provides full SSR support for Admin applications, preventing sidebar flickering on page refresh
- **Dual-layer Tabs Navigation**: VonaJS supports dual-layer tabs navigation, enabling efficient page switching while maintaining page state

## Comparison with NestJS

| Feature                                        | VonaJS                                              | NestJS                      |
| ---------------------------------------------- | --------------------------------------------------- | --------------------------- |
| Parameter Validation/OpenAPI                   | Unified Configuration                               | Has Redundant Configuration |
| DTO Dynamic Inference and Generation           | ✅                                                  | ❌                          |
| Multi-Tenant, Multi-Database, Multi-Datasource | Built-in                                            | Third-party                 |
| AOP Programming                                | Controller Aspect, Internal Aspect, External Aspect | Controller Aspect           |

- **Zod Schema**: VonaJS generates a unified Schema based on Zod4, which can be used for `parameter validation`, `Swagger/OpenAPI documentation generation`, `Form/Table dynamic rendering`, `Response data serialization and desensitization`, and other scenarios
- **DTO Dynamic Inference and Generation**: VonaJS provides DTO dynamic inference and generation capabilities, reducing redundant type definition work and improving development efficiency
- **Multi-Tenant, Multi-Database, Multi-Datasource**: VonaJS has built-in multi-tenant, multi-database, and multi-datasource capabilities, making it easy to handle large-scale business system development
- **AOP Programming**: VonaJS provides more complete AOP programming capabilities, including `controller aspect`, `internal aspect`, and `external aspect`. NestJS only implements `controller aspect`

> **What is controller aspect?**
>
> Middleware, Guard, Interceptor, Pipe, Filter are all designed to enhance the controller's capabilities, so they are collectively referred to as `controller aspect`.

## Comparison with Django Admin

| Feature                    | VonaJS                             | Django Admin                           |
| -------------------------- | ---------------------------------- | -------------------------------------- |
| Backend Tech Stack         | NodeJS + TypeScript                | Python + Server-side template language |
| Frontend Tech Stack        | ZovaJS + Vue3 + Vite8 + TypeScript | HTML + CSS + JS                        |
| SSR Mechanism              | Isomorphic SSR                     | Server-side template rendering         |
| Dual-layer Tabs Navigation | ✅                                 | ❌                                     |

- VonaJS adopts a frontend and backend separated architecture. The frontend uses the ZovaJS framework, offering a more beautiful interface, cleaner code, and greater freedom to customize the interface and add new features

## Summary

VonaJS demonstrates significant advantages in fullstack development, especially in frontend-backend separation, powerful backend capabilities, SSR support, and modern frontend tech stack. Through comparison with Next.js, NestJS, and Django Admin, it can be seen that VonaJS is more suitable for building complex, modern fullstack applications.
