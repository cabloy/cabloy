import { BeanRenderBase, Use } from 'zova';
import { Render } from 'zova-module-a-bean';

import type { RenderLayoutAdmin } from './render.jsx';

@Render()
export class RenderContent extends BeanRenderBase {
  @Use()
  $$r: RenderLayoutAdmin;

  public render() {
    return this.$$r.$$renderTabs._renderRouterViewTabs();
  }
}
