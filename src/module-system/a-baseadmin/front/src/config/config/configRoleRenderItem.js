const item = {
  info: {
    layout: {},
  },
  layouts: {
    base: {
      blocks: {
        title: {
          component: {
            module: 'a-baseadmin',
            name: 'roleItemLayoutBlockDefaultTitle',
          },
        },
        subnavbar: {
          component: {
            module: 'a-baseadmin',
            name: 'roleItemLayoutBlockDefaultSubnavbar',
          },
        },
        main: {
          component: {
            module: 'a-baseadmin',
            name: 'roleItemLayoutBlockDefaultMain',
          },
        },
      },
    },
  },
};
export default item;
