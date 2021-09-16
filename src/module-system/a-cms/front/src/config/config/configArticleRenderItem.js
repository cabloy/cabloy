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
    mobile: {
      blocks: {
        main: {
          component: {
            module: 'a-cms',
            name: 'itemLayoutBlockMobileMain',
          },
          // iframe: false,
          // markdown: false,
        },
      },
    },
    pc: {
      blocks: {
        main: {
          component: {
            module: 'a-cms',
            name: 'itemLayoutBlockMobileMain',
          },
        },
      },
    },
  },
};
export default item;
