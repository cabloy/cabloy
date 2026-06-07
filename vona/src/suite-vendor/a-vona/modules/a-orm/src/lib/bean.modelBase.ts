import { BeanModelCache } from './bean.model/bean.model_cache.ts';

export class BeanModelBase<TRecord extends {} = any> extends BeanModelCache<TRecord> {}
