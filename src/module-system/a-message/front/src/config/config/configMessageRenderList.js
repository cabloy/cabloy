const list = {
  layouts: {
    list: {
      component: {
        module: 'a-message',
        name: 'messageListLayoutList',
      },
      blocks: {
        title: {
          component: {
            module: 'a-message',
            name: 'messageListLayoutBlockListTitle',
          },
        },
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
