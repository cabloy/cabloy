import type { Constructable } from 'vona';

import { Api, v } from 'vona-module-a-openapiutils';
import z from 'zod';

import type { TypeDtoListAndCountResult } from '../../types/dto/dtoListAndCount.ts';

export function DtoListAndCount<T>(
  classRef: Constructable<T>,
): Constructable<TypeDtoListAndCountResult<T>> {
  abstract class TargetClass {}
  Api.field(v.array(classRef))(TargetClass.prototype, 'list');
  Api.field(z.string())(TargetClass.prototype, 'total');
  Api.field(z.number())(TargetClass.prototype, 'pageCount');
  Api.field(z.number())(TargetClass.prototype, 'pageSize');
  Api.field(z.number())(TargetClass.prototype, 'pageNo');
  return TargetClass as any;
}
