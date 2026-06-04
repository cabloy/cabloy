import { z } from 'zod';
import { createZovaComponentPage } from 'zova';

import { ControllerPageHome } from '../../page/home/controller.jsx';
import { ControllerPageHomeSchemaParams } from '../../page/home/controller.jsx';
export namespace NSControllerPageHome {
  export const paramsSchema = ControllerPageHomeSchemaParams;
  export type ParamsInput = z.input<typeof ControllerPageHomeSchemaParams>;
  export type ParamsOutput = z.output<typeof ControllerPageHomeSchemaParams>;
}

export const ZPageHome = createZovaComponentPage(ControllerPageHome, undefined, undefined);
