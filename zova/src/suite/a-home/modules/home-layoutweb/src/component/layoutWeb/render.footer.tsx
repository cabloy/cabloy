import { VFooter } from 'vuetify/components';
import { BeanRenderBase } from 'zova';
import { Render } from 'zova-module-a-bean';

@Render()
export class RenderFooter extends BeanRenderBase {
  public render() {
    return (
      <VFooter
        class="d-flex flex-column ga-2 py-4"
        style={{ position: 'fixed', bottom: '0px', width: '100%' }}
      >
        Powered by cabloy/vona/zova
      </VFooter>
    );
  }
}
