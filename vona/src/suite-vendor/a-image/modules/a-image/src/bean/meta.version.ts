import type { IMetaVersionUpdate, IMetaVersionUpdateOptions } from 'vona-module-a-version';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';

@Meta()
export class MetaVersion extends BeanBase implements IMetaVersionUpdate {
  async update(options: IMetaVersionUpdateOptions) {
    if (options.version === 1) {
      // aImageProvider
      const entityImageProvider = this.scope.entity.imageProvider;
      await this.bean.model.createTable(entityImageProvider.$table, table => {
        table.basicFieldsSimple();
        table.boolean(entityImageProvider.disabled).defaultTo(false);
        table.string(entityImageProvider.providerName, 255);
        table.string(entityImageProvider.clientName, 255);
        table.json(entityImageProvider.clientOptions);
      });
      // aImage
      const entityImage = this.scope.entity.image;
      await this.bean.model.createTable(entityImage.$table, table => {
        table.basicFields();
        table.string(entityImage.providerName, 255);
        table.string(entityImage.clientName, 255);
        table.string(entityImage.resourceId, 255);
        table.string(entityImage.filename, 255);
        table.string(entityImage.contentType, 255);
        table.integer(entityImage.size);
        table.integer(entityImage.width);
        table.integer(entityImage.height);
        table.boolean(entityImage.requireSignedURLs).defaultTo(false);
        table.json(entityImage.variants);
        table.json(entityImage.meta);
        table.text(entityImage.storagePath);
        table.text(entityImage.deliveryBaseUrl);
        table.string(entityImage.imageScene, 255);
        table.string(entityImage.status, 255).defaultTo('ready');
        table.dateTime(entityImage.draftExpiresAt);
        table.dateTime(entityImage.finalizedAt);
      });
    }
  }
}
