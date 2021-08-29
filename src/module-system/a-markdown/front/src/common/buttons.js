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

export function buildMenuItems(schema) {
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
