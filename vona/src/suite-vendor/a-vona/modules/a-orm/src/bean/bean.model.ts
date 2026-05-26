import { Virtual } from 'vona';
import { Bean } from 'vona-module-a-bean';

import { BeanModelCrudTable } from './bean.model/bean.model_crud_table.ts';

@Bean()
@Virtual()
export class BeanModel<TRecord extends {} = any> extends BeanModelCrudTable<TRecord> {}
