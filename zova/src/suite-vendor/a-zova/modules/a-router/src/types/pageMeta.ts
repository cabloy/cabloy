import type { VNodeChild } from 'vue';
import type { IFormMeta } from 'zova-module-a-openapi';

import type { IRouteViewRouteItem, IRouteViewTabCurrent } from './routerView.ts';

export interface IPageMeta {
  pageTitle?: string;
  pageDirty?: boolean;
  formMeta?: IFormMeta;
  onCustomRender?: (tabItem: IRouteViewRouteItem) => VNodeChild;
  onCustomRenderIsolate?: (tabCurrent: IRouteViewTabCurrent) => VNodeChild;
}
