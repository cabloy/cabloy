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
const atom = {
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
            name: 'atomLayoutBlockDefaultTitle',
          },
        },
        main: {
          component: {
            module: 'a-flowtask',
            name: 'atomLayoutBlockDefaultMain',
          },
        },
      },
    },
    default: {
      title: 'LayoutDefault',
      component: {
        module: 'a-flowtask',
        name: 'atomLayoutDefault',
      },
      blocks: {},
    },
  },
};
export default atom;
