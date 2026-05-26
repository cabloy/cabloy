# Route Alias

Before explaining route alias, let's first explain the basic process of page navigation and loading.

## Page Navigation and Loading

Take the page `counter` in module `demo-student` as an example:

1. Navigate to the page path `/demo/student/counter`
2. The system parses the module name `demo-student` from the path
3. The system loads the module `demo-student` and injects the routes provided by the module into the system route table
4. The route corresponding to this path is found in the route table
5. The component is obtained from the route record, completing the page rendering

## Home Page Navigation and Loading

Zova uses a modular system, and all business logic is implemented within modules. The home page is no exception. Module `home-index` provides a page with the path `/home/index`. When a user visits `/home/index`, the home page can be rendered.

Obviously, users expect the home page path to be `/`. So, how can this be achieved?

## Route Alias

You can assign aliases to routes. When a user visits `/`, the system finds the real path `home/index` based on the route alias, then loads module `home-index`, and renders the specified page component.

## Global Config

Clearly, we cannot specify route aliases in the module's route records; they must be specified in the global Config.

`src/front/config/config/config.ts`

```typescript
// routes
config.routes = {
  path: {
    '/home/index': { alias: '/' },
    '/home/login': { alias: '/login' },
    '/demo/todo/todo': { alias: '/todo' },
  },
  name: {
    'demo-todo:item': { alias: '/todo/:id' },
  },
};
```

| Name        | Description                                                       |
| ----------- | ----------------------------------------------------------------- |
| routes.path | Regular pages use `path` to set aliases                           |
| routes.name | If a page supports `Params`, `name` should be used to set aliases |
