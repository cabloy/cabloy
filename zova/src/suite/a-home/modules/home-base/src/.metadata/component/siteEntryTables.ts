import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import { ControllerSiteEntryTables } from '../../component/siteEntryTables/controller.jsx';
export type ZSiteEntryTablesProps = {
  controllerRef?: (ref: ControllerSiteEntryTables) => void;
};

export const ZSiteEntryTables = defineComponent((_props: ZSiteEntryTablesProps) => {
  useController(ControllerSiteEntryTables, undefined, undefined);
  return () => {};
}, prepareComponentOptions());
