const list = {
  info: {
    layout: {
      viewSize: {
        small: { name: 'list' },
        medium: { name: 'list' },
        large: { name: 'list' },
      },
    },
  },
  layouts: {
    base: {
      blocks: {
        title: {
          component: {
            module: 'a-message',
            name: 'messageListLayoutBlockListTitle',
          },
        },
      },
    },
    list: {
      title: 'LayoutList',
      component: {
        module: 'a-message',
        name: 'messageListLayoutList',
      },
      blocks: {
        items: {
          component: {
            module: 'a-message',
            name: 'messageListLayoutBlockListItems',
          },
        },
      },
    },
  },
};
export default list;
