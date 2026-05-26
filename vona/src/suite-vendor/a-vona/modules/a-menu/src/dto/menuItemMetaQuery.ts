import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsMenuItemMetaQuery extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsMenuItemMetaQuery>()
export class DtoMenuItemMetaQuery {}
