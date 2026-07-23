import { z } from 'zod';
import { createZovaComponentPage } from 'zova';

import { ControllerPageOrders } from '../../page/orders/controller.jsx';
import {
  ControllerPageOrdersSchemaParams,
  ControllerPageOrdersSchemaQuery,
} from '../../page/orders/controller.jsx';
export namespace NSControllerPageOrders {
  export const paramsSchema = ControllerPageOrdersSchemaParams;
  export type ParamsInput = z.input<typeof ControllerPageOrdersSchemaParams>;
  export type ParamsOutput = z.output<typeof ControllerPageOrdersSchemaParams>;

  export const querySchema = ControllerPageOrdersSchemaQuery;
  export type QueryInput = z.input<typeof ControllerPageOrdersSchemaQuery>;
  export type QueryOutput = z.output<typeof ControllerPageOrdersSchemaQuery>;
}

export const ZPageOrders = createZovaComponentPage(ControllerPageOrders, undefined, undefined);
