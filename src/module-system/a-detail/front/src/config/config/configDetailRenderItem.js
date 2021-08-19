const item = {
  info: {
    layout: {
      viewSize: {
        small: { name: 'mobile' },
        medium: { name: 'mobile' },
        large: { name: 'pc' },
      },
    },
  },
  layouts: {
    base: {
      blocks: {
        title: {
          component: {
            module: 'a-detail',
            name: 'itemLayoutBlockMobileTitle',
          },
        },
        main: {
          component: {
            module: 'a-detail',
            name: 'itemLayoutBlockMobileMain',
          },
        },
      },
    },
    mobile: {
      title: 'LayoutMobile',
      component: {
        module: 'a-detail',
        name: 'itemLayoutMobile',
      },
      blocks: {},
    },
    pc: {
      title: 'LayoutPC',
      component: {
        module: 'a-detail',
        name: 'itemLayoutMobile',
      },
      blocks: {},
    },
  },
};
export default item;
