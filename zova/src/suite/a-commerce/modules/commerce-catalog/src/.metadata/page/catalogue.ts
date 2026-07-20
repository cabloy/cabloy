import { z } from 'zod';
import { createZovaComponentPage } from 'zova';

import { ControllerPageCatalogue } from '../../page/catalogue/controller.jsx';
import {
  ControllerPageCatalogueSchemaParams,
  ControllerPageCatalogueSchemaQuery,
} from '../../page/catalogue/controller.jsx';
export namespace NSControllerPageCatalogue {
  export const paramsSchema = ControllerPageCatalogueSchemaParams;
  export type ParamsInput = z.input<typeof ControllerPageCatalogueSchemaParams>;
  export type ParamsOutput = z.output<typeof ControllerPageCatalogueSchemaParams>;

  export const querySchema = ControllerPageCatalogueSchemaQuery;
  export type QueryInput = z.input<typeof ControllerPageCatalogueSchemaQuery>;
  export type QueryOutput = z.output<typeof ControllerPageCatalogueSchemaQuery>;
}

export const ZPageCatalogue = createZovaComponentPage(
  ControllerPageCatalogue,
  undefined,
  undefined,
);
