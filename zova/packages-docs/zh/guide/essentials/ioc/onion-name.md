# Onion名称

系统会为每一个 bean class 自动分配一个 Onion 名称，格式如下：

```bash
{moduleName}:{beanName}
```

## 举例

- 模块 demo-student 中组件 test 的 Controller bean: ControllerTest

| Class 名称     | Scene 名称 | Bean 标识                    | Onion 名称        | Component 名称 |
| -------------- | ---------- | ---------------------------- | ----------------- | -------------- |
| ControllerTest | controller | demo-student.controller.test | demo-student:test | `= Onion 名称` |

- 模块 a-routertabs 的 Model bean: ModelTabs

| Class 名称 | Scene 名称 | Bean 标识               | Onion 名称        | Model 名称     |
| ---------- | ---------- | ----------------------- | ----------------- | -------------- |
| ModelTabs  | model      | a-routertabs.model.tabs | a-routertabs:tabs | `= Onion 名称` |

## App Config

有了通用的 Onion 名称，就可以在 App Config 中修改所有 bean class 的参数配置。

`src/front/config/config/config.ts`

```typescript
// onions
config.onions = {
  model: {
    'a-routertabs:tabs': {
      max: 10,
    },
  },
};
```

所有的配置都有类型提示，如下图所示：

- 所有 SceneName 提示

![](../../../assets/img/ioc/onion-1.png)

- 所有 OnionName 提示

![](../../../assets/img/ioc/onion-2.png)

- 所有配置提示

![](../../../assets/img/ioc/onion-3.png)
