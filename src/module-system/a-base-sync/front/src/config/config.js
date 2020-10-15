import avatarUser from '../assets/img/user.png';
export default {
  menu: {
    scene: {
      0: 'Default',
      1: 'Create',
      2: 'List',
      20: 'Statistics',
      50: 'Tools',
    },
  },
  user: {
    avatar: {
      default: avatarUser,
    },
  },
  atom: {
    render: {
      list: {
        layout: {
          list: {
            component: {
              module: 'a-baselayout',
              name: 'listLayoutList',
            },
            blocks: {
              title: {
                component: {
                  module: 'a-baselayout',
                  name: 'listLayoutBlockTitle',
                },
              },
              items: {
                component: {
                  module: 'a-baselayout',
                  name: 'listLayoutBlockListItems',
                },
              },
            },
          },
        },
      },
    },
  },
};
