import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import { ControllerBlockDetails } from '../../component/blockDetails/controller.jsx';
export type ZBlockDetailsProps = {
  controllerRef?: (ref: ControllerBlockDetails) => void;
};

export const ZBlockDetails = defineComponent((_props: ZBlockDetailsProps) => {
  useController(ControllerBlockDetails, undefined, undefined);
  return () => {};
}, prepareComponentOptions());
