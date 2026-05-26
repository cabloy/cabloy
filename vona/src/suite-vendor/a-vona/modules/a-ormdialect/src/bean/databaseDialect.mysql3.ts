import type { IDecoratorDatabaseDialectOptions } from 'vona-module-a-orm';

import { $Class, Virtual } from 'vona';
import { DatabaseDialect } from 'vona-module-a-orm';

import { DatabaseDialectMysql } from './databaseDialect.mysql.ts';

export interface IDatabaseDialectOptionsMysql3 extends IDecoratorDatabaseDialectOptions {}

@DatabaseDialect<IDatabaseDialectOptionsMysql3>()
@Virtual()
export class DatabaseDialectMysql3 extends $Class.extend(DatabaseDialectMysql) {}
