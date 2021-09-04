import { wrapItem, blockTypeItem, undoItem, redoItem } from 'prosemirror-menu';
import { markItem, wrapListItem, onPopupPerform, insertNode, extendMenuItem } from './utils.js';
import { ButtonUnderline } from './underline.js';
import { ButtonStrikethrough } from './strikethrough.js';
import { ButtonMark } from './mark.js';
import { ButtonSup, ButtonSub } from './supsub.js';
import { ButtonLink } from './link.js';
import { ButtonImage } from './image.js';
import { ButtonCodeBlock } from './codeBlock.js';
import { ButtonAlignLeft, ButtonAlignCenter, ButtonAlignRight } from './container.js';
import { ButtonTable } from './table.js';

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
  ['undo', 'redo'], //
  ['heading', 'strong', 'em', 'underline', 'strikethrough', 'mark', 'sup', 'sub', 'code'],
  ['link', 'image'],
  ['bullet_list', 'ordered_list'],
  ['paragraph', 'blockquote', 'code_block', 'table'],
  // ['align_left', 'align_center', 'align_right'],
  ['paragraph_keyboardReturn', 'horizontal_rule'],
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
  underline: ButtonUnderline,
  strikethrough: ButtonStrikethrough,
  mark: ButtonMark,
  sup: ButtonSup,
  sub: ButtonSub,
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
  paragraph_keyboardReturn: {
    node: 'paragraph',
    title: 'EditorButtonTitleParagraphKeyboardReturn',
    icon: { material: 'keyboard_return' },
    onBuild: insertNode,
  },
  code_block: ButtonCodeBlock,
  horizontal_rule: {
    node: true,
    title: 'EditorButtonTitleHorizontalRule',
    icon: { material: 'horizontal_rule' },
    onBuild: insertNode,
  },
  heading: {
    node: true,
    title: 'EditorButtonTitleHeading',
    icon: { material: 'title' },
    popup: true,
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
  undo: {
    title: 'Undo',
    icon: { material: 'undo' },
    onBuild: (_, options) => {
      return extendMenuItem(undoItem, options);
    },
  },
  redo: {
    title: 'Redo',
    icon: { material: 'redo' },
    onBuild: (_, options) => {
      return extendMenuItem(redoItem, options);
    },
  },
  align_left: ButtonAlignLeft,
  align_center: ButtonAlignCenter,
  align_right: ButtonAlignRight,
  table: ButtonTable,
};
