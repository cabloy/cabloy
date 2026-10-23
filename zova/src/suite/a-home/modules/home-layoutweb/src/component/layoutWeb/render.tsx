import { classes } from 'typestyle';
import { BeanRenderBase, Use } from 'zova';
import { Render } from 'zova-module-a-bean';

import { RenderContent } from './render.content.tsx';
import { RenderHeader } from './render.header.tsx';
import { RenderLocale } from './render.locale.tsx';
import { RenderTabs } from './render.tabs.tsx';
import { RenderTheme } from './render.theme.tsx';
import { RenderUser } from './render.user.tsx';

@Render()
export class RenderLayoutWeb extends BeanRenderBase {
  @Use()
  $$renderTheme: RenderTheme;

  @Use()
  $$renderLocale: RenderLocale;

  @Use()
  $$renderTabs: RenderTabs;

  @Use()
  $$renderUser: RenderUser;

  @Use()
  $$renderContent: RenderContent;

  @Use()
  $$renderHeader: RenderHeader;

  public render() {
    return (
      <div class={classes('drawer', this.leftDrawerOpen ? 'drawer-open' : false)}>
        <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content">
          {this.$$renderHeader.render()}
          {this.$$renderContent.render()}
        </div>
      </div>
    );
  }
}
