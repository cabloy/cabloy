import { BeanBase, Virtual } from 'zova';
import { Bean } from 'zova-module-a-bean';

import type { IDecoratorInterceptorOptions } from '../types/interceptor.js';
import type { BeanFetch } from './bean.fetch.js';

@Bean()
@Virtual()
export class BeanInterceptorBase<
  T extends IDecoratorInterceptorOptions = IDecoratorInterceptorOptions,
> extends BeanBase {
  protected $beanFetch: BeanFetch;
  protected $options: T;

  constructor(beanFetch: BeanFetch, options: T) {
    super();
    this.$beanFetch = beanFetch;
    this.$options = options;
  }
}
