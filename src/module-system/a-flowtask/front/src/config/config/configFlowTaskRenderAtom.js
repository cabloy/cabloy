const atom = {
  info: {
    layout: {
      viewSize: {
        small: { name: 'mobile' },
        medium: { name: 'mobile' },
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
            name: 'atomLayoutBlockMobileTitle',
          },
        },
        main: {
          component: {
            module: 'a-flowtask',
            name: 'atomLayoutBlockMobileMain',
          },
        },
      },
    },
    mobile: {
      title: 'LayoutMobile',
      component: {
        module: 'a-flowtask',
        name: 'atomLayoutMobile',
      },
      blocks: {},
    },
    pc: {
      title: 'LayoutPC',
      component: {
        module: 'a-flowtask',
        name: 'atomLayoutMobile',
      },
      blocks: {},
    },
  },
};
export default atom;
