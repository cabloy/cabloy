import type { ControllerTableProps as ControllerTablePropsSuper } from 'zova-module-a-table';

import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';

export interface ControllerTableProps<
  TData extends {} = {},
> extends ControllerTablePropsSuper<TData> {}

@Controller()
export class ControllerTable extends BeanControllerBase {
  static $propsDefault = {};

  protected async __init__() {}
}
