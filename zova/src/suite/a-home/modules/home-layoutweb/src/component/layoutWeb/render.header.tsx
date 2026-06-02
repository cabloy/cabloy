import { BeanRenderBase, Use } from 'zova';
import { Render } from 'zova-module-a-bean';

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
                this.toggleLeftDrawer();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="inline-block h-5 w-5 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
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
