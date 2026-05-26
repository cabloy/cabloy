import type {
  IFormMeta,
  IFormProvider,
  ISchemaObjectExtensionField,
  TypeFormScene,
} from 'zova-module-a-openapi';

import { isNil } from '@cabloy/utils';
import { VNode } from 'vue';
import { z } from 'zod';
import { BeanControllerPageBase, deepExtend, Use, usePrepareArg } from 'zova';
import { ZovaJsx } from 'zova-jsx';
import { Controller } from 'zova-module-a-bean';
import { formMetaFromFormScene } from 'zova-module-a-form';
import { $QueryAutoLoad } from 'zova-module-a-model';
import { ZPage } from 'zova-module-home-base';

import type { ModelResource } from '../../model/resource.js';

export const ControllerPageEntrySchemaParams = z.object({
  resource: z.string(),
  id: z.string().optional(),
  formScene: z.string().optional(),
});

@Controller()
export class ControllerPageEntry extends BeanControllerPageBase {
  formMeta: IFormMeta;
  formProvider: IFormProvider;
  formSchema?: ISchemaObjectExtensionField;
  jsxZova: ZovaJsx;

  @Use({ beanFullName: 'rest-resource.model.resource' })
  get $$modelResource(): ModelResource {
    return usePrepareArg(this.$params.resource, true);
  }

  get resource() {
    return this.$params.resource;
  }

  get entryId() {
    return this.$params.id;
  }

  get formScene() {
    return (
      (this.$params.formScene as TypeFormScene | undefined) ??
      (isNil(this.entryId) ? 'create' : 'view')
    );
  }

  protected async __init__() {
    this.formMeta = this.$computed(() => {
      const formScene = this.formScene;
      return { ...formMetaFromFormScene(formScene), formScene };
    });
    this.formProvider = this.$computed(() => {
      return this.$$modelResource.formProvider;
    });
    this.formSchema = this.$computed(() => {
      return this.$$modelResource.getFormSchema(this.formMeta);
    });
    // jsx
    this._prepareJsx();
    // load schema
    await $QueryAutoLoad(() => this.$$modelResource.getFormApiSchemas(this.formMeta)?.sdk);
  }

  private _prepareJsx() {
    this.jsxZova = this.bean._newBeanSimple(ZovaJsx, false, this.formProvider.components);
  }

  protected render() {
    const blocks = this.formSchema?.rest?.blocks;
    if (!blocks || blocks.length === 0) return;
    let domBlocks: VNode[] = [];
    blocks.forEach((block, index) => {
      const options = deepExtend(
        { key: index },
        {
          resource: this.resource,
          id: this.entryId,
          formScene: this.formScene,
        },
        block.options,
      );
      const domBlock = this.jsxZova.render(block.render!, options);
      if (!domBlock) return;
      if (Array.isArray(domBlock)) {
        domBlocks.push(...domBlock);
      } else {
        domBlocks.push(domBlock);
      }
    });
    return <ZPage>{domBlocks}</ZPage>;
  }
}
