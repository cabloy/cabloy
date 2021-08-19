const item = {
  info: {
    layout: {
      viewSize: {
        small: { name: 'mobile' },
        medium: { name: 'pc' },
        large: { name: 'pc' },
      },
    },
    attachment: true,
    comment: true,
  },
  layouts: {
    base: {
      blocks: {
        title: {
          component: {
            module: 'a-flowtask',
            name: 'flowLayoutBlockMobileTitle',
          },
        },
        subnavbar: {
          component: {
            module: 'a-flowtask',
            name: 'flowLayoutBlockMobileSubnavbar',
          },
        },
        main: {
          component: {
            module: 'a-flowtask',
            name: 'flowLayoutBlockMobileMain',
          },
        },
      },
    },
    mobile: {
      title: 'LayoutMobile',
      component: {
        module: 'a-flowtask',
        name: 'flowLayoutMobile',
      },
      blocks: {},
    },
    pc: {
      title: 'LayoutPC',
      component: {
        module: 'a-flowtask',
        name: 'flowLayoutMobile',
      },
      blocks: {},
    },
  },
};
export default item;
