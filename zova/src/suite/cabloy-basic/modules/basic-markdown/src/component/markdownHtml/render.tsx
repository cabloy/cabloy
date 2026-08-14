import { BeanRenderBase } from 'zova';
import { Render } from 'zova-module-a-bean';

@Render()
export class RenderMarkdownHtml extends BeanRenderBase {
  public render() {
    return <div class={[this.$props.class, this.cMarkdown]} innerHTML={this.$props.html}></div>;
  }
}
