import { z } from 'zod';
import { createZovaComponentPage } from 'zova';

import { ControllerPageRoutedDialogDetail } from '../../page/routedDialogDetail/controller.jsx';
import {
  ControllerPageRoutedDialogDetailSchemaParams,
  ControllerPageRoutedDialogDetailSchemaQuery,
} from '../../page/routedDialogDetail/controller.jsx';
export namespace NSControllerPageRoutedDialogDetail {
  export const paramsSchema = ControllerPageRoutedDialogDetailSchemaParams;
  export type ParamsInput = z.input<typeof ControllerPageRoutedDialogDetailSchemaParams>;
  export type ParamsOutput = z.output<typeof ControllerPageRoutedDialogDetailSchemaParams>;

  export const querySchema = ControllerPageRoutedDialogDetailSchemaQuery;
  export type QueryInput = z.input<typeof ControllerPageRoutedDialogDetailSchemaQuery>;
  export type QueryOutput = z.output<typeof ControllerPageRoutedDialogDetailSchemaQuery>;
}

export const ZPageRoutedDialogDetail = createZovaComponentPage(
  ControllerPageRoutedDialogDetail,
  undefined,
  undefined,
);
