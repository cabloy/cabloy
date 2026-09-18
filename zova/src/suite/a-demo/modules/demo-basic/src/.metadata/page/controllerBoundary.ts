import { z } from 'zod';
import { createZovaComponentPage } from 'zova';

import { ControllerPageControllerBoundary } from '../../page/controllerBoundary/controller.jsx';
import {
  ControllerPageControllerBoundarySchemaParams,
  ControllerPageControllerBoundarySchemaQuery,
} from '../../page/controllerBoundary/controller.jsx';
export namespace NSControllerPageControllerBoundary {
  export const paramsSchema = ControllerPageControllerBoundarySchemaParams;
  export type ParamsInput = z.input<typeof ControllerPageControllerBoundarySchemaParams>;
  export type ParamsOutput = z.output<typeof ControllerPageControllerBoundarySchemaParams>;

  export const querySchema = ControllerPageControllerBoundarySchemaQuery;
  export type QueryInput = z.input<typeof ControllerPageControllerBoundarySchemaQuery>;
  export type QueryOutput = z.output<typeof ControllerPageControllerBoundarySchemaQuery>;
}

export const ZPageControllerBoundary = createZovaComponentPage(
  ControllerPageControllerBoundary,
  undefined,
  undefined,
);
