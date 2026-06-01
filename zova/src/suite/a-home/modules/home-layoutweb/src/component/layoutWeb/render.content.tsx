import { BeanRenderBase, Use } from 'zova';
import { Render } from 'zova-module-a-bean';

import type { RenderLayoutWeb } from './render.jsx';

@Render()
export class RenderContent extends BeanRenderBase {
  @Use()
  $$r: RenderLayoutWeb;

  public render() {
    return this.$$r.$$renderTabs._renderRouterViewTabs();
  }
}
