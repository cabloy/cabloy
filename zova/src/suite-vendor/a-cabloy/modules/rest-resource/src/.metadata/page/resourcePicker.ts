import { z } from 'zod';
import { createZovaComponentPage } from 'zova';

import { ControllerPageResourcePicker } from '../../page/resourcePicker/controller.jsx';
import { ControllerPageResourcePickerSchemaParams } from '../../page/resourcePicker/controller.jsx';
export namespace NSControllerPageResourcePicker {
  export const paramsSchema = ControllerPageResourcePickerSchemaParams;
  export type ParamsInput = z.input<typeof ControllerPageResourcePickerSchemaParams>;
  export type ParamsOutput = z.output<typeof ControllerPageResourcePickerSchemaParams>;
}

export const ZPageResourcePicker = createZovaComponentPage(
  ControllerPageResourcePicker,
  undefined,
  undefined,
);
