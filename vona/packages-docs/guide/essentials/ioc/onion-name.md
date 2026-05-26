# Onion Name

The system will automatically assign an Onion name to each bean class as the following format:

```bash
{moduleName}:{beanName}
```

## For Example

- The module demo-student provides a Controller bean: ControllerStudent

| Class Name        | Scene Name | Bean Identifier                 | Onion Name           | Controller Name |
| ----------------- | ---------- | ------------------------------- | -------------------- | --------------- |
| ControllerStudent | controller | demo-student.controller.student | demo-student:student | `= Onion Name`  |

- The module demo-student provides a Model bean: ModelStudent

| Class Name   | Scene Name | Bean Identifier            | Onion Name           | Model Name     |
| ------------ | ---------- | -------------------------- | -------------------- | -------------- |
| ModelStudent | model      | demo-student.model.student | demo-student:student | `= Onion Name` |

## App Config

With a common Onion name, you can modify the parameters of all bean classes in App Config.

`src/backend/config/config/config.ts`

```typescript
// onions
config.onions = {
  controller: {
    'demo-student:student': {
      enable: false,
    },
  },
  model: {
    'demo-student:student': {
      cache: {
        query: false,
        entity: false,
      },
    },
  },
  middleware: {
    'a-core:gate': {
      enable: false,
    },
  },
  schedule: {
    'a-orm:softDeletionPrune': {
      repeat: { every: 24 * 3600 * 1000 },
    },
  },
};
```

All configurations have type hints, as shown below:

- All Scene names type hints

![](../../../assets/img/ioc/onion-1.png)

- All Onion names type hints

![](../../../assets/img/ioc/onion-2.png)

- All parameters type hints

![](../../../assets/img/ioc/onion-3.png)
