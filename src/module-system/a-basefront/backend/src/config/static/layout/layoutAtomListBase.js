module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
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
        { name: 'atomCreatedAt', title: 'Created Time', by: 'desc', tableAlias: '' },
        { name: 'atomUpdatedAt', title: 'Modification Time', by: 'desc', tableAlias: '' },
        { name: 'atomName', title: 'Atom Name', by: 'asc', tableAlias: 'a' },
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
          { name: 'atomName', title: 'AtomName' },
          { name: 'userName', title: 'Creator' },
          { name: 'atomCreatedAt', title: 'Created Time' },
          { name: 'atomUpdatedAt', title: 'Modification Time' },
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
              name: 'baseLayoutBlockListSubnavbar',
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
        options: {
          subnavbar: {
            policyDefault: true,
          },
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
        options: {
          subnavbar: {
            policyDefault: true,
          },
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
        options: {
          subnavbar: {
            policyDefault: true,
          },
        },
        blocks: {
          items: {
            component: {
              module: 'a-baselayout',
              name: 'baseLayoutBlockTableItems',
            },
            columns: [
              {
                dataIndex: 'atomName',
                title: 'Atom Name',
                align: 'left',
                renderType: 'atomName',
              },
              {
                dataIndex: 'userIdCreated',
                title: 'Creator',
                align: 'left',
                component: {
                  module: 'a-baserender',
                  name: 'renderTableCellUserName',
                },
              },
              {
                dataIndex: 'atomCreatedAt',
                title: 'Created Time',
                align: 'center',
                params: {
                  dateFormat: {
                    lines: true,
                  },
                },
              },
              {
                dataIndex: 'atomUpdatedAt',
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
        subnavbar: false,
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
        subnavbar: false,
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
                dataIndex: 'atomName',
                title: 'Atom Name',
                align: 'left',
                renderType: 'atomName',
              },
              {
                dataIndex: 'userIdCreated',
                title: 'Creator',
                align: 'left',
                component: {
                  module: 'a-baserender',
                  name: 'renderTableCellUserName',
                },
              },
              {
                dataIndex: 'atomCreatedAt',
                title: 'Created Time',
                align: 'center',
                params: {
                  dateFormat: {
                    lines: true,
                  },
                },
              },
              {
                dataIndex: 'atomUpdatedAt',
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
        options: {
          subnavbar: {
            policyDefault: true,
          },
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
        options: {
          subnavbar: {
            policyDefault: true,
          },
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
    atomName: 'Base',
    atomStaticKey: 'layoutAtomListBase',
    atomRevision: 7,
    description: '',
    layoutTypeCode: 3,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
