export default {
  atom: {
    render: {
      list: {
        info: {
          orders: [
            { name: 'atomCreatedAt', title: 'Created Time', by: 'desc', tableAlias: '' },
            { name: 'atomUpdatedAt', title: 'Modification Time', by: 'desc', tableAlias: '' },
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
              { name: 'atomCreatedAt', title: 'Created Time' },
              { name: 'atomUpdatedAt', title: 'Modification Time' },
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
                    dataIndex: 'atomCreatedAt',
                    title: 'Created Time',
                    align: 'left',
                  },
                  {
                    dataIndex: 'atomUpdatedAt',
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
        info: {
          attachment: true,
          comment: true,
        },
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
          pc: {
            component: {
              module: 'a-baselayout',
              name: 'itemLayoutPC',
            },
            blocks: {
              title: {
                component: {
                  module: 'a-baselayout',
                  name: 'itemLayoutBlockPCTitle',
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
  resource: {
    render: {
      tree: {
        layouts: {
          accordion: {
            component: {
              module: 'a-baselayout',
              name: 'resourceTreeLayoutAccordion',
            },
            blocks: {
              title: {
                component: {
                  module: 'a-baselayout',
                  name: 'resourceTreeLayoutBlockAccordionTitle',
                },
              },
              items: {
                component: {
                  module: 'a-baselayout',
                  name: 'resourceTreeLayoutBlockAccordionItems',
                },
              },
            },
          },
          tree: {
            component: {
              module: 'a-baselayout',
              name: 'resourceTreeLayoutTree',
            },
            blocks: {
              title: {
                component: {
                  module: 'a-baselayout',
                  name: 'resourceTreeLayoutBlockTreeTitle',
                },
              },
              items: {
                component: {
                  module: 'a-baselayout',
                  name: 'resourceTreeLayoutBlockTreeItems',
                },
              },
            },
          },
        },
      },
    },
  },
};
