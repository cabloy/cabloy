import { z } from 'zod';
import { createZovaComponentPage } from 'zova';

import { ControllerPageRouteQueryB } from '../../page/routeQueryB/controller.jsx';
import {
  ControllerPageRouteQueryBSchemaParams,
  ControllerPageRouteQueryBSchemaQuery,
} from '../../page/routeQueryB/controller.jsx';
export namespace NSControllerPageRouteQueryB {
  export const paramsSchema = ControllerPageRouteQueryBSchemaParams;
  export type ParamsInput = z.input<typeof ControllerPageRouteQueryBSchemaParams>;
  export type ParamsOutput = z.output<typeof ControllerPageRouteQueryBSchemaParams>;

  export const querySchema = ControllerPageRouteQueryBSchemaQuery;
  export type QueryInput = z.input<typeof ControllerPageRouteQueryBSchemaQuery>;
  export type QueryOutput = z.output<typeof ControllerPageRouteQueryBSchemaQuery>;
}

export const ZPageRouteQueryB = createZovaComponentPage(
  ControllerPageRouteQueryB,
  undefined,
  undefined,
);
