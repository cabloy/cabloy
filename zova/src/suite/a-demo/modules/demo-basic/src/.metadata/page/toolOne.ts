import { z } from 'zod';
import { createZovaComponentPage } from 'zova';

import { ControllerPageToolOne } from '../../page/toolOne/controller.jsx';
import {
  ControllerPageToolOneSchemaParams,
  ControllerPageToolOneSchemaQuery,
} from '../../page/toolOne/controller.jsx';
import { RenderPageToolOne } from '../../page/toolOne/render.jsx';
export namespace NSControllerPageToolOne {
  export const paramsSchema = ControllerPageToolOneSchemaParams;
  export type ParamsInput = z.input<typeof ControllerPageToolOneSchemaParams>;
  export type ParamsOutput = z.output<typeof ControllerPageToolOneSchemaParams>;

  export const querySchema = ControllerPageToolOneSchemaQuery;
  export type QueryInput = z.input<typeof ControllerPageToolOneSchemaQuery>;
  export type QueryOutput = z.output<typeof ControllerPageToolOneSchemaQuery>;
}
declare module 'zova-module-demo-basic' {
  export interface RenderPageToolOne extends ControllerPageToolOne {}
}
export const ZPageToolOne = createZovaComponentPage(
  ControllerPageToolOne,
  RenderPageToolOne,
  undefined,
);
