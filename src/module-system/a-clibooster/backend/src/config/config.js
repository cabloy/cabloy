// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // store
  config.store = {
    token: {
      host: 'https://portal.cabloy.com',
    },
    publish: {
      patterns: {
        trial: [
          '**',
          '!node_modules',
          '!miniprogram_npm',
          '!.git',
          '!.DS_Store',
          '!backend/src',
          '!backend/static',
          '!backend/test',
          '!front/src',
          '!icons',
        ],
        official: ['**', '!node_modules', '!miniprogram_npm', '!.git', '!.DS_Store'],
        suite: ['**', '!node_modules', '!miniprogram_npm', '!.git', '!.DS_Store', '!modules'],
      },
    },
  };

  return config;
};
