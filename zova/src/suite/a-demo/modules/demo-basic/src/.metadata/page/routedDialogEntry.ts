import { z } from 'zod';
import { createZovaComponentPage } from 'zova';

import { ControllerPageRoutedDialogEntry } from '../../page/routedDialogEntry/controller.jsx';
import {
  ControllerPageRoutedDialogEntrySchemaParams,
  ControllerPageRoutedDialogEntrySchemaQuery,
} from '../../page/routedDialogEntry/controller.jsx';
export namespace NSControllerPageRoutedDialogEntry {
  export const paramsSchema = ControllerPageRoutedDialogEntrySchemaParams;
  export type ParamsInput = z.input<typeof ControllerPageRoutedDialogEntrySchemaParams>;
  export type ParamsOutput = z.output<typeof ControllerPageRoutedDialogEntrySchemaParams>;

  export const querySchema = ControllerPageRoutedDialogEntrySchemaQuery;
  export type QueryInput = z.input<typeof ControllerPageRoutedDialogEntrySchemaQuery>;
  export type QueryOutput = z.output<typeof ControllerPageRoutedDialogEntrySchemaQuery>;
}

export const ZPageRoutedDialogEntry = createZovaComponentPage(
  ControllerPageRoutedDialogEntry,
  undefined,
  undefined,
);
