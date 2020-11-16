export default {
  flow: {
    render: {
      item: {
        info: {
          attachment: true,
          comment: true,
        },
        layouts: {
          mobile: {
            component: {
              module: 'a-flowtask',
              name: 'flowLayoutMobile',
            },
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
        },
      },
    },
  },
};
