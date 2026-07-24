import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Dto } from 'vona-module-a-web';

import { DtoAddressMineCreate } from './addressMineCreate.tsx';

export interface IDtoOptionsAddressMineUpdate extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsAddressMineUpdate>()
export class DtoAddressMineUpdate extends DtoAddressMineCreate {}
