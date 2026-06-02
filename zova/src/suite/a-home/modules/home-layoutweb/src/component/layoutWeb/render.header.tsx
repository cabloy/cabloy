import { BeanRenderBase, Use } from 'zova';
import { Render } from 'zova-module-a-bean';
import { ZIcon } from 'zova-module-a-icon';

import type { RenderLayoutWeb } from './render.jsx';

@Render()
export class RenderHeader extends BeanRenderBase {
  @Use()
  $$r: RenderLayoutWeb;

  public render() {
    return (
      <>
        <div class="navbar bg-base-300 w-full">
          <div class="flex-none">
            <button
              class="btn btn-square btn-ghost"
              onClick={() => {
                this.app.$gotoHome();
              }}
            >
              <ZIcon name=":social:cabloy" width={24}></ZIcon>
            </button>
          </div>
          <div class="text-xl px-4">{this.sys.env.APP_TITLE}</div>
          <div class="mx-2 flex-2 px-2">{this.$$r.$$renderTabs.renderTabs()}</div>
          <div class="hidden flex-none lg:block">
            <ul class="menu menu-horizontal">
              {this.$$r.$$renderLocale.render()}
              {this.$$r.$$renderTheme.renderThemeDark()}
              {this.sys.config.ssr.cookie && this.$$r.$$renderTheme.renderThemeName()}
            </ul>
          </div>
        </div>
      </>
    );
  }
}
