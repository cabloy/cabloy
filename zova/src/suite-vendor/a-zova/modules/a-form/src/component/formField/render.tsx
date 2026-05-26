import { BeanRenderBase, SymbolController } from 'zova';
import { Render } from 'zova-module-a-bean';

import { IFormFieldRenderContext } from '../../types/formField.js';

@Render()
export class RenderFormField<TParentData extends {} = {}> extends BeanRenderBase {
  public render() {
    const renderContext = this.getRenderContext();
    return this.$$beanBehaviorsHolder.render(
      (renderContext: IFormFieldRenderContext<TParentData>) => {
        return this._renderSlotDefault(renderContext);
      },
      renderContext,
    );
  }

  private _renderSlotDefault(renderContext: IFormFieldRenderContext<TParentData>) {
    if (this.$slotDefault) {
      return this.$slotDefault!(renderContext, this[SymbolController]);
    }
    return this.$$form.zovaJsx.render(
      renderContext.propsBucket.render,
      renderContext.props,
      renderContext.celScope,
      renderContext.jsxRenderContext,
    );
  }
}
