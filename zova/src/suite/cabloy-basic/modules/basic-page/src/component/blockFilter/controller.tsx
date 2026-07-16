import type { IComponentOptions } from 'zova';
import type {
  IFormMeta,
  IJsxRenderContextPage,
  IResourceBlockOptionsBase,
  IResourceFormFieldLayoutOptions,
  IResourceRenderBlockOptionsBlock,
} from 'zova-module-a-openapi';

import { isNilOrEmptyString } from '@cabloy/utils';
import { VNode } from 'vue';
import { BeanControllerBase, objectAssignReactive, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ControllerForm, TypeFormOnSubmitData, ZForm } from 'zova-module-a-form';

import { IPageFilterScope } from '../../types/page.js';

declare module 'zova-module-a-openapi' {
  export interface IResourceBlockRecord {
    'basic-page:blockFilter'?: ControllerBlockFilterProps;
  }
}

export interface ControllerBlockFilterProps extends IResourceBlockOptionsBase {
  blocks?: IResourceRenderBlockOptionsBlock[];
  formFieldLayout?: IResourceFormFieldLayoutOptions;
}

@Controller()
export class ControllerBlockFilter extends BeanControllerBase {
  static $propsDefault = {
    formFieldLayout: { inline: true },
  };

  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  formMeta: IFormMeta;
  formRef: ControllerForm | undefined;
  formScope: IPageFilterScope;

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextPage;

  protected async __init__() {
    this.formMeta = { formMode: 'edit' };
    this.formScope = this._prepareFormScope();
  }

  get schemaFilter() {
    const { $$page } = this.$$renderContext;
    return $$page.schemaFilter;
  }

  submitData(data: TypeFormOnSubmitData) {
    this._onFilter(data.value);
  }

  resetData(data: any) {
    this._onFilter(data);
  }

  public submitFilter() {
    return this.formRef?.submit() ?? Promise.resolve(false);
  }

  public resetFilter() {
    if (!this.formRef) return;
    const data = this.formRef.reset();
    this.resetData(data);
  }

  _onFilter(dataOld: any) {
    const { $$page } = this.$$renderContext;
    const dataNew = {};
    for (const key in dataOld) {
      const value = dataOld[key];
      if (!isNilOrEmptyString(value)) {
        dataNew[key] = value;
      }
    }
    $$page.onFilter(dataNew);
  }

  protected render() {
    const { $$page } = this.$$renderContext;
    const blocks = this.$props.blocks;
    const hasBlocks = !!blocks && blocks.length > 0;
    const formFieldLayout = this.$props.formFieldLayout;
    return (
      <ZForm
        class={this.$props.class}
        controllerRef={ref => {
          this.formRef = ref;
        }}
        data={$$page.queryFilterData}
        schema={this.schemaFilter}
        schemaScene="filter"
        formMeta={this.formMeta}
        formFieldLayout={formFieldLayout}
        blocks={blocks}
        formScope={this.formScope}
        onSubmitData={data => this.submitData(data as never)}
        slotFooter={hasBlocks ? undefined : $$form => this._renderActions($$form)}
      ></ZForm>
    );
  }

  private _prepareFormScope(): IPageFilterScope {
    // eslint-disable-next-line
    const self = this;
    const $$filter = this.$customRef(() => {
      return {
        get() {
          return self;
        },
        set(_value) {},
      };
    }) as any;
    return objectAssignReactive({}, this.$$renderContext.$$page.jsxCelScope, { $$filter });
  }

  private _renderActions($$form: ControllerForm): VNode {
    const jsxRenderContext = $$form.getFormJsxRenderContext(this.formScope);
    return $$form.zovaJsx.render(
      'basic-page:blockFilterActions',
      {},
      this.formScope,
      jsxRenderContext,
    ) as VNode;
  }
}
