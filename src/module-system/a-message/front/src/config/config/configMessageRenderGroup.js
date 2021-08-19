const group = {
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
            name: 'messageGroupLayoutBlockListTitle',
          },
        },
      },
    },
    list: {
      title: 'LayoutList',
      component: {
        module: 'a-message',
        name: 'messageGroupLayoutList',
      },
      blocks: {
        items: {
          component: {
            module: 'a-message',
            name: 'messageGroupLayoutBlockListItems',
          },
        },
      },
    },
  },
};
export default group;
