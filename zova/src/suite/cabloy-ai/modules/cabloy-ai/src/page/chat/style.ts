import { BeanStyleBase } from 'zova';
import { Style } from 'zova-module-a-bean';

import { chatMarkdownStyle } from '../../lib/chatMarkdownStyle.ts';

@Style()
export class StylePageChat extends BeanStyleBase {
  cMarkdown: string;

  protected async __init__() {
    this.cMarkdown = this.$style(chatMarkdownStyle());
  }
}
