import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { ModelShipment } from '../model/shipment.ts';

export interface IDtoOptionsShipmentView extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsShipmentView>()
export class DtoShipmentView extends $Dto.get(() => ModelShipment, {
  columns: ['id', 'carrier', 'trackingNumber', 'shippedAt'],
}) {}
