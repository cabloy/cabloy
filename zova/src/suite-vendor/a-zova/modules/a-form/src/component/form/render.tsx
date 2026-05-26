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

  private _renderBodyInner() {
    const FormTag = this.$props.formTag;
    return this.$slotDefault ? (
      this.$slotDefault(this)
    ) : (
      <>
        {this._renderSchema()}
        {FormTag === 'form' && <button type="submit" style={{ display: 'none' }}></button>}
      </>
    );
  }

  private _renderProps() {
    const FormTag = this.$props.formTag;
    const props: any = {};
    if (this.$props.inline) {
      props.class = 'inline';
    }
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
