import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { ModelOrder } from '../model/order.ts';

export interface IDtoOptionsOrderSelectResItem extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsOrderSelectResItem>()
export class DtoOrderSelectResItem extends $Dto.get(() => ModelOrder) {}
