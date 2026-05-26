import type { ParserOptions } from '@babel/parser';
import type { IGlobBeanFile, OnionSceneMeta } from '@cabloy/module-info';
import type { GoGoAST } from 'gogocode';

import type { BeanCliBase } from '../lib/bean.cli.base.ts';
import type { ICommandContext } from './argv.ts';

export interface ICliBuildCustomOptions {
  cli: BeanCliBase;
  env: NodeJS.ProcessEnv;
  outDir: string;
  projectPath: string;
}

export interface IMetadataCustomGenerateOptions {
  cli: BeanCliBase;
  sceneName: string;
  sceneNameCapitalize: string;
  sceneMeta: OnionSceneMeta;
  moduleName: string;
  modulePath: string;
  globFiles: IGlobBeanFile[];
}

export type TypeMetadataCustomGenerate = (
  options: IMetadataCustomGenerateOptions,
) => Promise<string>;

export interface IEjsData extends ICommandContext {
  cli: BeanCliBase;
}

export interface IAstData<LANGUAGE extends TypeParseLanguage> extends ICommandContext {
  cli: BeanCliBase;
  ast: TypeParseResult<LANGUAGE>;
  snippet: ISnippet<LANGUAGE>;
}

export interface IInitData extends ICommandContext {
  cli: BeanCliBase;
  targetFile: string;
}

export type TypeParseLanguage = 'plain' | 'json' | 'gogo' | '';
export type TypeParseResult<LANGUAGE extends TypeParseLanguage> = LANGUAGE extends 'plain'
  ? string
  : LANGUAGE extends 'json'
    ? any
    : GoGoAST;
export type TypeParseOptions<LANGUAGE extends TypeParseLanguage> = LANGUAGE extends 'plain'
  ? never
  : LANGUAGE extends 'json'
    ? never
    : ParserOptions;

export interface ISnippet<LANGUAGE extends TypeParseLanguage = ''> {
  language?: LANGUAGE;
  format?: boolean;
  file: string | ((ejsData: IEjsData) => string);
  init?: string | ((initData: IInitData) => Promise<string>);
  parseOptions?: TypeParseOptions<LANGUAGE>;
  transform: (astData: IAstData<LANGUAGE>) => Promise<TypeParseResult<LANGUAGE>>;
}
export function metadataCustomSnippet<LANGUAGE extends TypeParseLanguage>(
  snippet: ISnippet<LANGUAGE>,
) {
  return snippet;
}
