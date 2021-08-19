const item = {
  info: {
    layout: {
      viewSize: {
        small: { name: 'mobile', title: 'LayoutMobile' },
        medium: { name: 'mobile', title: 'LayoutMobile' },
        large: { name: 'pc', title: 'LayoutPC' },
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
