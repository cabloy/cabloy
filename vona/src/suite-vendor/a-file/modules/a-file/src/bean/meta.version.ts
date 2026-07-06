import type { IMetaVersionUpdate, IMetaVersionUpdateOptions } from 'vona-module-a-version';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';

@Meta()
export class MetaVersion extends BeanBase implements IMetaVersionUpdate {
  async update(options: IMetaVersionUpdateOptions) {
    if (options.version === 1) {
      const entityFileProvider = this.scope.entity.fileProvider;
      await this.bean.model.createTable(entityFileProvider.$table, table => {
        table.basicFieldsSimple();
        table.boolean(entityFileProvider.disabled).defaultTo(false);
        table.string(entityFileProvider.providerName, 255);
        table.string(entityFileProvider.clientName, 255);
        table.json(entityFileProvider.clientOptions);
      });
      const entityFile = this.scope.entity.file;
      await this.bean.model.createTable(entityFile.$table, table => {
        table.basicFields();
        table.string(entityFile.providerName, 255);
        table.string(entityFile.clientName, 255);
        table.string(entityFile.resourceId, 255);
        table.string(entityFile.bucket, 255);
        table.text(entityFile.objectKey);
        table.string(entityFile.filename, 255);
        table.string(entityFile.contentType, 255);
        table.integer(entityFile.size);
        table.string(entityFile.etag, 255);
        table.boolean(entityFile.public).defaultTo(false);
        table.json(entityFile.meta);
        table.text(entityFile.storagePath);
        table.text(entityFile.deliveryBaseUrl);
        table.string(entityFile.fileScene, 255);
      });
    }
  }
}
