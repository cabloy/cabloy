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
      info: {},
      layouts: {
        base: {
          blocks: {
            caption: {
              component: {
                module: 'a-baselayout',
                name: 'baseLayoutBlockCaption',
              },
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
          },
        },
      },
    },
  },
};
