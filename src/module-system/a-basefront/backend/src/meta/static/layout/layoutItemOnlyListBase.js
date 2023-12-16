// const moduleInfo = module.info;
module.exports = app => {
  const content = {
    info: {
      layout: {
        viewSize: {
          small: 'list',
          medium: 'table',
          large: 'table',
        },
      },
      ordersBase: [
        { name: 'createdAt', title: 'Created Time', by: 'desc', tableAlias: '' },
        { name: 'updatedAt', title: 'Modification Time', by: 'desc', tableAlias: '' },
      ],
      orders: [],
      filter: {
        actionPath: '/a/baselayout/listLayoutFilter',
        tabs: {
          basic: {
            schema: {
              module: 'a-baselayout',
              schema: 'filterTabBasic',
            },
          },
          general: {
            schema: {
              module: 'a-baselayout',
              schema: 'filterTabGeneral',
            },
          },
        },
      },
      export: {
        fields: [
          { name: 'id', title: 'ID' },
          { name: 'createdAt', title: 'Created Time' },
          { name: 'updatedAt', title: 'Modification Time' },
        ],
      },
    },
    layouts: {
      base: {
        blocks: {
          caption: {
            component: {
              module: 'a-baselayout',
              name: 'listLayoutBlockListCaption',
            },
          },
          title: {
            component: {
              module: 'a-baselayout',
              name: 'baseLayoutBlockListTitle',
            },
          },
          subnavbar: {
            component: {
              module: 'a-baselayout',
              name: 'listLayoutBlockListSubnavbar',
            },
            options: {
              policy: 'custom',
            },
          },
        },
      },
      card: {
        title: 'LayoutCard',
        component: {
          module: 'a-baselayout',
          name: 'baseLayoutList',
        },
        blocks: {
          items: {
            component: {
              module: 'a-baselayout',
              name: 'baseLayoutBlockCardItems',
            },
          },
          item: {
            component: {
              module: 'a-baselayout',
              name: 'listLayoutBlockCardItem',
            },
          },
          itemHeader: {
            component: {
              module: 'a-baselayout',
              name: 'listLayoutBlockListItem',
            },
            summary: false,
          },
        },
      },
      list: {
        title: 'LayoutList',
        component: {
          module: 'a-baselayout',
          name: 'baseLayoutList',
        },
        blocks: {
          items: {
            component: {
              module: 'a-baselayout',
              name: 'baseLayoutBlockListItems',
            },
          },
          item: {
            component: {
              module: 'a-baselayout',
              name: 'listLayoutBlockListItem',
            },
          },
        },
      },
      table: {
        title: 'LayoutTable',
        component: {
          module: 'a-baselayout',
          name: 'baseLayoutTable',
        },
        blocks: {
          items: {
            component: {
              module: 'a-baselayout',
              name: 'baseLayoutBlockTableItems',
            },
            columns: [
              {
                dataIndex: 'name',
                title: 'Atom Name',
                align: 'left',
                renderType: 'atomName',
              },
              {
                dataIndex: 'userId',
                title: 'User',
                align: 'left',
                renderType: 'userName',
              },
              {
                dataIndex: 'createdAt',
                title: 'Created Time',
                align: 'center',
                params: {
                  dateFormat: {
                    lines: true,
                  },
                },
              },
              {
                dataIndex: 'updatedAt',
                title: 'Modification Time',
                align: 'center',
                params: {
                  dateFormat: {
                    lines: true,
                  },
                },
              },
            ],
          },
          bottombar: {
            component: {
              module: 'a-baselayout',
              name: 'baseLayoutBlockTableBottombar',
            },
          },
        },
      },
      tree: {
        title: 'LayoutTree',
        component: {
          module: 'a-baselayout',
          name: 'baseLayoutTree',
        },
        blocks: {
          title: {
            component: {
              module: 'a-baselayout',
              name: 'listLayoutBlockTreeTitle',
            },
          },
          items: {
            component: {
              module: 'a-baselayout',
              name: 'listLayoutBlockTreeItems',
            },
          },
        },
      },
      treeTable: {
        title: 'LayoutTreeTable',
        component: {
          module: 'a-baselayout',
          name: 'baseLayoutTreeTable',
        },
        blocks: {
          title: {
            component: {
              module: 'a-baselayout',
              name: 'listLayoutBlockTreeTitle',
            },
          },
          items: {
            component: {
              module: 'a-baselayout',
              name: 'baseLayoutBlockTableItems',
            },
            sorter: false,
            columns: [
              {
                dataIndex: 'createdAt',
                title: 'Created Time',
                align: 'center',
                params: {
                  dateFormat: {
                    lines: true,
                  },
                },
              },
              {
                dataIndex: 'updatedAt',
                title: 'Modification Time',
                align: 'center',
                params: {
                  dateFormat: {
                    lines: true,
                  },
                },
              },
            ],
          },
          bottombar: false,
        },
      },
      select: {
        component: {
          module: 'a-baselayout',
          name: 'baseLayoutList',
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
          name: 'baseLayoutList',
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
  };
  const layout = {
    atomName: 'Base(ItemOnly)',
    atomStaticKey: 'layoutItemOnlyListBase',
    atomRevision: 9,
    description: '',
    layoutTypeCode: 3,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
