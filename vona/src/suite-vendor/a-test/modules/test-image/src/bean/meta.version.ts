import type { IMetaVersionUpdate, IMetaVersionUpdateOptions } from 'vona-module-a-version';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';

@Meta()
export class MetaVersion extends BeanBase implements IMetaVersionUpdate {
  async update(_options: IMetaVersionUpdateOptions) {}
}
