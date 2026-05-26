import fse from 'fs-extra';
import { createRequire } from 'node:module';
import path from 'node:path';

import type { VonaBinConfigOptions } from './types.ts';

import { copyTemplateIfNeed, pathToHref } from '../../utils.ts';

const __ImportZodCore = 'zod/v4/core';

export async function generateZod(configOptions: VonaBinConfigOptions) {
  await __generateZodCoreUtil(configOptions);
  await __generateZodCoreSchemas(configOptions);
}

async function __generateZodCoreUtil(configOptions: VonaBinConfigOptions) {
  const pathZodCore = parseZodCorePath(configOptions.appDir);
  const fileSrc = path.join(pathZodCore, 'util.js');
  const fileSrcBak = path.join(pathZodCore, 'util-origin.js');
  copyTemplateIfNeed(fileSrc, fileSrcBak);
  const content = fse.readFileSync(fileSrcBak).toString();
  const contentNew = content
    .replace(
      'export function finalizeIssue',
      `let __localeAdapterFn;
export function setLocaleAdapter(localeAdapterFn) {
  __localeAdapterFn=localeAdapterFn;
}
export function finalizeIssue`,
    )
    .replace(
      'const message = unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ??',
      `const msg = unwrapMessage(iss.inst?._zod.def?.error?.(iss));
        const message = (__localeAdapterFn?__localeAdapterFn(msg, iss):msg) ??`,
    );
  fse.writeFileSync(fileSrc, contentNew);
}

async function __generateZodCoreSchemas(configOptions: VonaBinConfigOptions) {
  const pathZodCore = parseZodCorePath(configOptions.appDir);
  const fileSrc = path.join(pathZodCore, 'schemas.js');
  const fileSrcBak = path.join(pathZodCore, 'schemas-origin.js');
  copyTemplateIfNeed(fileSrc, fileSrcBak);
  const content = fse.readFileSync(fileSrcBak).toString();
  const contentNew = content
    .replace(
      'export const $ZodType =',
      `let __parseAdapterFn;
export function setParseAdapter(parseAdapterFn) {
    __parseAdapterFn = parseAdapterFn;
}
export const $ZodType =`,
    )
    .replace(
      'inst._zod.run = inst._zod.parse;',
      'inst._zod.run = __parseAdapterFn ? __parseAdapterFn(inst, inst._zod.parse) : inst._zod.parse;',
    )
    .replace(
      /inst._zod.run = (\(payload, ctx\) => \{[\s\S]*?return runChecks\(result, checks, ctx\);\s*\};)/,
      (_, $0) => {
        return `const __run = ${$0}\ninst._zod.run = __parseAdapterFn ? __parseAdapterFn(inst, __run) : __run;`;
      },
    );
  fse.writeFileSync(fileSrc, contentNew);
}

function parseZodCorePath(appDir: string) {
  const require = createRequire(pathToHref(path.join(appDir, '/')));
  const fileCoreIndex = require.resolve(__ImportZodCore);
  return path.dirname(fileCoreIndex);
}
