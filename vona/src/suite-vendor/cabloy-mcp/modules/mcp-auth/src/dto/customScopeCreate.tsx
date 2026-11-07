import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { ModelCustomScope } from '../model/customScope.ts';

export interface IDtoOptionsCustomScopeCreate extends IDecoratorDtoOptions {}

@Dto()
export class DtoCustomScopeCreate extends $Dto.create(() => ModelCustomScope, {
  columns: ['name', 'description', 'tools'],
}) {}
