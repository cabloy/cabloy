import { wrapItem } from 'prosemirror-menu';

export const ButtonAlignLeft = {
  node: 'container',
  title: 'EditorButtonTitleAlignLeft',
  attrs: { params: 'hljs-left' },
  icon: { material: 'format_align_left' },
  onBuild: wrapItem,
};
