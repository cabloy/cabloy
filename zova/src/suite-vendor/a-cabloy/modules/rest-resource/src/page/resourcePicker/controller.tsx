import type { VNode } from 'vue';

import { z } from 'zod';
import { BeanControllerPageBase, deepExtend, Use, usePrepareArg } from 'zova';
import { ZovaJsx } from 'zova-jsx';
import { Controller } from 'zova-module-a-bean';
import { $QueryEnsureLoaded } from 'zova-module-a-model';
import { ZPage } from 'zova-module-home-base';

import type {
  IResourcePickerPageContext,
  IResourcePickerPageHost,
} from '../../lib/resourcePicker.js';
import type { ModelResource } from '../../model/resource.js';

import { ZResourcePickerContext } from '../../.metadata/component/resourcePickerContext.js';
import { resourcePickerPageHostKey } from '../../lib/resourcePicker.js';

export const ControllerPageResourcePickerSchemaParams = z.object({
  resource: z.string(),
});

@Controller()
export class ControllerPageResourcePicker extends BeanControllerPageBase {
  jsxZova: ZovaJsx;

  @Use({ beanFullName: 'rest-resource.model.resource' })
  get $$modelResource(): ModelResource {
    return usePrepareArg(this.resource, true);
  }

  @Use({ name: resourcePickerPageHostKey, injectionScope: 'host' })
  $$pickerHost: IResourcePickerPageHost | undefined;

  get resource() {
    return this.$params.resource;
  }

  get pickerContext(): IResourcePickerPageContext {
    const host = this.$$pickerHost;
    if (!host) {
      throw new Error('resource picker requires a page host');
    }
    const options = host.options;
    const session = host.session;
    if (options.resource !== this.resource) {
      throw new Error('resource picker context does not match route resource');
    }
    return {
      options,
      session,
      dialog: host,
    };
  }

  protected async __init__() {
    this.jsxZova = this.bean._newBeanSimple(ZovaJsx, false);
    await $QueryEnsureLoaded(() => this.$$modelResource.apiSchemasSelect.sdk);
  }

  get schemaRow() {
    return this.$$modelResource.schemaRow;
  }

  public render() {
    const pickerContext = this.pickerContext;
    const blocks = this.$$pickerHost!.prepareBlocks(this.schemaRow?.rest?.blocks, pickerContext);
    if (!blocks || blocks.length === 0) return;
    const domBlocks: VNode[] = [];
    blocks.forEach((block, index) => {
      const options = deepExtend({ key: index }, { resource: this.resource }, block.options);
      const domBlock = this.jsxZova.render(block.render!, options);
      if (!domBlock) return;
      if (Array.isArray(domBlock)) domBlocks.push(...domBlock);
      else domBlocks.push(domBlock);
    });
    return (
      <ZResourcePickerContext context={pickerContext}>
        <ZPage>{domBlocks}</ZPage>
      </ZResourcePickerContext>
    );
  }
}

export type { IResourcePickerPageContext } from '../../lib/resourcePicker.js';
