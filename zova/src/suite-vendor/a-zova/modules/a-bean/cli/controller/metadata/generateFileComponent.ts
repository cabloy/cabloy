import type { IMetadataCustomGenerateOptions } from '@cabloy/cli';
import type { IGlobBeanFile } from '@cabloy/module-info';

import type { IControllerInfo } from './types.ts';

import { combineContentRenderAndStyle } from './utils.ts';

export async function generateFileComponent(
  options: IMetadataCustomGenerateOptions,
  globFile: IGlobBeanFile,
  controllerInfo: IControllerInfo,
) {
  const { moduleName } = options;
  const { className } = globFile;
  const {
    type,
    name,
    nameCapitalize,
    controllerExtJs,
    hasComponentOptions,
    nameProps,
    hasProps,
    hasGeneric,
    nameModels,
    hasModels,
    hasModelValue,
    generic,
    genericKeys,
    generateImports,
    importRenderFirst,
    hasRenderFirst,
    classNameRenderFirst,
    importStyleFirst,
    hasStyleFirst,
    classNameStyleFirst,
  } = controllerInfo;
  const contentImports: string[] = [];
  if (generateImports) {
    contentImports.push(...generateImports);
  }
  const genericDeclare = hasGeneric ? `<${generic}>` : '';
  const genericArguments = hasGeneric ? `<${genericKeys?.join(', ')}>` : '';
  const componentOptions = hasComponentOptions
    ? `Controller${nameCapitalize}.$componentOptions`
    : '';
  // import
  const _contentImportTypeZova: string[] = [];
  if (hasModels) {
    _contentImportTypeZova.push(
      'DefineModelOptions',
      'TypePropUpdateFromModel',
      'TypePropValueFromModel',
    );
  }
  if (hasProps) _contentImportTypeZova.push('TypeControllerInnerProps');
  if (_contentImportTypeZova.length > 0) {
    contentImports.push(`import type { ${_contentImportTypeZova.join(', ')} } from 'zova';`);
  }
  const _contentImportTypeController: string[] = [];
  if (hasModels) _contentImportTypeController.push(nameModels);
  if (hasProps) _contentImportTypeController.push(nameProps);
  if (_contentImportTypeController.length > 0) {
    contentImports.push(
      `import type { ${_contentImportTypeController.join(', ')} } from '../../component/${name}/controller${controllerExtJs}';`,
    );
  }
  if (type === 'component' && name === 'routedDialog') {
    contentImports.push(
      "import { routeLocationKey, routerKey, routerViewLocationKey, viewDepthKey } from '@cabloy/vue-router';",
      "import { computed, provide, shallowReactive } from 'vue';",
    );
  }
  contentImports.push("import { defineComponent } from 'vue'");
  contentImports.push("import { prepareComponentOptions, useController } from 'zova';");
  // controller
  contentImports.push(
    `import { ${className} } from '../../component/${name}/controller${controllerExtJs}';`,
  );
  // render
  if (hasRenderFirst) {
    contentImports.push(importRenderFirst);
  }
  // style
  if (hasStyleFirst) {
    contentImports.push(importStyleFirst);
  }
  // TypeControllerPublicProps
  const typeControllerPublicPropsName = `Z${nameCapitalize}Props`;
  let contentTypeControllerPublicProps = `export type ${typeControllerPublicPropsName}${genericDeclare} = {
    controllerRef?: (ref: ${className}${genericArguments}) => void;
  }`;
  if (hasProps) {
    contentTypeControllerPublicProps += ` & ${nameProps}${genericArguments}`;
  }
  if (hasModels) {
    contentTypeControllerPublicProps += ` & ${nameModels}${genericArguments} &
{
  [KEY in keyof ${nameModels}${genericArguments} as TypePropValueFromModel<KEY>]: ${nameModels}${genericArguments}[KEY];
} &
{
  [KEY in keyof ${nameModels}${genericArguments} as TypePropUpdateFromModel<KEY>]: (value: ${nameModels}${genericArguments}[KEY]) => void;
};`;
  }
  // TypeModelArguments
  let contentTypeModelArguments = '';
  if (hasModels) {
    contentTypeModelArguments = `type TypeModelArguments${genericDeclare} = {
      [KEY in keyof ${nameModels}${genericArguments} as TypePropValueFromModel<KEY>]: ${nameModels}${genericArguments}[KEY];
    };`;
  }
  // ControllerInnerProps
  let contentControllerInnerProps = '';
  if (hasProps) {
    let contentControllerInnerProps_models = '';
    if (hasModels) {
      contentControllerInnerProps_models = ` & {
        [KEY in keyof ${nameModels}${genericArguments} as TypePropValueFromModel<KEY>]: ${nameModels}${genericArguments}[KEY];
      }`;
    }
    contentControllerInnerProps = `type ControllerInnerProps${genericDeclare} =
      TypeControllerInnerProps<${nameProps}${genericArguments}${contentControllerInnerProps_models}, keyof typeof ${className}.$propsDefault>;`;
  }
  // Controller
  const contentControllerInterfaceMethods: string[] = [];
  if (hasProps) {
    contentControllerInterfaceMethods.push(`$props: ControllerInnerProps${genericArguments};`);
  }
  if (hasModels) {
    contentControllerInterfaceMethods.push(
      `$useModel<K extends keyof TypeModelArguments${genericArguments}>(name: K, options?: DefineModelOptions<TypeModelArguments${genericArguments}[K]>): ControllerInnerProps${genericArguments}[K];`,
    );
  }
  if (hasModelValue) {
    contentControllerInterfaceMethods.push(
      `$useModel(options?: DefineModelOptions<TypeModelArguments${genericArguments}['modelValue']>): ControllerInnerProps${genericArguments}['modelValue'];`,
    );
  }
  let contentControllerInterface = '';
  if (hasProps || hasModels) {
    contentControllerInterface = `declare module 'zova-module-${moduleName}' {
      export interface ${className}${genericDeclare} {
        ${contentControllerInterfaceMethods.join('\n')}
      }
    }`;
  }
  // component
  const contentComponent =
    type === 'component' && name === 'routedDialog'
      ? `export const Z${nameCapitalize} = defineComponent(
    ${genericDeclare}(props: ${typeControllerPublicPropsName}${genericArguments}) => {
      const router = props.item.state.router;
      if (router) {
        const currentRoute = router.currentRoute;
        const reactiveRoute = {} as Record<string, unknown>;
        for (const key in currentRoute.value) {
          Object.defineProperty(reactiveRoute, key, {
            get: () => currentRoute.value[key],
            enumerable: true,
          });
        }
        provide(routerKey, router.router);
        provide(routeLocationKey, shallowReactive(reactiveRoute) as any);
        provide(routerViewLocationKey, currentRoute);
        provide(
          viewDepthKey,
          computed(() => router.getEmbeddedRouterViewDepth(currentRoute.value)),
        );
      }
      useController(${className}, ${hasRenderFirst ? classNameRenderFirst : undefined}, ${hasStyleFirst ? classNameStyleFirst : undefined});
      return () => {};
    },
    {
      ...prepareComponentOptions(${componentOptions}),
      props: {
        item: { type: Object, required: true },
      },
    },
  );`
      : `export const Z${nameCapitalize} = defineComponent(
    ${genericDeclare}(_props: ${typeControllerPublicPropsName}${genericArguments}) => {
      useController(${className}, ${hasRenderFirst ? classNameRenderFirst : undefined}, ${hasStyleFirst ? classNameStyleFirst : undefined});
      return () => {};
    },
    prepareComponentOptions(${componentOptions}),
  );`;
  // rest props
  let contentRestPropsType = '';
  if (hasProps) {
    contentRestPropsType += `${nameProps}`;
  }
  if (hasModels) {
    if (hasProps) {
      contentRestPropsType += ' & ';
    }
    contentRestPropsType += `${nameModels} &
{
  [KEY in keyof ${nameModels} as TypePropValueFromModel<KEY>]: ${nameModels}[KEY];
} &
{
  [KEY in keyof ${nameModels} as TypePropUpdateFromModel<KEY>]: (value: ${nameModels}[KEY]) => void;
}`;
  }
  let contentRestProps = '';
  if (contentRestPropsType) {
    contentRestProps = `declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    '${moduleName}:${name}': ${contentRestPropsType};
  }
}`;
  }
  // content
  const content = `${contentImports.join('\n')}
${contentTypeControllerPublicProps}
${contentTypeModelArguments}
${contentControllerInnerProps}
${contentControllerInterface}
${combineContentRenderAndStyle(controllerInfo, moduleName, className, genericDeclare, genericArguments)}
${contentComponent}
${contentRestProps}
`;
  // ok
  return content;
}
