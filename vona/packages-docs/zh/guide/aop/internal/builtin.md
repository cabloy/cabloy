# 内置切面

## AOP Method

| 名称                   | 说明           |
| ---------------------- | -------------- |
| a-logger:log           | 输出日志       |
| a-orm:transaction      | 启用数据库事务 |
| a-caching:cachingGet   | 获取Cache      |
| a-caching:cachingSet   | 设置Cache      |
| a-caching:cachingDel   | 删除Cache      |
| a-caching:cachingClear | 清理Cache      |

## a-logger:log

- 一般用法：

```typescript
import { Aspect } from 'vona-module-a-aspect';

@Aspect.aopMethod('a-logger:log', { level: 'info' })
```

- 简写方式：

```typescript
import { Core } from 'vona-module-a-core';

@Core.log({ level: 'info' })
```

## a-orm:transaction

- 一般用法：

```typescript
import { Aspect } from 'vona-module-a-aspect';

@Aspect.aopMethod('a-orm:transaction', { isolationLevel: 'READ_COMMITTED', propagation: 'REQUIRED' })
```

- 简写方式：

```typescript
import { Core } from 'vona-module-a-core';

@Core.transaction({ isolationLevel: 'READ_COMMITTED', propagation: 'REQUIRED' })
```

## a-caching:cachingGet

- 一般用法：

```typescript
import { Aspect } from 'vona-module-a-aspect';

@Aspect.aopMethod('a-caching:cachingGet', { cacheName: 'module-name:xxx' })
```

- 简写方式：

```typescript
import { Caching } from 'vona-module-a-caching';

@Caching.get({ cacheName: 'module-name:xxx' })
```
