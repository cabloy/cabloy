import type { IMetadataCustomGenerateOptions } from '@cabloy/cli';
import type { IGlobBeanFile } from '@cabloy/module-info';

import { toUpperCaseFirstChar } from '@cabloy/word-utils';
import fse from 'fs-extra';
import { globbySync } from 'globby';
import path from 'node:path';

import type { IControllerInfo } from './types.ts';

import { extractGenericParamsAndImports } from './_extractGenericParams.ts';
import { generateFile } from './generateFile.ts';
import { generateMetaComponent } from './generateMetaComponent.ts';
import { generateMetaPage } from './generateMetaPage.ts';

// const __regProps = /interface Controller[^<]*Props<(.*?)>/;

export default async function (options: IMetadataCustomGenerateOptions): Promise<string> {
  const { globFiles } = options;
  const globFilesPage: [IGlobBeanFile, IControllerInfo][] = [];
  const globFilesComponent: [IGlobBeanFile, IControllerInfo][] = [];
  for (const globFile of globFiles) {
    if (globFile.isIgnore) continue;
    const controllerInfo = _parseControllerInfo(options, globFile);
    if (!controllerInfo) continue;
    await generateFile(options, globFile, controllerInfo);
    if (controllerInfo.type === 'page') {
      globFilesPage.push([globFile, controllerInfo]);
    } else {
      globFilesComponent.push([globFile, controllerInfo]);
    }
  }
  const contentMetaPage = await generateMetaPage(options, globFilesPage);
  const contentMetaComponent = generateMetaComponent(options, globFilesComponent);
  const content = `${contentMetaPage}\n${contentMetaComponent}`;
  return content;
}

function _parseControllerInfo(
  options: IMetadataCustomGenerateOptions,
  globFile: IGlobBeanFile,
): IControllerInfo | undefined {
  const { className, fileContent, fileNameJSRelative, file } = globFile;
  const matches = fileNameJSRelative.match(/..\/(.+?)\/(.+?)\/controller(.jsx?)$/);
  if (!matches) return;
  const type = matches[1];
  if (!['page', 'component'].includes(type)) return;
  const name = matches[2];
  const nameCapitalize = toUpperCaseFirstChar(name);
  const controllerExtJs = matches[3];
  const controllerExtTs = controllerExtJs.replace('.js', '.ts');
  // componentOptions
  const componentOptionsMatched = fileContent.match(
    /static \$componentOptions[^=]* = (\{[\s\S]*?\});/,
  );
  const componentOptions = componentOptionsMatched ? componentOptionsMatched[1] : '';
  const hasComponentOptions = !!componentOptionsMatched;
  // props
  const nameProps = `${className}Props`;
  const hasProps = fileContent.includes(nameProps);
  // model
  const nameModels = `${className}Models`;
  const hasModels = fileContent.includes(nameModels);
  const hasModelValue = fileContent.includes("'vModel'");
  // generic
  const matchGeneric = hasProps && extractGenericParamsAndImports(file, nameProps); // fileContent.match(__regProps);
  const hasGeneric = !!(matchGeneric && matchGeneric.genericParams);
  const generic = hasGeneric ? matchGeneric.genericParams : undefined;
  const genericKeys = hasGeneric
    ? matchGeneric.genericParams.split(',').map(item => item.trim().split(' ')[0])
    : undefined;
  const generateImports = hasGeneric ? matchGeneric.imports : undefined;
  // schemaParams
  const nameSchemaParams = `${className}SchemaParams`;
  const hasSchemaParams = fileContent.includes(nameSchemaParams);
  // schemaQuery
  const nameSchemaQuery = `${className}SchemaQuery`;
  const hasSchemaQuery = fileContent.includes(nameSchemaQuery);
  // render
  const fileRenderFirst = path.join(options.modulePath, `src/${type}/${name}/render.tsx`);
  const hasRenderFirst = fse.existsSync(fileRenderFirst);
  const classNameRenderFirst = `Render${type === 'page' ? 'Page' : ''}${nameCapitalize}`;
  const importRenderFirst = `import { ${classNameRenderFirst} } from '../../${type}/${name}/render.jsx';`;
  const fileRenderOthers = globbySync(`src/${type}/${name}/render.*.tsx`, {
    cwd: options.modulePath,
  });
  const nameRenderOthers: string[] = fileRenderOthers.map(
    item => /render\.(.*)\.tsx/.exec(item)![1],
  );
  const classNameRenderOthers: string[] = nameRenderOthers.map(
    item => `Render${type === 'page' ? 'Page' : ''}${toUpperCaseFirstChar(item)}`,
  );
  const importRenderOthers: string[] = nameRenderOthers.map(
    item =>
      `import { ${`Render${type === 'page' ? 'Page' : ''}${toUpperCaseFirstChar(item)}`} } from '../../${type}/${name}/render.${item}.jsx';`,
  );
  // style
  const fileStyleFirst = path.join(options.modulePath, `src/${type}/${name}/style.ts`);
  const hasStyleFirst = fse.existsSync(fileStyleFirst);
  const classNameStyleFirst = `Style${type === 'page' ? 'Page' : ''}${nameCapitalize}`;
  const importStyleFirst = `import { ${classNameStyleFirst} } from '../../${type}/${name}/style.js';`;
  const fileStyleOthers = globbySync(`src/${type}/${name}/style.*.ts`, { cwd: options.modulePath });
  const nameStyleOthers: string[] = fileStyleOthers.map(item => /style\.(.*)\.ts/.exec(item)![1]);
  const classNameStyleOthers: string[] = nameStyleOthers.map(
    item => `Style${type === 'page' ? 'Page' : ''}${toUpperCaseFirstChar(item)}`,
  );
  const importStyleOthers: string[] = nameStyleOthers.map(
    item =>
      `import { ${`Style${type === 'page' ? 'Page' : ''}${toUpperCaseFirstChar(item)}`} } from '../../${type}/${name}/style.${item}.js';`,
  );
  // ok
  return {
    type,
    name,
    nameCapitalize,
    controllerExtJs,
    controllerExtTs,
    componentOptions,
    hasComponentOptions,
    nameProps,
    hasProps,
    nameModels,
    hasModels,
    hasModelValue,
    hasGeneric,
    generic,
    genericKeys,
    generateImports,
    nameSchemaParams,
    hasSchemaParams,
    nameSchemaQuery,
    hasSchemaQuery,
    // render
    fileRenderFirst,
    hasRenderFirst,
    classNameRenderFirst,
    importRenderFirst,
    fileRenderOthers,
    nameRenderOthers,
    classNameRenderOthers,
    importRenderOthers,
    // style
    fileStyleFirst,
    hasStyleFirst,
    classNameStyleFirst,
    importStyleFirst,
    fileStyleOthers,
    nameStyleOthers,
    classNameStyleOthers,
    importStyleOthers,
  };
}
