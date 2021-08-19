import configResourceRenderList from './config/configResourceRenderList.js';
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
        list: configResourceRenderList,
      },
    },
  },
};
