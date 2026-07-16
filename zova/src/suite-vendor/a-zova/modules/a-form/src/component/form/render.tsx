import { h, VNode } from 'vue';
import { BeanRenderBase } from 'zova';
import { Render } from 'zova-module-a-bean';

@Render()
export class RenderForm extends BeanRenderBase {
  private _renderSchema() {
    if (!this.properties) return;
    const children: VNode[] = [];
    for (const property of this.properties) {
      const child = this._renderFieldByKey(property.key!);
      if (child) {
        if (Array.isArray(child)) {
          children.push(...child);
        } else {
          children.push(child);
        }
      }
    }
    return children;
  }

  private _renderChildren() {
    const children: (VNode | undefined)[] = [];
    children.push(this.$props.slotHeader?.(this));
    const bodyInner = this._renderBodyInner();
    if (this.$props.slotBody) {
      children.push(this.$props.slotBody(bodyInner, this));
    } else {
      children.push(bodyInner);
    }
    children.push(this.$props.slotFooter?.(this));
    return children;
  }

  private _renderFromBlocks() {
    const blocks = this.$props.blocks;
    if (!blocks || blocks.length === 0) {
      return this._renderSchema();
    }
    const celScope = this.getFormScope();
    const jsxRenderContext = this.getFormJsxRenderContext(celScope);
    const domBlocks: VNode[] = [];
    blocks.forEach((block, index) => {
      const options = Object.assign({ key: index }, block.options);
      const domBlock = this.zovaJsx.render(block.render!, options, celScope, jsxRenderContext);
      if (!domBlock) return;
      if (Array.isArray(domBlock)) {
        domBlocks.push(...domBlock);
      } else {
        domBlocks.push(domBlock);
      }
    });
    return domBlocks;
  }

  private _renderBodyInner() {
    const FormTag = this.$props.formTag;
    return this.$slotDefault ? (
      this.$slotDefault(this)
    ) : (
      <>
        {this.$props.blocks ? this._renderFromBlocks() : this._renderSchema()}
        {FormTag === 'form' && <button type="submit" style={{ display: 'none' }}></button>}
      </>
    );
  }

  private _renderProps() {
    const FormTag = this.$props.formTag;
    const props: any = {};
    if (FormTag === 'form') {
      props.onSubmit = (e: SubmitEvent) => {
        if (this.$props.onFormSubmit) {
          this.$props.onFormSubmit(e, this);
        } else {
          e.preventDefault();
          e.stopPropagation();
          this.submit();
        }
      };
    }
    return props;
  }

  public render() {
    const FormTag = this.$props.formTag;
    const props = this._renderProps();
    const children = this._renderChildren();
    if (this.$props.slotWrapper) {
      return h(FormTag, props, this.$props.slotWrapper(children, this));
    }
    return h(FormTag, props, children);
  }
}
