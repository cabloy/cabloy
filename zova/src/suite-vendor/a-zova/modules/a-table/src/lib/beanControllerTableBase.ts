import type { Table } from '@tanstack/table-core';
import type { TableOptionsWithReactiveData } from '@tanstack/vue-table';
import type { ISchemaObjectExtensionField } from 'zova-module-a-openapi';

import { useVueTable } from '@tanstack/vue-table';
import { markRaw } from 'vue';
import { BeanControllerBase } from 'zova';

import { TypeTable } from '../types/table.js';
import { ITableLayout } from '../types/tableLayout.js';

export class BeanControllerTableBase<TData extends {} = {}> extends BeanControllerBase {
  table: TypeTable<TData>;

  public get layout(): ITableLayout {
    throw new Error('should implement layout');
  }

  public get layoutProperties(): readonly ISchemaObjectExtensionField[] {
    throw new Error('should implement layoutProperties');
  }

  public $useTable(initialOptions: TableOptionsWithReactiveData<TData>): Table<TData> {
    return this.ctx.util.instanceScope(() => {
      return markRaw(useVueTable(initialOptions));
    });
  }

  public async refreshMeta() {
    throw new Error('should implement refreshMeta');
  }
}
