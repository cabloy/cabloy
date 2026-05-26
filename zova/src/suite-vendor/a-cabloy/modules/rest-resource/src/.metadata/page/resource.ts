import { z } from 'zod';
import { createZovaComponentPage } from 'zova';

import { ControllerPageResource } from '../../page/resource/controller.jsx';
import { ControllerPageResourceSchemaParams } from '../../page/resource/controller.jsx';
export namespace NSControllerPageResource {
  export const paramsSchema = ControllerPageResourceSchemaParams;
  export type ParamsInput = z.input<typeof ControllerPageResourceSchemaParams>;
  export type ParamsOutput = z.output<typeof ControllerPageResourceSchemaParams>;
}

export const ZPageResource = createZovaComponentPage(ControllerPageResource, undefined, undefined);
