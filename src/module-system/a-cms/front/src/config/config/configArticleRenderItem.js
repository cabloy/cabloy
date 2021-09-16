const __viewSizeDefaultLayoutView = [{ name: 'content' }, { name: 'info' }];
const __viewSizeDefaultLayoutEdit = [{ name: 'info' }, { name: 'content' }];
const __viewSizeDefaultView = {
  small: __viewSizeDefaultLayoutView,
  medium: __viewSizeDefaultLayoutView,
  large: __viewSizeDefaultLayoutView,
};
const __viewSizeDefaultEdit = {
  small: __viewSizeDefaultLayoutEdit,
  medium: __viewSizeDefaultLayoutEdit,
  large: __viewSizeDefaultLayoutEdit,
};

const item = {
  info: {
    layout: {
      viewSize: {
        view: __viewSizeDefaultView,
        edit: __viewSizeDefaultEdit,
      },
    },
  },
  layouts: {
    info: {
      title: 'LayoutInfo',
      component: {
        module: 'a-baselayout',
        name: 'itemLayoutDefault',
      },
      blocks: {
        main: {
          component: {
            module: 'a-cms',
            name: 'itemLayoutBlockMobileMain',
          },
          markdown: false,
        },
      },
    },
    content: {
      title: 'LayoutContent',
      component: {
        module: 'a-baselayout',
        name: 'itemLayoutDefault',
      },
      blocks: {
        main: {
          component: {
            module: 'a-cms',
            name: 'itemLayoutBlockMobileMain',
          },
          markdown: true,
        },
      },
    },
  },
};
export default item;
