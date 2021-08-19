const item = {
  info: {
    attachment: true,
    comment: true,
  },
  layouts: {
    mobile: {
      component: {
        module: 'a-baselayout',
        name: 'itemLayoutMobile',
      },
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
    pc: {
      component: {
        module: 'a-baselayout',
        name: 'itemLayoutPC',
      },
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
            name: 'itemLayoutBlockPCTitle',
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
  },
};
export default item;
