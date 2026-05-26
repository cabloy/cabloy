import type { IControllerInfo } from './types.ts';

export function combineContentRenderAndStyle(
  controllerInfo: IControllerInfo,
  moduleName: string,
  className: string,
  genericDeclare: string,
  genericArguments: string,
) {
  const {
    hasRenderFirst,
    classNameRenderFirst,
    classNameRenderOthers,
    hasStyleFirst,
    classNameStyleFirst,
    classNameStyleOthers,
  } = controllerInfo;
  const contentControllerInterfaceRecords: string[] = [];
  if (hasStyleFirst) {
    contentControllerInterfaceRecords.push(
      `export interface ${classNameStyleFirst}${genericDeclare} extends ${className}${genericArguments} {}`,
    );
  }
  for (const item of classNameStyleOthers) {
    contentControllerInterfaceRecords.push(
      `export interface ${item}${genericDeclare} extends ${className}${genericArguments} {}`,
    );
  }
  if (hasRenderFirst) {
    if (hasStyleFirst) {
      contentControllerInterfaceRecords.push(
        `export interface ${classNameRenderFirst}${genericDeclare} extends ${classNameStyleFirst}${genericArguments} {}`,
      );
    } else {
      contentControllerInterfaceRecords.push(
        `export interface ${classNameRenderFirst}${genericDeclare} extends ${className}${genericArguments} {}`,
      );
    }
  }
  for (const item of classNameRenderOthers) {
    if (hasStyleFirst) {
      contentControllerInterfaceRecords.push(
        `export interface ${item}${genericDeclare} extends ${classNameStyleFirst}${genericArguments} {}`,
      );
    } else {
      contentControllerInterfaceRecords.push(
        `export interface ${item}${genericDeclare} extends ${className}${genericArguments} {}`,
      );
    }
  }
  if (contentControllerInterfaceRecords.length === 0) return '';
  return `declare module 'zova-module-${moduleName}' {
    ${contentControllerInterfaceRecords.join('\n')}
  }`;
}
