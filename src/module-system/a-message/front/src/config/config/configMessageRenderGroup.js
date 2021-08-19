const group = {
  layouts: {
    list: {
      component: {
        module: 'a-message',
        name: 'messageGroupLayoutList',
      },
      blocks: {
        title: {
          component: {
            module: 'a-message',
            name: 'messageGroupLayoutBlockListTitle',
          },
        },
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
