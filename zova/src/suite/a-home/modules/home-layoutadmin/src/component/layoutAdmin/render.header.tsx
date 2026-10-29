import { classes } from 'typestyle';
import { BeanRenderBase, Use } from 'zova';
import { Render } from 'zova-module-a-bean';
import { ZIcon } from 'zova-module-a-icon';

import type { RenderLayoutAdmin } from './render.tsx';

@Render()
export class RenderHeader extends BeanRenderBase {
  @Use()
  $$r: RenderLayoutAdmin;

  public render() {
    return (
      <>
        <div class={classes('navbar bg-base-300 w-full', this.cHeader)}>
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
          <div class="header-title text-xl px-4">{this.sys.env.APP_TITLE}</div>
          <div class="header-navigation mx-2 min-w-0 flex-2 px-2">
            {this.$$r.$$renderTabs.renderTabItems()}
          </div>
          <div
            ref={ref => {
              if (!this.ctx.disposed)
                this.setHeaderActionsElement?.((ref as HTMLDivElement | null) ?? undefined);
            }}
            class={classes('relative flex-none', this.cHeaderActions)}
            data-testid="header-actions"
            onFocusout={event => this.onHeaderActionsFocusout(event)}
            onKeydown={event => this.onHeaderActionsKeydown(event)}
          >
            <button
              type="button"
              class="btn btn-square btn-ghost lg:hidden"
              aria-label={this.scope.locale.MoreActions()}
              aria-expanded={this.headerActionsOpen}
              aria-controls={this.headerActionsId}
              onClick={() => this.toggleHeaderActions()}
            >
              <ZIcon name="::more-horiz" width={24} aria-hidden="true" />
            </button>
            <div
              id={this.headerActionsId}
              class={classes(
                'header-actions-panel absolute right-0 top-full z-30 rounded-box bg-base-100 shadow-lg lg:static lg:bg-transparent lg:shadow-none',
                this.headerActionsOpen ? 'block' : 'hidden',
                'lg:block',
              )}
            >
              <ul class="menu w-full lg:w-auto lg:menu-horizontal">
                {this.$$r.$$renderLocale.render()}
                {this.$$r.$$renderTheme.renderThemeDark()}
                {this.$$r.$$renderTheme.renderThemeName()}
                {this.$$r.$$renderUser.render()}
              </ul>
            </div>
          </div>
        </div>
        <div class="navbar bg-base-300 w-full">{this.$$r.$$renderTabs.renderTabs()}</div>
      </>
    );
  }
}
