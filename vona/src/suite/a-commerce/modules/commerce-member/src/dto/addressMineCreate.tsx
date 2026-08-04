import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { addressMineWriteColumns } from '../lib/addressMine.ts';
import { ModelAddress } from '../model/address.ts';

export interface IDtoOptionsAddressMineCreate extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsAddressMineCreate>()
export class DtoAddressMineCreate extends $Dto.create(() => ModelAddress, {
  columns: addressMineWriteColumns,
}) {}
