import { VApp, VMain } from 'vuetify/components';
import { BeanRenderBase, Use } from 'zova';
import { Render } from 'zova-module-a-bean';

import { RenderContent } from './render.content.jsx';
import { RenderHeader } from './render.header.jsx';
import { RenderLocale } from './render.locale.jsx';
import { RenderTabs } from './render.tabs.jsx';
import { RenderTheme } from './render.theme.jsx';

@Render()
export class RenderLayoutWeb extends BeanRenderBase {
  @Use()
  $$renderTheme: RenderTheme;

  @Use()
  $$renderLocale: RenderLocale;

  @Use()
  $$renderTabs: RenderTabs;

  @Use()
  $$renderContent: RenderContent;

  @Use()
  $$renderHeader: RenderHeader;

  public render() {
    return (
      <VApp>
        {this.$$renderHeader.render()}
        <VMain style={{ transition: 'none', marginBottom: '56px' }}>
          {this.$$renderContent.render()}
        </VMain>
        {this.$$renderFooter.render()}
      </VApp>
    );
  }
}
