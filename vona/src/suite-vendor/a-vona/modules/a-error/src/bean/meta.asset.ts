import { Meta } from 'vona-module-a-meta';
import { BeanAssetBase } from 'vona-module-a-static';

export interface IAssetGetPath {
  templates: 'onerror_page.mustache';
}

@Meta()
export class MetaAsset extends BeanAssetBase<IAssetGetPath> {}
