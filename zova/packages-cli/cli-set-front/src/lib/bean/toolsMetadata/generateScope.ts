export interface GenerateScopeOptions {
  config: string;
  errors: string;
  locales: string;
  constants: string;
}
export async function generateScope(
  moduleName: string,
  relativeNameCapitalize: string,
  scopeResources: Record<string, boolean>,
  options: GenerateScopeOptions,
) {
  const contentImports: string[] = [];
  const contentRecords: string[] = [];
  // basic
  contentImports.push('BeanScopeBase');
  // util
  contentImports.push('type BeanScopeUtil');
  contentRecords.push('util: BeanScopeUtil;');
  //
  if (options.config) {
    contentImports.push('TypeModuleConfig');
    contentRecords.push('config: TypeModuleConfig<typeof config>;');
  }
  if (options.errors) {
    contentImports.push('TypeModuleErrors');
    contentRecords.push('error: TypeModuleErrors<typeof errors>;');
  }
  if (options.locales) {
    contentImports.push('TypeModuleLocales');
    contentImports.push('TypeLocaleBase');
    contentRecords.push('locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;');
  }
  if (options.constants) {
    contentImports.push('TypeModuleConstants');
    contentRecords.push('constant: TypeModuleConstants<typeof constants>;');
  }
  // loop
  for (const sceneName in scopeResources) {
    contentRecords.push(`${sceneName}: ${scopeResources[sceneName]};`);
  }
  // combine
  const content = `/** scope: begin */
import { ${contentImports.join(', ')} } from 'zova';
import { Scope } from '${moduleName === 'a-bean' ? '../lib/scope.js' : 'zova-module-a-bean'}';

@Scope()
export class ScopeModule${relativeNameCapitalize} extends BeanScopeBase {}

export interface ScopeModule${relativeNameCapitalize} {
  ${contentRecords.join('\n')}
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    '${moduleName}': ScopeModule${relativeNameCapitalize};
  }
  
  ${
    options.config
      ? `export interface IBeanScopeConfig {
    '${moduleName}': ReturnType<typeof config>;
  }`
      : ''
  }

  ${
    options.locales
      ? `export interface IBeanScopeLocale {
    '${moduleName}': (typeof locales)[TypeLocaleBase];
  }`
      : ''
  }

  ${
    options.errors
      ? `export interface IBeanScopeErrors {
    '${moduleName}': typeof errors;
  }`
      : ''
  }
}
${
  options.locales
    ? `\nexport function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): \`${moduleName}::\${K}\` {
  return \`${moduleName}::\${key}\`;
}`
    : ''
}  
/** scope: end */
`;
  return content;
}
