# ORM Configuration

Vona ORM is a core capability provided by the `a-orm` module. You can modify the module's configuration in App Config:

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

- The complete configuration is as follows:

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

| Name               | Description                                         |
| ------------------ | --------------------------------------------------- |
| table.identityType | Type of the table key field `id`: `number`/`bigint` |
| model              | General settings for the model                      |
| softDeletionPrune  | Soft deletion data prune settings                   |
| dialects           | Supported database dialects                         |
| summer             | two-layer cache settings                            |
