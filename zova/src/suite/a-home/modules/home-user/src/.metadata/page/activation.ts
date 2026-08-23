import { z } from 'zod';
import { createZovaComponentPage } from 'zova';

import { ControllerPageActivation } from '../../page/activation/controller.jsx';
import { ControllerPageActivationSchemaQuery } from '../../page/activation/controller.jsx';
export namespace NSControllerPageActivation {
  export const querySchema = ControllerPageActivationSchemaQuery;
  export type QueryInput = z.input<typeof ControllerPageActivationSchemaQuery>;
  export type QueryOutput = z.output<typeof ControllerPageActivationSchemaQuery>;
}

export const ZPageActivation = createZovaComponentPage(
  ControllerPageActivation,
  undefined,
  undefined,
);
