const __viewSizeDefaultLayoutView = [{ name: 'default' }];
const __viewSizeDefaultLayoutEdit = [{ name: 'default' }];
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
    attachment: true,
    comment: true,
  },
  layouts: {
    base: {
      blocks: {
        title: {
          component: {
            module: 'a-flowtask',
            name: 'flowLayoutBlockDefaultTitle',
          },
        },
        subnavbar: {
          component: {
            module: 'a-flowtask',
            name: 'flowLayoutBlockDefaultSubnavbar',
          },
        },
        main: {
          component: {
            module: 'a-flowtask',
            name: 'flowLayoutBlockDefaultMain',
          },
        },
      },
    },
    default: {
      title: 'LayoutDefault',
      component: {
        module: 'a-flowtask',
        name: 'flowLayoutDefault',
      },
      blocks: {},
    },
  },
};
export default item;
