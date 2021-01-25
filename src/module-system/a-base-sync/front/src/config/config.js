import avatarUser from '../assets/img/user.png';
export default {
  stage: {
    draft: 0,
    formal: 1,
    history: 2,
  },
  user: {
    avatar: {
      default: avatarUser,
    },
  },
  atoms: {
    resource: {
      render: {
        list: {
          info: {
            orders: [
              { name: 'resourceSorting', title: 'Resource Sorting', by: 'asc' },
            ],
          },
          layouts: {
            list: {
            },
            table: {
            },
          },
        },
      },
    },
  },
};
