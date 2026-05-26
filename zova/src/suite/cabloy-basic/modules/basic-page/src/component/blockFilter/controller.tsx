import type {
  IResourceBlockOptionsBase,
  IJsxRenderContextPage,
  IFormMeta,
  IResourceFormFieldLayoutOptions,
} from 'zova-module-a-openapi';

import { isNilOrEmptyString } from '@cabloy/utils';
import { BeanControllerBase, type IComponentOptions, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { TypeFormOnSubmitData, ZForm } from 'zova-module-a-form';

declare module 'zova-module-a-openapi' {
  export interface IResourceBlockRecord {
    'basic-page:blockFilter'?: ControllerBlockFilterProps;
  }
}

export interface ControllerBlockFilterProps extends IResourceBlockOptionsBase {}

@Controller()
export class ControllerBlockFilter extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  formMeta: IFormMeta;
  formFieldLayout: IResourceFormFieldLayoutOptions;

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextPage;

  protected async __init__() {
    this.formMeta = { formMode: 'edit' };
    this.formFieldLayout = { inline: true };
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
    return (
      <ZForm
        class={this.$props.class}
        inline={true}
        data={$$page.queryFilterData}
        schema={this.schemaFilter}
        schemaScene="filter"
        formMeta={this.formMeta}
        formFieldLayout={this.formFieldLayout}
        onSubmitData={data => this.submitData(data as never)}
        slotFooter={$$form => {
          return (
            <>
              <button
                class="btn btn-primary"
                onClick={() => {
                  $$form.submit();
                }}
              >
                {this.scope.locale.Search()}
              </button>
              <button
                class="btn btn-warning"
                onClick={() => {
                  const data = $$form.reset();
                  this.resetData(data);
                }}
              >
                {this.scope.locale.Reset()}
              </button>
            </>
          );
        }}
      ></ZForm>
    );
  }
}
