import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { addressMineWriteColumns } from '../lib/addressMine.ts';
import { ModelAddress } from '../model/address.ts';

export interface IDtoOptionsAddressMineUpdate extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsAddressMineUpdate>()
export class DtoAddressMineUpdate extends $Dto.update(() => ModelAddress, {
  columns: addressMineWriteColumns,
}) {}
