import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { addressMineReadColumns } from '../lib/addressMine.ts';
import { ModelAddress } from '../model/address.ts';

export interface IDtoOptionsAddressMineItem extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsAddressMineItem>()
export class DtoAddressMineItem extends $Dto.get(() => ModelAddress, {
  columns: addressMineReadColumns,
}) {}
