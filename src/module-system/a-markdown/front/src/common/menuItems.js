import { wrapItem, blockTypeItem, Dropdown, DropdownSubmenu, joinUpItem, liftItem, selectParentNodeItem, undoItem, redoItem, icons, MenuItem } from 'prosemirror-menu';
import { toggleMark } from 'prosemirror-commands';
import { wrapInList } from 'prosemirror-schema-list';

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

export const ButtonsOptions = {
  strong: {
    title: 'EditorButtonTitleStrong',
    icon: { material: 'format_bold' },
    onBuild: markItem,
  },
  em: {
    title: 'EditorButtonTitleItalic',
    icon: { material: 'format_italic' },
    onBuild: markItem,
  },
  code: {
    title: 'EditorButtonTitleCode',
    icon: { material: 'code' },
    onBuild: markItem,
  },
  link: {
    title: 'EditorButtonTitleLink',
    icon: { material: 'link' },
  },
  image: {
    title: 'EditorButtonTitleImage',
    icon: { material: 'image' },
  },
  bullet_list: {
    title: 'EditorButtonTitleBulletList',
    icon: { material: 'format_list_bulleted' },
    onBuild: wrapListItem,
  },
  ordered_list: {
    title: 'EditorButtonTitleOrderedList',
    icon: { material: 'format_list_numbered' },
    onBuild: wrapListItem,
  },
  blockquote: {
    title: 'EditorButtonTitleBlockquote',
    icon: { material: 'format_quote' },
    onBuild: wrapItem,
  },
  paragraph: {
    title: 'EditorButtonTitleParagraph',
    icon: { text: '¶' },
    onBuild: blockTypeItem,
  },
  code_block: {
    title: 'EditorButtonTitleCodeBlock',
    icon: { material: 'wysiwyg' },
    onBuild: blockTypeItem,
  },
  horizontal_rule: {
    title: 'EditorButtonTitleHorizontalRule',
    icon: { material: 'horizontal_rule' },
    onBuild: insertHorizontalRule,
  },
  heading: {
    title: 'EditorButtonTitleHeading',
    icon: { material: 'title' },
    children: [
      {
        name: 'H1',
        title: 'EditorButtonTitleHeading1',
      },
      {
        name: 'H2',
        title: 'EditorButtonTitleHeading2',
      },
      {
        name: 'H3',
        title: 'EditorButtonTitleHeading3',
      },
      {
        name: 'H4',
        title: 'EditorButtonTitleHeading4',
      },
      {
        name: 'H5',
        title: 'EditorButtonTitleHeading5',
      },
      {
        name: 'H6',
        title: 'EditorButtonTitleHeading6',
      },
    ],
  },
};

function wrapListItem(nodeType, options) {
  return cmdItem(wrapInList(nodeType, options.attrs), options);
}

function cmdItem(cmd, options) {
  const passedOptions = {
    label: options.title,
    run: cmd,
  };
  for (const prop in options) passedOptions[prop] = options[prop];
  if ((!options.enable || options.enable === true) && !options.select) {
    passedOptions[options.enable ? 'enable' : 'select'] = state => cmd(state);
  }

  return new MenuItem(passedOptions);
}

function markActive(state, type) {
  const { from, $from, to, empty } = state.selection;
  if (empty) return type.isInSet(state.storedMarks || $from.marks());
  return state.doc.rangeHasMark(from, to, type);
}

function markItem(markType, options) {
  const passedOptions = {
    active(state) {
      return markActive(state, markType);
    },
    enable: true,
  };
  for (const prop in options) passedOptions[prop] = options[prop];
  return cmdItem(toggleMark(markType), passedOptions);
}

function canInsert(state, nodeType) {
  const $from = state.selection.$from;
  for (let d = $from.depth; d >= 0; d--) {
    const index = $from.index(d);
    if ($from.node(d).canReplaceWith(index, index, nodeType)) return true;
  }
  return false;
}

function insertHorizontalRule(nodeType, options) {
  return new MenuItem({
    ...options,
    enable(state) {
      return canInsert(state, nodeType);
    },
    run(state, dispatch) {
      dispatch(state.tr.replaceSelectionWith(nodeType.create()));
    },
  });
}

function buildMenuItemsAll(ctx, schema) {
  const menuItems = {};
  function __schemaElements(elements) {
    for (const key in elements) {
      const element = elements[key];
      const buttonOptions = ButtonsOptions[key];
      if (!buttonOptions || !buttonOptions.onBuild) continue;
      const options = {
        ...buttonOptions,
        title: ctx.$text(buttonOptions.title),
        key,
      };
      const menuItem = buttonOptions.onBuild(element, options);
      menuItems[key] = menuItem;
    }
  }
  // marks
  __schemaElements(schema.marks);
  // nodes
  __schemaElements(schema.nodes);
  // nodes
  return menuItems;
}

export function buildMenuItems(ctx, schema, buttonsWant) {
  // menuItemsAll
  const menuItemsAll = buildMenuItemsAll(ctx, schema);
  // menuItems
  let menuItems = buttonsWant.map(buttons => {
    const arr = buttons.map(button => {
      return menuItemsAll[button];
    });
    return arr.filter(x => x);
  });
  menuItems = menuItems.filter(x => x && x.length > 0);
  return menuItems;
}
