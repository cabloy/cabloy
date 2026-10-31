import { classes } from 'typestyle';
import { BeanRenderBase, Use } from 'zova';
import { Render } from 'zova-module-a-bean';
import { ZIcon } from 'zova-module-a-icon';

import type { RenderLayoutWeb } from './render.tsx';

@Render()
export class RenderHeader extends BeanRenderBase {
  @Use()
  $$r: RenderLayoutWeb;

  public render() {
    return (
      <>
        <div class="navbar bg-base-300 w-full flex-wrap lg:flex-nowrap">
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
          <div class="order-last mx-2 min-w-0 basis-full px-2 lg:order-none lg:basis-auto lg:flex-1">
            {this.$$r.$$renderTabs.renderTabs()}
          </div>
          <div
            ref={ref => this.setHeaderActionsElement?.((ref as HTMLDivElement | null) ?? undefined)}
            class={classes('relative ml-auto flex-none lg:ml-0', this.cHeaderActions)}
            data-testid="header-actions"
            onFocusout={event => this.onHeaderActionsFocusout?.(event)}
            onKeydown={event => this.onHeaderActionsKeydown(event)}
          >
            <button
              type="button"
              class="btn btn-square btn-ghost lg:hidden"
              aria-label={this.scope.locale.MoreActions()}
              title={this.scope.locale.MoreActions()}
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
                {this.$$r.$$renderUser.render()}
              </ul>
            </div>
          </div>
        </div>
      </>
    );
  }
}
