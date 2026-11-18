import type { IMetaVersionUpdate, IMetaVersionUpdateOptions } from 'vona-module-a-version';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';

@Meta()
export class MetaVersion extends BeanBase implements IMetaVersionUpdate {
  async update(options: IMetaVersionUpdateOptions) {
    if (options.version !== 1) return;

    for (const entity of [
      this.scope.entity.aiProvider,
      this.scope.entity.aiModel,
      this.scope.entity.aiScene,
    ]) {
      await this.bean.model.createTable(entity.$table, table => {
        table.basicFields();
        table.string(entity.name, 100).notNullable();
        table.json(entity.overrides).notNullable();
      });
    }

    const conversation = this.scope.entity.conversation;
    await this.bean.model.createTable(conversation.$table, table => {
      table.basicFields();
      table.userId(conversation.userId).notNullable();
      table.string(conversation.title, 120).notNullable();
      table.tableIdentity(conversation.activeRunId).nullable();
    });

    const message = this.scope.entity.message;
    await this.bean.model.createTable(message.$table, table => {
      table.basicFields();
      table.userId(message.userId).notNullable();
      table.tableIdentity(message.conversationId).notNullable();
      table.tableIdentity(message.runId).notNullable();
      table.string(message.role, 16).notNullable();
      table.text(message.text).notNullable();
    });

    const run = this.scope.entity.run;
    await this.bean.model.createTable(run.$table, table => {
      table.basicFields();
      table.userId(run.userId).notNullable();
      table.tableIdentity(run.conversationId).notNullable();
      table.string(run.requestKey, 100).notNullable();
      table.string(run.fingerprint, 64).notNullable();
      table.string(run.status, 24).notNullable();
      table.bigInteger(run.deadlineAt).notNullable();
      table.bigInteger(run.finishedAt).nullable();
      table.string(run.errorCode, 40).nullable();
      table.string(run.aiScene, 100).notNullable();
      table.string(run.aiProvider, 100).notNullable();
      table.string(run.aiModel, 100).notNullable();
      table.string(run.modelId, 200).notNullable();
    });

    const usage = this.scope.entity.usage;
    await this.bean.model.createTable(usage.$table, table => {
      table.basicFields();
      table.userId(usage.userId).notNullable();
      table.tableIdentity(usage.conversationId).notNullable();
      table.tableIdentity(usage.runId).notNullable();
      table.bigInteger(usage.inputTokens).nullable();
      table.bigInteger(usage.outputTokens).nullable();
      table.bigInteger(usage.totalTokens).nullable();
    });
  }
}
