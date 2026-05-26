import type { Table } from '@tanstack/table-core';
import type { TableOptionsWithReactiveData } from '@tanstack/vue-table';

import { useVueTable } from '@tanstack/vue-table';
import { markRaw } from 'vue';
import { BeanControllerBase } from 'zova';

import { TypeTable } from '../types/table.js';

export class BeanControllerTableBase<TData extends {} = {}> extends BeanControllerBase {
  table: TypeTable<TData>;

  public $useTable(initialOptions: TableOptionsWithReactiveData<TData>): Table<TData> {
    return this.ctx.util.instanceScope(() => {
      return markRaw(useVueTable(initialOptions));
    });
  }

  public async refreshMeta() {
    throw new Error('should implement refreshMeta');
  }
}
