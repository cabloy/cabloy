import { VAppBar, VAppBarNavIcon, VSpacer, VToolbarTitle } from 'vuetify/components';
import { BeanRenderBase, Use } from 'zova';
import { Render } from 'zova-module-a-bean';
import { $iconName } from 'zova-module-a-icon';

import type { RenderLayoutWeb } from './render.jsx';

@Render()
export class RenderHeader extends BeanRenderBase {
  @Use()
  $$r: RenderLayoutWeb;

  public render() {
    return (
      <VAppBar style={{ transition: 'none' }}>
        <VAppBarNavIcon
          icon={$iconName(':social:cabloy')}
          variant="text"
          nativeOnClick={() => this.app.$gotoHome()}
        ></VAppBarNavIcon>
        <VToolbarTitle>{this.sys.env.APP_TITLE}</VToolbarTitle>
        {this.$$r.$$renderTabs.renderTabs()}
        <VSpacer></VSpacer>
        {this.$$r.$$renderLocale.render()}
        {this.$$r.$$renderTheme.renderThemeDark()}
        {this.sys.config.ssr.cookie && this.$$r.$$renderTheme.renderThemeName()}
      </VAppBar>
    );
  }
}
