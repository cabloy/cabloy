const atom = {
  info: {
    attachment: true,
    comment: true,
  },
  layouts: {
    mobile: {
      component: {
        module: 'a-flowtask',
        name: 'atomLayoutMobile',
      },
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
  },
};
export default atom;
