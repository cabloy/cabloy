/** @module a-base/front/config */

import avatarUser from '../assets/img/user.png';

/** The front config of a-base
 * @property {object} stage - The stages of atom.
 * @property {number} stage.draft - 0
 * @property {number} stage.formal - 1
 * @property {number} stage.history - 2
 * @property {object} user
 * @property {object} user.avatar
 * @property {string} user.avatar.default - The default avatar
 */
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
  layoutManager: {
    base: {
      info: {
        data: {
          adapter: {
            component: {
              module: 'a-basefront',
              name: 'listLayoutDataAdapter',
            },
            providers: {
              all: {
                component: {
                  module: 'a-basefront',
                  name: 'listLayoutDataProviderAll',
                },
              },
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
                dataSourceAdapter: {
                  component: null,
                },
                treeviewRoot: {
                  attrs: {
                    itemToggle: false,
                    selectable: true,
                  },
                },
              },
            },
          },
        },
      },
      layouts: {
        base: {
          blocks: {
            caption: {
              component: {
                module: 'a-baselayout',
                name: 'baseLayoutBlockCaption',
              },
              renderImmediate: true,
            },
            title: {
              component: {
                module: 'a-baselayout',
                name: 'baseLayoutBlockTitle',
              },
            },
            subnavbar: {
              component: {
                module: 'a-baselayout',
                name: 'baseLayoutBlockSubnavbar',
              },
            },
            main: {
              component: {
                module: 'a-baselayout',
                name: 'baseLayoutBlockMain',
              },
            },
          },
        },
        default: {
          title: 'LayoutDefault',
          component: {
            module: 'a-baselayout',
            name: 'baseLayoutDefault',
          },
          subnavbar: false,
        },
        list: {
          title: 'LayoutList',
          component: {
            module: 'a-baselayout',
            name: 'baseLayoutList',
          },
          subnavbar: false,
          blocks: {
            item: {
              component: {
                module: 'a-baselayout',
                name: 'baseLayoutBlockListItem',
              },
            },
            items: {
              component: {
                module: 'a-baselayout',
                name: 'baseLayoutBlockListItems',
              },
            },
          },
        },
      },
    },
  },
  securityLevelProtection: {
    body: {
      crypto: false,
      cryptojs: '/a/base/js/bodyCrypto',
    },
  },
};
