import { z } from 'zod';
import { createZovaComponentPage } from 'zova';

import { ControllerPageOrder } from '../../page/order/controller.jsx';
import {
  ControllerPageOrderSchemaParams,
  ControllerPageOrderSchemaQuery,
} from '../../page/order/controller.jsx';
export namespace NSControllerPageOrder {
  export const paramsSchema = ControllerPageOrderSchemaParams;
  export type ParamsInput = z.input<typeof ControllerPageOrderSchemaParams>;
  export type ParamsOutput = z.output<typeof ControllerPageOrderSchemaParams>;

  export const querySchema = ControllerPageOrderSchemaQuery;
  export type QueryInput = z.input<typeof ControllerPageOrderSchemaQuery>;
  export type QueryOutput = z.output<typeof ControllerPageOrderSchemaQuery>;
}

export const ZPageOrder = createZovaComponentPage(ControllerPageOrder, undefined, undefined);
