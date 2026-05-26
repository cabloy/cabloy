import { DtoAggregate } from './dtoAggregate.ts';
import { DtoCreate } from './dtoCreate.ts';
import { DtoGet } from './dtoGet.ts';
import { DtoGroup } from './dtoGroup.ts';
import { DtoListAndCount } from './dtoListAndCount.ts';
import { DtoQuery } from './dtoQuery.ts';
import { DtoQueryPage } from './dtoQueryPage.ts';
import { DtoSelectAndCount } from './dtoSelectAndCount.ts';
import { DtoUpdate } from './dtoUpdate.ts';

export const $Dto = {
  create: DtoCreate,
  update: DtoUpdate,
  get: DtoGet,
  aggregate: DtoAggregate,
  group: DtoGroup,
  query: DtoQuery,
  queryPage: DtoQueryPage,
  selectAndCount: DtoSelectAndCount,
  listAndCount: DtoListAndCount,
};
