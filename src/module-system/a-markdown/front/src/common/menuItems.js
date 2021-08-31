import { wrapItem, blockTypeItem, MenuItem } from 'prosemirror-menu';
import { wrapListItem, markItem, canInsert } from './buttons/utils.js';
import { ButtonLink } from './buttons/link.js';

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

function getMarkNodeElement(schema, key, buttonOptions) {
  if (buttonOptions.mark) {
    return schema.marks[buttonOptions.mark === true ? key : buttonOptions.mark] || false;
  }
  if (buttonOptions.node) {
    return schema.nodes[buttonOptions.node === true ? key : buttonOptions.node] || false;
  }
  return null;
}

function buildMenuItemsAll(ctx, schema) {
  const menuItems = {};
  for (const key in ButtonsAllOptions) {
    const buttonOptions = ButtonsAllOptions[key];
    const element = getMarkNodeElement(schema, key, buttonOptions);
    if (element === false) continue;
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
