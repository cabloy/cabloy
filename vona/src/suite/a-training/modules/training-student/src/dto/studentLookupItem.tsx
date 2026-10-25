import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { ModelStudent } from '../model/student.ts';

export interface IDtoOptionsStudentLookupItem extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsStudentLookupItem>({
  fields: {
    id: { rest: undefined },
    name: { rest: undefined },
    level: { rest: undefined },
  },
})
export class DtoStudentLookupItem extends $Dto.get(() => ModelStudent, {
  columns: ['id', 'name', 'level'],
}) {}
