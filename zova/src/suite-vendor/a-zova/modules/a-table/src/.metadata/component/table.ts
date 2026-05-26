import type { TypeControllerInnerProps } from 'zova';

import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerTableProps } from '../../component/table/controller.jsx';

import { ControllerTable } from '../../component/table/controller.jsx';
import { RenderTable } from '../../component/table/render.jsx';
export type ZTableProps<TData extends {} = {}> = {
  controllerRef?: (ref: ControllerTable<TData>) => void;
} & ControllerTableProps<TData>;

type ControllerInnerProps<TData extends {} = {}> = TypeControllerInnerProps<
  ControllerTableProps<TData>,
  keyof typeof ControllerTable.$propsDefault
>;
declare module 'zova-module-a-table' {
  export interface ControllerTable<TData extends {} = {}> {
    $props: ControllerInnerProps<TData>;
  }
}
declare module 'zova-module-a-table' {
  export interface RenderTable<TData extends {} = {}> extends ControllerTable<TData> {}
}
export const ZTable = defineComponent(<TData extends {} = {}>(_props: ZTableProps<TData>) => {
  useController(ControllerTable, RenderTable, undefined);
  return () => {};
}, prepareComponentOptions());
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'a-table:table': ControllerTableProps;
  }
}
