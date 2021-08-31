import { ButtonLink } from './link.js';
import { ButtonImage } from './image.js';
import { ButtonHorizontalRule } from './horizontalRule.js';

// export const ButtonsDefault = [
//   ['bold', 'italic', 'underline', 'strikeThrough'],
//   ['orderedList', 'unorderedList'],
//   ['link', 'image'],
//   ['paragraph', 'h1', 'h2', 'h3'],
//   ['horizontal_rule', 'alignCenter', 'alignRight', 'alignJustify'],
//   ['subscript', 'superscript'],
//   ['indent', 'outdent'],
// ];

export const ButtonsDefault = [
  ['strong', 'em', 'code'], //
  ['link', 'image'],
  ['bullet_list', 'ordered_list'],
  ['blockquote', 'paragraph', 'code_block', 'heading'],
  ['horizontal_rule'],
];

export const ButtonsAllOptions = {
  strong: {
    mark: true,
    title: 'EditorButtonTitleStrong',
    icon: { material: 'format_bold' },
    onBuild: markItem,
  },
  em: {
    mark: true,
    title: 'EditorButtonTitleItalic',
    icon: { material: 'format_italic' },
    onBuild: markItem,
  },
  code: {
    mark: true,
    title: 'EditorButtonTitleCode',
    icon: { material: 'code' },
    onBuild: markItem,
  },
  link: ButtonLink,
  image: ButtonImage,
  bullet_list: {
    node: true,
    title: 'EditorButtonTitleBulletList',
    icon: { material: 'format_list_bulleted' },
    onBuild: wrapListItem,
  },
  ordered_list: {
    node: true,
    title: 'EditorButtonTitleOrderedList',
    icon: { material: 'format_list_numbered' },
    onBuild: wrapListItem,
  },
  blockquote: {
    node: true,
    title: 'EditorButtonTitleBlockquote',
    icon: { material: 'format_quote' },
    onBuild: wrapItem,
  },
  paragraph: {
    node: true,
    title: 'EditorButtonTitleParagraph',
    icon: { text: '¶' },
    onBuild: blockTypeItem,
  },
  code_block: {
    node: true,
    title: 'EditorButtonTitleCodeBlock',
    icon: { material: 'wysiwyg' },
    onBuild: blockTypeItem,
  },
  horizontal_rule: ButtonHorizontalRule,
  heading: {
    node: true,
    title: 'EditorButtonTitleHeading',
    icon: { material: 'title' },
    popup: true,
    onPopup: onPopupPerform,
    children: [
      {
        key: 'H1',
        title: 'EditorButtonTitleHeading1',
        attrs: { level: 1 },
        onBuild: blockTypeItem,
      },
      {
        key: 'H2',
        title: 'EditorButtonTitleHeading2',
        attrs: { level: 2 },
        onBuild: blockTypeItem,
      },
      {
        key: 'H3',
        title: 'EditorButtonTitleHeading3',
        attrs: { level: 3 },
        onBuild: blockTypeItem,
      },
      {
        key: 'H4',
        title: 'EditorButtonTitleHeading4',
        attrs: { level: 4 },
        onBuild: blockTypeItem,
      },
      {
        name: 'H5',
        title: 'EditorButtonTitleHeading5',
        attrs: { level: 5 },
        onBuild: blockTypeItem,
      },
      {
        name: 'H6',
        title: 'EditorButtonTitleHeading6',
        attrs: { level: 6 },
        onBuild: blockTypeItem,
      },
    ],
  },
};
