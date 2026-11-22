import type { IComponentOptions } from 'zova';
import type {
  IJsxRenderContextPageEntry,
  IResourceFormActionRowOptionsBase,
} from 'zova-module-a-openapi';

import { RouterLink } from '@cabloy/vue-router';
import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZIcon } from 'zova-module-a-icon';

declare module 'zova-module-a-openapi' {
  export interface IResourceFormActionRowRecord {
    'basic-form:actionEdit'?: ControllerActionEditProps;
  }
}

export interface ControllerActionEditProps extends IResourceFormActionRowOptionsBase {}

@Controller()
export class ControllerActionEdit extends BeanControllerBase {
  static $propsDefault = { class: 'btn btn-primary join-item' };
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextPageEntry;

  protected async __init__() {}

  protected render() {
    const { $$pageEntry } = this.$$renderContext;
    const resource = this.$props.resource ?? $$pageEntry.resource;
    const id = this.$props.id ?? $$pageEntry.entryId;
    if (!resource || id == null) return;
    const to = this.$router.getPagePath('/rest/resource/:resource/:id/:formScene?', {
      params: { resource, id: id.toString(), formScene: 'edit' },
    });
    return (
      <RouterLink class={this.$props.class} to={to}>
        <ZIcon name="::draft" width={24} aria-hidden="true"></ZIcon>
        {this.scope.locale.Edit()}
      </RouterLink>
    );
  }
}
