import { BeanRenderBase, Use } from 'zova';
import { Render } from 'zova-module-a-bean';

import type { RenderLayoutAdmin } from './render.jsx';

@Render()
export class RenderSidebar extends BeanRenderBase {
  @Use()
  $$r: RenderLayoutAdmin;

  public render() {
    return (
      <div
        class="drawer-side"
        style={{ width: `${this.$scopeBase.config.layout.sidebar.width}px` }}
      >
        <label htmlFor="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"></label>
        {this.$$r.$$renderMenu.render()}
      </div>
    );
  }
}
