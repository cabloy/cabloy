import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import { ControllerFormFieldRelationDetail } from '../../component/formFieldRelationDetail/controller.jsx';
export type ZFormFieldRelationDetailProps = {
  controllerRef?: (ref: ControllerFormFieldRelationDetail) => void;
};

export const ZFormFieldRelationDetail = defineComponent((_props: ZFormFieldRelationDetailProps) => {
  useController(ControllerFormFieldRelationDetail, undefined, undefined);
  return () => {};
}, prepareComponentOptions());
