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
              name: 'listLayoutBlockFilter',
            },
          },
          export: {
            fields: [
              { name: 'atomName', title: 'AtomName' },
              { name: 'userName', title: 'Creator' },
              { name: 'createdAt', title: 'Created Time' },
              { name: 'updatedAt', title: 'Modification Time' },
            ],
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
              subnavbar: {
                component: {
                  module: 'a-baselayout',
                  name: 'listLayoutBlockListSubnavbar',
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
          table: {
            component: {
              module: 'a-baselayout',
              name: 'listLayoutTable',
            },
            blocks: {
              title: {
                component: {
                  module: 'a-baselayout',
                  name: 'listLayoutBlockTableTitle',
                },
              },
              items: {
                component: {
                  module: 'a-baselayout',
                  name: 'listLayoutBlockTableItems',
                },
                columns: [
                  {
                    dataIndex: 'atomName',
                    title: 'Atom Name',
                    align: 'left',
                    component: {
                      module: 'a-baselayout',
                      name: 'listLayoutTableCellAtomName',
                    },
                  },
                  {
                    dataIndex: 'userName',
                    title: 'Creator',
                    align: 'left',
                    component: {
                      module: 'a-baselayout',
                      name: 'listLayoutTableCellUserName',
                    },
                  },
                  {
                    dataIndex: 'createdAt',
                    title: 'Created Time',
                    align: 'left',
                  },
                  {
                    dataIndex: 'updatedAt',
                    title: 'Modification Time',
                    align: 'left',
                  },
                ],
              },
              bottombar: {
                component: {
                  module: 'a-baselayout',
                  name: 'listLayoutBlockTableBottombar',
                },
              },
            },
          },
          select: {
            component: {
              module: 'a-baselayout',
              name: 'listLayoutList',
            },
            blocks: {
              title: {
                component: {
                  module: 'a-baselayout',
                  name: 'listLayoutBlockSelectTitle',
                },
              },
              items: {
                component: {
                  module: 'a-baselayout',
                  name: 'listLayoutBlockSelectItems',
                },
              },
            },
          },
          selecting: {
            component: {
              module: 'a-baselayout',
              name: 'listLayoutList',
            },
            blocks: {
              title: {
                component: {
                  module: 'a-baselayout',
                  name: 'listLayoutBlockSelectingTitle',
                },
              },
              items: {
                component: {
                  module: 'a-baselayout',
                  name: 'listLayoutBlockSelectingItems',
                },
              },
            },
          },
        },
      },
      item: {
        layouts: {
          mobile: {
            component: {
              module: 'a-baselayout',
              name: 'itemLayoutMobile',
            },
            blocks: {
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
        },
      },
    },
  },
};
