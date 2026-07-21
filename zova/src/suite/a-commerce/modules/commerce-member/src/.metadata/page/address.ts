import { z } from 'zod';
import { createZovaComponentPage } from 'zova';

import { ControllerPageAddress } from '../../page/address/controller.jsx';
import {
  ControllerPageAddressSchemaParams,
  ControllerPageAddressSchemaQuery,
} from '../../page/address/controller.jsx';
export namespace NSControllerPageAddress {
  export const paramsSchema = ControllerPageAddressSchemaParams;
  export type ParamsInput = z.input<typeof ControllerPageAddressSchemaParams>;
  export type ParamsOutput = z.output<typeof ControllerPageAddressSchemaParams>;

  export const querySchema = ControllerPageAddressSchemaQuery;
  export type QueryInput = z.input<typeof ControllerPageAddressSchemaQuery>;
  export type QueryOutput = z.output<typeof ControllerPageAddressSchemaQuery>;
}

export const ZPageAddress = createZovaComponentPage(ControllerPageAddress, undefined, undefined);
