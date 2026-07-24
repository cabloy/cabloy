import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { EntityAddress } from '../entity/address.tsx';

export interface IDtoOptionsAddressMineReq extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsAddressMineReq>()
export class DtoAddressMineReq extends $Dto.queryPage(EntityAddress, []) {}
