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
  link: {
    mark: true,
    title: 'EditorButtonTitleLink',
    icon: { material: 'link' },
    onBuild: insertLinkItem,
  },
  image: {
    node: true,
    title: 'EditorButtonTitleImage',
    icon: { material: 'image' },
    onBuild: insertImageItem,
  },
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
  horizontal_rule: {
    node: true,
    title: 'EditorButtonTitleHorizontalRule',
    icon: { material: 'horizontal_rule' },
    onBuild: insertHorizontalRule,
  },
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

function insertImageItem(nodeType, options) {
  return new MenuItem({
    ...options,
    enable(state) {
      return canInsert(state, nodeType);
    },
    run(state, _, view) {
      const { ctx } = options;
      // atomId
      const atomId = (ctx.host && ctx.host.atomId) || 0;
      // navigate
      ctx.$view.navigate(`/a/file/file/upload?t=${Date.now()}`, {
        context: {
          params: {
            mode: 1, // image
            atomId,
          },
          callback: (code, data) => {
            if (code === 200) {
              const attrs = { alt: data.realName, src: data.downloadUrl };
              view.dispatch(view.state.tr.replaceSelectionWith(nodeType.createAndFill(attrs)));
              view.focus();
            }
            if (code === false) {
              view.focus();
            }
          },
        },
      });
    },
  });
}

function insertLinkItem(markType, options) {
  return new MenuItem({
    ...options,
    active(state) {
      return markActive(state, markType);
    },
    enable(state) {
      return !state.selection.empty;
    },
    run(state, dispatch, view) {
      if (markActive(state, markType)) {
        toggleMark(markType)(state, dispatch);
        return true;
      }
      // navigate
      const { ctx } = options;
      ctx.$view.navigate(`/a/validation/validate?t=${Date.now()}`, {
        context: {
          params: {
            params: {
              module: 'a-markdown',
              validator: 'link',
            },
            title: ctx.$text('Create Link'),
            data: {
              href: '',
              title: '',
            },
            performValidate: true,
          },
          callback: (code, res) => {
            if (code === 200) {
              const attrs = res.data;
              toggleMark(markType, attrs)(view.state, view.dispatch);
              view.focus();
            }
            if (code === false) {
              view.focus();
            }
          },
        },
      });
    },
  });
}

function buildPopupButton(ctx, element, options) {
  // children
  const menuItems = [];
  for (const buttonOptions of options.children) {
    const menuItem = __buildMenuItem(ctx, element, buttonOptions.key, buttonOptions);
    if (menuItem) {
      menuItems.push(menuItem);
    }
  }
  const menuItem = new MenuItem({
    ...options,
    menuItems,
    run(state, dispatch, view, event) {
      options.onPopup(state, dispatch, view, event, menuItem);
    },
  });
  return menuItem;
}

async function onPopupPerform(state, dispatch, view, event, menuItemParent) {
  try {
    const { ctx, menuItems } = menuItemParent.spec;
    const buttons = [];
    for (const menuItem of menuItems) {
      buttons.push({
        text: menuItem.spec.title,
        disabled: !menuItem.enabled,
        data: menuItem,
      });
    }
    // choose
    const params = {
      forceToPopover: true,
      targetEl: event.target,
      buttons,
    };
    const button = await ctx.$view.actions.choose(params);
    const menuItem = button.data;
    menuItem.spec.run(state, dispatch, view);
  } catch (err) {}
}

function __buildMenuItem(ctx, element, key, buttonOptions) {
  if (!buttonOptions) return null;
  const options = {
    ...buttonOptions,
    title: ctx.$text(buttonOptions.title),
    key,
    ctx,
  };
  let menuItem;
  if (buttonOptions.onBuild) {
    // build
    menuItem = buttonOptions.onBuild(element, options);
  } else if (buttonOptions.popup) {
    // popup
    menuItem = buildPopupButton(ctx, element, options);
  }
  return menuItem;
}

function __schemaElements(ctx, elements) {
  const menuItems = {};
  for (const key in elements) {
    const element = elements[key];
    const buttonOptions = ButtonsAllOptions[key];
    const menuItem = __buildMenuItem(ctx, element, key, buttonOptions);
    if (menuItem) {
      menuItems[key] = menuItem;
    }
  }
  return menuItems;
}

function getMarkNodeElement(schema, key, buttonOptions) {
  if (buttonOptions.mark) {
    return schema.marks[buttonOptions.mark === true ? key : buttonOptions.mark];
  }
  if (buttonOptions.node) {
    return schema.nodes[buttonOptions.node === true ? key : buttonOptions.node];
  }
  return null;
}

function buildMenuItemsAll(ctx, schema) {
  const menuItems = {};
  for (const key in ButtonsAllOptions) {
    const buttonOptions = ButtonsAllOptions[key];
    const element = getMarkNodeElement(schema, key, buttonOptions);
    const menuItem = __buildMenuItem(ctx, element, key, buttonOptions);
    if (menuItem) {
      menuItems[key] = menuItem;
    }
  }
  // ok
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
