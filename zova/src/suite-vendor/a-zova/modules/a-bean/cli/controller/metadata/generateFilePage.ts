import type { IMetadataCustomGenerateOptions } from '@cabloy/cli';
import type { IGlobBeanFile } from '@cabloy/module-info';

import type { IControllerInfo } from './types.ts';

import { combineContentRenderAndStyle } from './utils.ts';

export async function generateFilePage(
  options: IMetadataCustomGenerateOptions,
  globFile: IGlobBeanFile,
  controllerInfo: IControllerInfo,
) {
  const { moduleName } = options;
  const { className } = globFile;
  const {
    name,
    nameCapitalize,
    controllerExtJs,
    importRenderFirst,
    hasRenderFirst,
    classNameRenderFirst,
    importStyleFirst,
    hasStyleFirst,
    classNameStyleFirst,
  } = controllerInfo;
  const { nameSchemaParams, hasSchemaParams, nameSchemaQuery, hasSchemaQuery } = controllerInfo;
  const contentImports: string[] = [];
  // controller
  contentImports.push("import { createZovaComponentPage } from 'zova';");
  contentImports.push(
    `import { ControllerPage${nameCapitalize} } from '../../page/${name}/controller${controllerExtJs}';`,
  );
  // render
  if (hasRenderFirst) {
    contentImports.push(importRenderFirst);
  }
  // style
  if (hasStyleFirst) {
    contentImports.push(importStyleFirst);
  }
  // params/query
  const _contentImports_parts: string[] = [];
  if (hasSchemaParams) _contentImports_parts.push(nameSchemaParams);
  if (hasSchemaQuery) _contentImports_parts.push(nameSchemaQuery);
  if (_contentImports_parts.length > 0) {
    contentImports.push(
      `import { ${_contentImports_parts.join(', ')} } from '../../page/${name}/controller${controllerExtJs}';`,
    );
  }
  //
  const _contentRecords2_parts: string[] = [];
  if (hasSchemaParams) {
    _contentRecords2_parts.push(`export const paramsSchema = ${nameSchemaParams};
      export type ParamsInput = z.input<typeof ${nameSchemaParams}>;
      export type ParamsOutput = z.output<typeof ${nameSchemaParams}>;
    `);
  }
  if (hasSchemaQuery) {
    _contentRecords2_parts.push(`export const querySchema = ${nameSchemaQuery};
      export type QueryInput = z.input<typeof ${nameSchemaQuery}>;
      export type QueryOutput = z.output<typeof ${nameSchemaQuery}>;
    `);
  }
  if (_contentRecords2_parts.length > 0) {
    contentImports.push("import { z } from 'zod';");
    contentImports.push(`export namespace NS${className} {
      ${_contentRecords2_parts.join('\n')}
    }`);
  }
  // page
  const contentPage = `export const ZPage${nameCapitalize} = createZovaComponentPage(${className}, ${hasRenderFirst ? classNameRenderFirst : undefined}, ${hasStyleFirst ? classNameStyleFirst : undefined});`;
  // content
  const content = `${contentImports.join('\n')}
  ${combineContentRenderAndStyle(controllerInfo, moduleName, className, '', '')}
  ${contentPage}
  `;
  return content;
}
