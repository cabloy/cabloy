import { z } from 'zod';
import { createZovaComponentPage } from 'zova';

import { ControllerPageToolTwo } from '../../page/toolTwo/controller.jsx';
import {
  ControllerPageToolTwoSchemaParams,
  ControllerPageToolTwoSchemaQuery,
} from '../../page/toolTwo/controller.jsx';
export namespace NSControllerPageToolTwo {
  export const paramsSchema = ControllerPageToolTwoSchemaParams;
  export type ParamsInput = z.input<typeof ControllerPageToolTwoSchemaParams>;
  export type ParamsOutput = z.output<typeof ControllerPageToolTwoSchemaParams>;

  export const querySchema = ControllerPageToolTwoSchemaQuery;
  export type QueryInput = z.input<typeof ControllerPageToolTwoSchemaQuery>;
  export type QueryOutput = z.output<typeof ControllerPageToolTwoSchemaQuery>;
}

export const ZPageToolTwo = createZovaComponentPage(ControllerPageToolTwo, undefined, undefined);
