import type {
  IMetaVersionInit,
  IMetaVersionInitOptions,
  IMetaVersionUpdate,
  IMetaVersionUpdateOptions,
} from 'vona-module-a-version';

import fse from 'fs-extra';
import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';

@Meta()
export class MetaVersion extends BeanBase implements IMetaVersionUpdate, IMetaVersionInit {
  async update(options: IMetaVersionUpdateOptions) {
    if (options.version === 1) {
      const entity = this.scope.entity.versionInit;
      await this.bean.model.createTable(entity.$table, table => {
        table.basicFieldsSimple({ deleted: false, iid: false });
        table.string(entity.instanceName, 255);
        table.string(entity.module, 255);
        table.integer(entity.version);
      });
      const entity2 = this.scope.entity.viewRecord;
      await this.bean.model.createTable(entity2.$table, table => {
        table.basicFieldsSimple({ deleted: true, iid: false });
        table.string(entity2.viewName, 255);
        table.text(entity2.viewSql);
      });
    }
  }

  async init(options: IMetaVersionInitOptions): Promise<void> {
    if (options.version === 1) {
      // remove publicDir
      await this._removePublicDir();
    }
  }

  async _removePublicDir() {
    // only for test/dev env
    if (this.app.meta.isProd) return;
    // path
    const publicPath = await this.app.util.getPublicPathPhysical();
    // remove
    await fse.remove(publicPath);
  }
}
