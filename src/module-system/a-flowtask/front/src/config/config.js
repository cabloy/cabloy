export default {
  flowTask: {
    actions: {
      viewAtom: {
        title: 'View',
        actionModule: 'a-flowtask',
        actionComponent: 'action',
        icon: { material: 'visibility' },
      },
      handleTask: {
        title: 'Handle',
        actionModule: 'a-flowtask',
        actionComponent: 'action',
        icon: { material: 'done' },
      },
      cancelFlow: {
        title: 'Cancel Flow',
        actionModule: 'a-flowtask',
        actionComponent: 'action',
        icon: { material: 'clear' },
      },
      assigneesConfirmation: {
        title: 'Confirmation',
        actionModule: 'a-flowtask',
        actionComponent: 'action',
        icon: { material: 'group' },
      },
    },
    render: {
      atom: {
        info: {
          attachment: true,
          comment: true,
        },
        layouts: {
          mobile: {
            component: {
              module: 'a-flowtask',
              name: 'atomLayoutMobile',
            },
            blocks: {
              title: {
                component: {
                  module: 'a-flowtask',
                  name: 'atomLayoutBlockMobileTitle',
                },
              },
              main: {
                component: {
                  module: 'a-flowtask',
                  name: 'atomLayoutBlockMobileMain',
                },
              },
            },
          },
        },
      },
    },
  },
  flow: {
    render: {
      item: {
        info: {
          attachment: true,
          comment: true,
        },
        layouts: {
          mobile: {
            component: {
              module: 'a-flowtask',
              name: 'flowLayoutMobile',
            },
            blocks: {
              title: {
                component: {
                  module: 'a-flowtask',
                  name: 'flowLayoutBlockMobileTitle',
                },
              },
              subnavbar: {
                component: {
                  module: 'a-flowtask',
                  name: 'flowLayoutBlockMobileSubnavbar',
                },
              },
              main: {
                component: {
                  module: 'a-flowtask',
                  name: 'flowLayoutBlockMobileMain',
                },
              },
            },
          },
          pc: {
            component: {
              module: 'a-flowtask',
              name: 'flowLayoutPC',
            },
            blocks: {
              title: {
                component: {
                  module: 'a-flowtask',
                  name: 'flowLayoutBlockPCTitle',
                },
              },
              main: {
                component: {
                  module: 'a-flowtask',
                  name: 'flowLayoutBlockMobileMain',
                },
              },
            },
          },
        },
      },
    },
  },
};
