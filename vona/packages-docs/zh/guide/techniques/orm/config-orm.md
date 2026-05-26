# ORM配置

Vona ORM 是由模块`a-orm`提供的核心能力，可以在 App Config 中修改模块的配置：

`src/backend/config/config/config.ts`

```typescript
// modules
config.modules = {
  'a-orm': {
    table: {
      identityType: 'bigint',
    },
    softDeletionPrune: {
      enable: true,
    },
  },
};
```

- 完整配置如下：

`src/suite-vendor/a-vona/modules/a-orm/src/config/config.ts`

```typescript
export function config(_app: VonaApplication) {
  return {
    table: {
      identityType: 'bigint' as TableIdentityType,
    },
    model: {
      disableDeleted: false,
      disableInstance: false,
      disableCreateTime: false,
      disableUpdateTime: false,
    },
    softDeletionPrune: {
      enable: true,
      expired: 14 * 24 * 3600 * 1000,
    },
    dialects: {
      mysql: 'a-ormdialect.databaseDialect.mysql',
      mysql2: 'a-ormdialect.databaseDialect.mysql3',
      pg: 'a-ormdialect.databaseDialect.pg',
    } as unknown as TypeDataBaseConfigDialects,
    summer: {
      enable: true,
      meta: {} as IOnionOptionsMeta,
      presetDefault: 'redis' as TSummerCachePreset,
      preset: {
        redis: configRedis,
        all: configAll,
      },
      redis: {
        client: 'model',
      },
    },
  };
}
```

| 名称               | 说明                                        |
| ------------------ | ------------------------------------------- |
| table.identityType | 数据表关键字段`id`的类型：`number`/`bigint` |
| model              | model的通用设置                             |
| softDeletionPrune  | 软删除数据清理设置                          |
| dialects           | 系统支持的数据库方言                        |
| summer             | 二级缓存设置                                |
