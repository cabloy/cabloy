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
        info: {
          orders: [
            { name: 'createdAt', title: 'Created Time', by: 'desc', tableAlias: 'a' },
            { name: 'updatedAt', title: 'Modification Time', by: 'desc', tableAlias: 'a' },
            { name: 'atomName', title: 'Atom Name', by: 'asc', tableAlias: 'a' },
          ],
          filter: {
            component: {
              module: 'a-baselayout',
              name: 'listLayoutFilter',
            },
          },
        },
        layouts: {
          list: {
            component: {
              module: 'a-baselayout',
              name: 'listLayoutList',
            },
            blocks: {
              title: {
                component: {
                  module: 'a-baselayout',
                  name: 'listLayoutBlockListTitle',
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
