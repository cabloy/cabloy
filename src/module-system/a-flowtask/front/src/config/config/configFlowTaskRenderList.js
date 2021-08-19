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
            name: 'flowTaskListLayoutBlockListTitle',
          },
        },
      },
    },
    list: {
      title: 'LayoutList',
      component: {
        module: 'a-flowtask',
        name: 'flowTaskListLayoutList',
      },
      blocks: {
        items: {
          component: {
            module: 'a-flowtask',
            name: 'flowTaskListLayoutBlockListItems',
          },
        },
      },
    },
  },
};
export default list;
