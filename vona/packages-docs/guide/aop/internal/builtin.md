# Built-in Aspect

## AOP Method

| Name                   | Description          |
| ---------------------- | -------------------- |
| a-logger:log           | Output log           |
| a-orm:transaction      | Database transaction |
| a-caching:cachingGet   | Get cache            |
| a-caching:cachingSet   | Set cache            |
| a-caching:cachingDel   | Delete cache         |
| a-caching:cachingClear | Clear cache          |

## a-logger:log

- General usage:

```typescript
import { Aspect } from 'vona-module-a-aspect';

@Aspect.aopMethod('a-logger:log', { level: 'info' })
```

- Shorthand:

```typescript
import { Core } from 'vona-module-a-core';

@Core.log({ level: 'info' })
```

## a-orm:transaction

- General usage:

```typescript
import { Aspect } from 'vona-module-a-aspect';

@Aspect.aopMethod('a-orm:transaction', { isolationLevel: 'READ_COMMITTED', propagation: 'REQUIRED' })
```

- Shorthand:

```typescript
import { Core } from 'vona-module-a-core';

@Core.transaction({ isolationLevel: 'READ_COMMITTED', propagation: 'REQUIRED' })
```

## a-caching:cachingGet

- General usage:

```typescript
import { Aspect } from 'vona-module-a-aspect';

@Aspect.aopMethod('a-caching:cachingGet', { cacheName: 'module-name:xxx' })
```

- Shorthand:

```typescript
import { Caching } from 'vona-module-a-caching';

@Caching.get({ cacheName: 'module-name:xxx' })
```
