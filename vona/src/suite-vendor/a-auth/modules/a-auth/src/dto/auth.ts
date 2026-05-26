import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { ModelAuth } from '../model/auth.ts';

export interface IDtoOptionsAuth extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsAuth>()
export class DtoAuth extends $Dto.get(() => ModelAuth, {
  columns: ['id', 'profileId'],
  include: { authProvider: true },
}) {}
