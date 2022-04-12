const list = {
  info: {
    layout: {
      viewSize: {
        small: { name: 'list' },
        medium: { name: 'table' },
        large: { name: 'table' },
      },
    },
    data: {
      adapter: {
        component: {
          module: 'a-basefront',
          name: 'listLayoutDataAdapter',
        },
        providers: {
          continuous: {
            component: {
              module: 'a-basefront',
              name: 'listLayoutDataProviderContinuous',
            },
          },
          paged: {
            component: {
              module: 'a-basefront',
              name: 'listLayoutDataProviderPaged',
            },
          },
          tree: {
            component: {
              module: 'a-basefront',
              name: 'listLayoutDataProviderTree',
            },
            fields: {
              sorting: null,
            },
            treeviewAdapter: {
              component: null,
            },
          },
        },
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
            name: 'listLayoutBlockListTitle',
          },
        },
        subnavbar: {
          component: {
            module: 'a-baselayout',
            name: 'listLayoutBlockListSubnavbar',
          },
        },
      },
    },
    card: {
      title: 'LayoutCard',
      component: {
        module: 'a-baselayout',
        name: 'listLayoutCard',
      },
      blocks: {
        items: {
          component: {
            module: 'a-baselayout',
            name: 'listLayoutBlockCardItems',
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
        name: 'listLayoutList',
      },
      blocks: {
        items: {
          component: {
            module: 'a-baselayout',
            name: 'listLayoutBlockListItems',
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
        name: 'listLayoutTable',
      },
      blocks: {
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
            name: 'listLayoutBlockTableBottombar',
          },
        },
      },
    },
    tree: {
      title: 'LayoutTree',
      component: {
        module: 'a-baselayout',
        name: 'listLayoutTree',
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
        name: 'listLayoutTreeTable',
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
            name: 'listLayoutBlockTableItems',
          },
          sorter: false,
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
};
export default list;
