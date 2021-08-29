import { wrapItem, blockTypeItem, Dropdown, DropdownSubmenu, joinUpItem, liftItem, selectParentNodeItem, undoItem, redoItem, icons, MenuItem } from 'prosemirror-menu';
import { toggleMark } from 'prosemirror-commands';

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
  },
  ordered_list: {
    title: 'EditorButtonTitleOrderedList',
    icon: { material: 'format_list_numbered' },
  },
  blockquote: {
    title: 'EditorButtonTitleBlockquote',
    icon: { material: 'format_quote' },
  },
  paragraph: {
    title: 'EditorButtonTitleParagraph',
    icon: { text: '¶' },
  },
  code_block: {
    title: 'EditorButtonTitleCodeBlock',
    icon: { material: 'wysiwyg' },
  },
  horizontal_rule: {
    title: 'EditorButtonTitleHorizontalRule',
    icon: { material: 'horizontal_rule' },
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

function buildMenuItemsAll(ctx, schema) {
  const menuItems = {};
  // marks
  for (const key in schema.marks) {
    const buttonOptions = ButtonsOptions[key];
    if (!buttonOptions.onBuild) continue;
    const options = {
      ...buttonOptions,
      title: ctx.$text(buttonOptions.title),
      key,
    };
    const menuItem = buttonOptions.onBuild(key, options);
    menuItems[key] = menuItem;
  }
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

export function buildMenuItems1(schema, buttonsWant) {
  let r = {},
    type;
  if ((type = schema.marks.strong)) {
    r.toggleStrong = markItem(type, { title: 'Toggle strong style', icon: icons.strong });
  }
  if ((type = schema.marks.em)) {
    r.toggleEm = markItem(type, { title: 'Toggle emphasis', icon: icons.em });
  }
  if ((type = schema.marks.code)) {
    r.toggleCode = markItem(type, { title: 'Toggle code font', icon: icons.code });
  }
  if ((type = schema.marks.link)) {
    r.toggleLink = linkItem(type);
  }

  if ((type = schema.nodes.image)) {
    r.insertImage = insertImageItem(type);
  }
  if ((type = schema.nodes.bullet_list)) {
    r.wrapBulletList = wrapListItem(type, {
      title: 'Wrap in bullet list',
      icon: icons.bulletList,
    });
  }
  if ((type = schema.nodes.ordered_list)) {
    r.wrapOrderedList = wrapListItem(type, {
      title: 'Wrap in ordered list',
      icon: icons.orderedList,
    });
  }
  if ((type = schema.nodes.blockquote)) {
    r.wrapBlockQuote = wrapItem(type, {
      title: 'Wrap in block quote',
      icon: icons.blockquote,
    });
  }
  if ((type = schema.nodes.paragraph)) {
    r.makeParagraph = blockTypeItem(type, {
      title: 'Change to paragraph',
      label: 'Plain',
    });
  }
  if ((type = schema.nodes.code_block)) {
    r.makeCodeBlock = blockTypeItem(type, {
      title: 'Change to code block',
      label: 'Code',
    });
  }
  if ((type = schema.nodes.heading)) {
    for (let i = 1; i <= 10; i++) {
      r['makeHead' + i] = blockTypeItem(type, {
        title: 'Change to heading ' + i,
        label: 'Level ' + i,
        attrs: { level: i },
      });
    }
  }
  if ((type = schema.nodes.horizontal_rule)) {
    const hr = type;
    r.insertHorizontalRule = new MenuItem({
      title: 'Insert horizontal rule',
      label: 'Horizontal rule',
      enable(state) {
        return canInsert(state, hr);
      },
      run(state, dispatch) {
        dispatch(state.tr.replaceSelectionWith(hr.create()));
      },
    });
  }

  const cut = arr => arr.filter(x => x);
  r.insertMenu = new Dropdown(cut([r.insertImage, r.insertHorizontalRule]), { label: 'Insert' });
  r.typeMenu = new Dropdown(
    cut([r.makeParagraph, r.makeCodeBlock, r.makeHead1 && new DropdownSubmenu(cut([r.makeHead1, r.makeHead2, r.makeHead3, r.makeHead4, r.makeHead5, r.makeHead6]), { label: 'Heading' })]),
    { label: 'Type...' }
  );

  r.inlineMenu = [cut([r.toggleStrong, r.toggleEm, r.toggleCode, r.toggleLink])];
  r.blockMenu = [cut([r.wrapBulletList, r.wrapOrderedList, r.wrapBlockQuote, joinUpItem, liftItem, selectParentNodeItem])];
  r.fullMenu = r.inlineMenu.concat([[r.insertMenu, r.typeMenu]], [[undoItem, redoItem]], r.blockMenu);

  return r;
}
