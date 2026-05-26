import { Meta } from 'vona-module-a-meta';
import { BeanAssetBase } from 'vona-module-a-static';

export interface IAssetGetPath {
  fonts: 'Comismsh.ttf';
}

@Meta()
export class MetaAsset extends BeanAssetBase<IAssetGetPath> {}
