import { RouterLink } from '@cabloy/vue-router';
import { classes } from 'typestyle';
import { BeanRenderBase, Use } from 'zova';
import { Render } from 'zova-module-a-bean';
import { ZIcon } from 'zova-module-a-icon';
import { ZRouterViewEmpty } from 'zova-module-a-router';
import { ZButton } from 'zova-module-basic-button';

import { RenderLocale } from './render.locale.tsx';
import { RenderTheme } from './render.theme.tsx';
import { RenderUser } from './render.user.tsx';

@Render()
export class RenderLayoutMine extends BeanRenderBase {
  @Use()
  $$renderLocale: RenderLocale;

  @Use()
  $$renderTheme: RenderTheme;

  @Use()
  $$renderUser: RenderUser;

  public render() {
    return (
      <div class={this.cLayout} data-testid="layout-mine">
        <header class="navbar sticky top-0 z-20 flex-wrap gap-2 bg-base-300">
          <a
            class="btn btn-square btn-ghost"
            href={this.app.$getPagePathHome()}
            aria-label={this.scope.locale.Home()}
          >
            <ZIcon name=":social:cabloy" width={24} />
          </a>
          <span class="min-w-0 flex-1 text-xl">{this.sys.env.APP_TITLE}</span>
          <a class="btn btn-ghost shrink-0" href={this.app.$getPagePathHome()}>
            {this.scope.locale.Home()}
          </a>
          <ZButton
            data-testid="mine-menu-toggle"
            class="btn btn-ghost lg:hidden"
            aria-expanded={this.mobileMenuOpen}
            aria-controls="home-layoutmine-navigation"
            onPerform={() => {
              this.closeHeaderActions();
              this.mobileMenuOpen = !this.mobileMenuOpen;
            }}
          >
            {this.scope.locale.PersonalCenter()}
          </ZButton>
          <div
            ref={ref => {
              if (!this.ctx.disposed)
                this.setHeaderActionsElement?.((ref as HTMLDivElement | null) ?? undefined);
            }}
            class="relative ml-auto flex-none lg:ml-0"
            data-testid="header-actions"
            onFocusout={event => {
              if (!this.ctx.disposed) this.onHeaderActionsFocusout?.(event);
            }}
            onKeydown={event => {
              if (!this.ctx.disposed) this.onHeaderActionsKeydown?.(event);
            }}
          >
            <ZButton
              type="button"
              class="btn btn-square btn-ghost lg:hidden"
              aria-label={this.scope.locale.MoreActions()}
              title={this.scope.locale.MoreActions()}
              aria-expanded={this.headerActionsOpen}
              aria-controls={this.headerActionsId}
              onPerform={() => this.toggleHeaderActions()}
            >
              <ZIcon name="::more-horiz" width={24} aria-hidden="true" />
            </ZButton>
            <div
              id={this.headerActionsId}
              class={classes(
                'header-actions-panel absolute right-0 top-full z-30 rounded-box bg-base-100 shadow-lg lg:static lg:bg-transparent lg:shadow-none',
                this.headerActionsOpen ? 'block' : 'hidden',
                'lg:block',
              )}
            >
              <ul class="menu w-full lg:w-auto lg:menu-horizontal">
                {this.$$renderLocale.render()}
                {this.$$renderTheme.renderThemeDark()}
                {this.$$renderUser.render()}
              </ul>
            </div>
          </div>
        </header>
        <div class="mine-body">
          <aside
            class={classes(
              'mine-sidebar border-base-300 bg-base-200 lg:block',
              this.mobileMenuOpen ? 'block' : 'hidden',
            )}
          >
            <nav
              id="home-layoutmine-navigation"
              data-testid="mine-navigation"
              aria-label={this.scope.locale.PersonalCenter()}
            >
              <ul class="menu w-full gap-1 p-4">
                <li class="menu-title">{this.scope.locale.PersonalCenter()}</li>
                {this.menuGroups.map(group => {
                  const items = group.items.map(item => {
                    const active = this.$currentRoute?.path === item.href;
                    return (
                      <li
                        key={item.path}
                        onClick={() => {
                          this.mobileMenuOpen = false;
                        }}
                      >
                        <RouterLink
                          to={item.href}
                          class={active ? 'active text-primary' : ''}
                          aria-current={active ? 'page' : undefined}
                        >
                          {item.title}
                        </RouterLink>
                      </li>
                    );
                  });
                  return group.title ? (
                    <li key={group.title}>
                      <span class="menu-title">{group.title}</span>
                      <ul>{items}</ul>
                    </li>
                  ) : (
                    items
                  );
                })}
              </ul>
            </nav>
          </aside>
          <main class="min-w-0">
            <ZRouterViewEmpty />
          </main>
        </div>
      </div>
    );
  }
}
