import { z } from 'zod';
import { createZovaComponentPage } from 'zova';

import { ControllerPageRouteQuery } from '../../page/routeQuery/controller.jsx';
import {
  ControllerPageRouteQuerySchemaParams,
  ControllerPageRouteQuerySchemaQuery,
} from '../../page/routeQuery/controller.jsx';
export namespace NSControllerPageRouteQuery {
  export const paramsSchema = ControllerPageRouteQuerySchemaParams;
  export type ParamsInput = z.input<typeof ControllerPageRouteQuerySchemaParams>;
  export type ParamsOutput = z.output<typeof ControllerPageRouteQuerySchemaParams>;

  export const querySchema = ControllerPageRouteQuerySchemaQuery;
  export type QueryInput = z.input<typeof ControllerPageRouteQuerySchemaQuery>;
  export type QueryOutput = z.output<typeof ControllerPageRouteQuerySchemaQuery>;
}

export const ZPageRouteQuery = createZovaComponentPage(
  ControllerPageRouteQuery,
  undefined,
  undefined,
);
