import type { IStartupExecute } from 'vona-module-a-startup';

import { BeanBase } from 'vona';
import { Startup } from 'vona-module-a-startup';

@Startup({ dependencies: 'a-version:databaseInit' })
export class StartupDatabaseName extends BeanBase implements IStartupExecute {
  async execute() {
    return await this.scope.service.database.databaseNameStartup();
  }
}
