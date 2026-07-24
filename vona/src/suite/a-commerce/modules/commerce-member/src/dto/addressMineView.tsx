import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Dto } from 'vona-module-a-web';

import { DtoAddressMineItem } from './addressMineItem.tsx';

export interface IDtoOptionsAddressMineView extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsAddressMineView>()
export class DtoAddressMineView extends DtoAddressMineItem {}
