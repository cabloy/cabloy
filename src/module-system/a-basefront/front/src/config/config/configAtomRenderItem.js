const item = {
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
        caption: {
          component: {
            module: 'a-baselayout',
            name: 'itemLayoutBlockMobileCaption',
          },
        },
        title: {
          component: {
            module: 'a-baselayout',
            name: 'itemLayoutBlockMobileTitle',
          },
        },
        subnavbar: {
          component: {
            module: 'a-baselayout',
            name: 'itemLayoutBlockMobileSubnavbar',
          },
        },
        main: {
          component: {
            module: 'a-baselayout',
            name: 'itemLayoutBlockMobileMain',
          },
        },
      },
    },
    mobile: {
      title: 'LayoutMobile',
      component: {
        module: 'a-baselayout',
        name: 'itemLayoutMobile',
      },
      blocks: {},
    },
    pc: {
      title: 'LayoutPC',
      component: {
        module: 'a-baselayout',
        name: 'itemLayoutPC',
      },
      blocks: {},
    },
  },
};
export default item;
