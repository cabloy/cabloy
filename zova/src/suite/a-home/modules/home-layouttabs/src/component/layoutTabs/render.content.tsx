import { BeanRenderBase, Use } from 'zova';
import { Render } from 'zova-module-a-bean';

import type { RenderLayoutTabs } from './render.jsx';

@Render()
export class RenderContent extends BeanRenderBase {
  @Use()
  $$r: RenderLayoutTabs;

  public render() {
    return this.$$r.$$renderTabs._renderRouterViewTabs();
  }
}
