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
            module: 'a-flowtask',
            name: 'flowListLayoutBlockListTitle',
          },
        },
      },
    },
    list: {
      title: 'LayoutList',
      component: {
        module: 'a-flowtask',
        name: 'flowListLayoutList',
      },
      blocks: {
        items: {
          component: {
            module: 'a-flowtask',
            name: 'flowListLayoutBlockListItems',
          },
        },
      },
    },
  },
};
export default list;
