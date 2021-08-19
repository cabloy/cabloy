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
      blocks: {
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
      },
    },
    pc: {
      title: 'LayoutPC',
      component: {
        module: 'a-baselayout',
        name: 'itemLayoutPC',
      },
      blocks: {
        title: {
          component: {
            module: 'a-baselayout',
            name: 'itemLayoutBlockPCTitle',
          },
        },
      },
    },
  },
};
export default item;
