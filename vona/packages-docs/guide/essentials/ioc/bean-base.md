# BeanBase

`BeanBase` is the base class for all beans. By inheriting from `BeanBase`, we can easily access commonly used tools and capabilities when writing code.

## Why is Vona's IOC container code more concise?

The reason is to prioritize the use of the `dependency lookup` strategy, resulting in fewer decorator functions and fewer type annotations. Injecting system capability objects into `BeanBase` is one of the mechanisms for implementing `dependency lookup` strategies.

## Built-in Members

| Name         | Description                                                               |
| ------------ | ------------------------------------------------------------------------- |
| app          | Global App object                                                         |
| ctx          | The Context object which the current request belongs to                   |
| ctx.bean     | ctx container                                                             |
| bean         | app container                                                             |
| scope        | The Scope object of the module which the current bean instance belongs to |
| $scope       | The Scope object of the specified module                                  |
| $logger      | Logger object                                                             |
| $loggerChild | Logger Child object                                                       |

## BeanBaseSimple

`BeanBase` inherits from `BeanBaseSimple`

### Built-in Members

| Name          | Description     |
| ------------- | --------------- |
| $beanFullName | Bean Identifier |
| $beanOptions  | Bean Options    |
| $onionName    | Onion Name      |
| $onionOptions | Onion Options   |
