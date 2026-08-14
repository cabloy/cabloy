import { BeanStyleBase } from 'zova';
import { Style } from 'zova-module-a-bean';

import { richTextContentStyle } from '../../lib/richTextContentStyle.js';

@Style()
export class StyleMarkdownHtml extends BeanStyleBase {
  cMarkdown: string;

  protected async __init__() {
    this.cMarkdown = this.$style(richTextContentStyle());
  }
}
