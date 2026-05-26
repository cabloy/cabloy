import { Virtual } from 'vona';
import { Bean } from 'vona-module-a-bean';

import { BeanModelCache } from './bean.model/bean.model_cache.ts';

@Bean()
@Virtual()
export class BeanModelBase<TRecord extends {} = any> extends BeanModelCache<TRecord> {}
