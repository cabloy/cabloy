import type { ZovaSys } from 'zova';

import AvatarUser from '../../assets/img/avatar_user.png';

export const config = (_sys: ZovaSys) => {
  return {
    layout: {
      sidebar: {
        width: 300,
      },
      navbar: {
        height: 132,
      },
    },
    avatar: {
      empty: AvatarUser,
    },
  };
};
