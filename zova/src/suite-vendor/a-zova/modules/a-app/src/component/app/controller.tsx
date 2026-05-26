import { RouterView } from '@cabloy/vue-router';
import { BeanControllerBase, IComponentOptions, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { BeanBehaviorsHolder } from 'zova-module-a-behavior';

@Controller()
export class ControllerApp extends BeanControllerBase {
  static $componentOptions: IComponentOptions = { inheritAttrs: false };

  @Use()
  $$beanBehaviorsHolder: BeanBehaviorsHolder;

  protected async __init__() {
    this._initMeta();
    await this._initBehaviors();
  }

  private _initMeta() {
    this.$useMeta(() => {
      return {
        title: this.sys.env.APP_TITLE,
        meta: {
          description: {
            name: 'description',
            content: this.sys.env.APP_DESCRIPTION,
          },
          viewport: {
            name: 'viewport',
            content: this.sys.env.APP_META_VIEWPORT,
          },
        },
        htmlAttr: {
          lang: this.app.meta.locale.current,
        },
      };
    });
  }

  private async _initBehaviors() {
    await this.$$beanBehaviorsHolder.initialize({
      behaviorTag: undefined as any,
      behaviors: () => {
        return this._getAppBehaviors();
      },
    });
  }

  private _getAppBehaviors() {
    return this.scope.config.behaviors;
  }

  protected render() {
    return this.$$beanBehaviorsHolder.render(() => {
      return <RouterView />;
    });
  }
}
