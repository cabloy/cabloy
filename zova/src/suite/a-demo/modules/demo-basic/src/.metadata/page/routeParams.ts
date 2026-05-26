import { z } from 'zod';
import { createZovaComponentPage } from 'zova';

import { ControllerPageRouteParams } from '../../page/routeParams/controller.jsx';
import {
  ControllerPageRouteParamsSchemaParams,
  ControllerPageRouteParamsSchemaQuery,
} from '../../page/routeParams/controller.jsx';
export namespace NSControllerPageRouteParams {
  export const paramsSchema = ControllerPageRouteParamsSchemaParams;
  export type ParamsInput = z.input<typeof ControllerPageRouteParamsSchemaParams>;
  export type ParamsOutput = z.output<typeof ControllerPageRouteParamsSchemaParams>;

  export const querySchema = ControllerPageRouteParamsSchemaQuery;
  export type QueryInput = z.input<typeof ControllerPageRouteParamsSchemaQuery>;
  export type QueryOutput = z.output<typeof ControllerPageRouteParamsSchemaQuery>;
}

export const ZPageRouteParams = createZovaComponentPage(
  ControllerPageRouteParams,
  undefined,
  undefined,
);
