import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsMenuItemMetaParams extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsMenuItemMetaParams>()
export class DtoMenuItemMetaParams {}
