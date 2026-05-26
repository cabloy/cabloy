import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';
import { ISchemaRenderComponentPresetRecord } from 'zova-module-a-openapi';

import type { ControllerFormFieldPresetProps } from '../../component/formFieldPreset/controller.jsx';

import { ControllerFormFieldPreset } from '../../component/formFieldPreset/controller.jsx';
export type ZFormFieldPresetProps<
  PresetName extends keyof ISchemaRenderComponentPresetRecord = never,
> = {
  controllerRef?: (ref: ControllerFormFieldPreset<PresetName>) => void;
} & ControllerFormFieldPresetProps<PresetName>;

type ControllerInnerProps<PresetName extends keyof ISchemaRenderComponentPresetRecord = never> =
  TypeControllerInnerProps<
    ControllerFormFieldPresetProps<PresetName>,
    keyof typeof ControllerFormFieldPreset.$propsDefault
  >;
declare module 'zova-module-a-form' {
  export interface ControllerFormFieldPreset<
    PresetName extends keyof ISchemaRenderComponentPresetRecord = never,
  > {
    $props: ControllerInnerProps<PresetName>;
  }
}

export const ZFormFieldPreset = defineComponent(
  <PresetName extends keyof ISchemaRenderComponentPresetRecord = never>(
    _props: ZFormFieldPresetProps<PresetName>,
  ) => {
    useController(ControllerFormFieldPreset, undefined, undefined);
    return () => {};
  },
  prepareComponentOptions(ControllerFormFieldPreset.$componentOptions),
);
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'a-form:formFieldPreset': ControllerFormFieldPresetProps;
  }
}
