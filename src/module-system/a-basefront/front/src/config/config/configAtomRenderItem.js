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
        caption: {
          component: {
            module: 'a-baselayout',
            name: 'itemLayoutBlockDefaultCaption',
          },
        },
        title: {
          component: {
            module: 'a-baselayout',
            name: 'itemLayoutBlockDefaultTitle',
          },
        },
        subnavbar: {
          component: {
            module: 'a-baselayout',
            name: 'itemLayoutBlockDefaultSubnavbar',
          },
        },
        main: {
          component: {
            module: 'a-baselayout',
            name: 'itemLayoutBlockDefaultMain',
          },
        },
      },
    },
    default: {
      title: 'LayoutDefault',
      component: {
        module: 'a-baselayout',
        name: 'itemLayoutDefault',
      },
      blocks: {},
    },
  },
};
export default item;
