import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import { ControllerLayoutWeb } from '../../component/layoutWeb/controller.jsx';
export type ZLayoutWebProps = {
  controllerRef?: (ref: ControllerLayoutWeb) => void;
};

export const ZLayoutWeb = defineComponent((_props: ZLayoutWebProps) => {
  useController(ControllerLayoutWeb, undefined, undefined);
  return () => {};
}, prepareComponentOptions());
