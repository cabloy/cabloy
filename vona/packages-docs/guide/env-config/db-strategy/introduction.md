# Database Strategy

To further optimize the daily development experience and improve development efficiency, Vona uses different database strategies for different runtime environments:

## Test Environment

In the test environment, you don't need to specify a database name (leave it as the default). Instead, the system automatically creates a test database. Whenever unit tests are executed, the system deletes the old test database and creates a new one.

- Recreate database + Unit-test

```bash
$ npm run test
$ npm run cov
```

- Recreate database only

```bash
$ npm run db:reset
```

For example, if the project name is `VonaDev`, when running unit tests, the system automatically creates a test database named `vona-test-VonaDev-20250815-161320`

- Benefits of this design: During project development iterations, frequent database schema modifications are inevitable. The typical approach is to open a database management tool and make manual modifications. In Vona, you only need to write your change logic in [meta.version](../../rest-api/version.md) and run the unit tests for the changes to take effect. In other words, database management tools are rarely used during Vona development

- Some people may ask: If running unit tests creates a new database, does that mean you need to manually re-prepare all the test data?
  - Vona offers a solution to this problem: write the test data initialization logic directly in the `test` method of [meta.version](../../rest-api/version.md). This test data will be automatically generated whenever a new test database is created

## Development Environment

In the development environment, you don't need to specify a database name (leave it as the default). Whenever the backend development server is started, it will always check for an available test database. If one is not found (for example, if no unit tests have been executed), a new test database will be automatically created.

```bash
$ npm run dev
$ npm run dev:one
$ vona play
```

- In the development environment, you can also manually specify a database name, which will override the default behavior

## Production Environment

In the production environment, you must manually create a database and specify the database name in the [Datasource Config](../../techniques/orm/config-datasource.md)

```bash
$ npm run start
$ npm run start:one
```
