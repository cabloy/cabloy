import { BeanStyleBase } from 'zova';
import { Style } from 'zova-module-a-bean';

import { richTextContentStyle } from '../../lib/richTextContentStyle.js';

@Style()
export class StyleFormFieldMarkdown extends BeanStyleBase {
  cMarkdown: string;

  protected async __init__() {
    const contentStyle = richTextContentStyle();
    contentStyle.$nest = {
      ...contentStyle.$nest,
      '& .tiptap ul[data-type="taskList"]': {
        listStyle: 'none',
        paddingInlineStart: 0,
      },
      '& .tiptap ul[data-type="taskList"] li': {
        alignItems: 'flex-start',
        display: 'flex',
        gap: '0.5rem',
      },
      '& .tiptap ul[data-type="taskList"] li > label': {
        lineHeight: 1.65,
        paddingTop: '0.2rem',
      },
      '& .tiptap ul[data-type="taskList"] li > div': {
        flex: 1,
        minWidth: 0,
      },
      '& .tiptap ul[data-type="taskList"] li > div > p': {
        margin: 0,
      },
    };
    this.cMarkdown = this.$style(contentStyle);
  }
}
