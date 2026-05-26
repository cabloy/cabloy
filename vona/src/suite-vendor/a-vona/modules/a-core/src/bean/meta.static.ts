import { Meta } from 'vona-module-a-meta';
import { BeanStaticBase } from 'vona-module-a-static';

export type TypeStaticGetPath = 'img/vona.svg' | 'img/vona.png';

@Meta()
export class MetaStatic extends BeanStaticBase<TypeStaticGetPath> {}
