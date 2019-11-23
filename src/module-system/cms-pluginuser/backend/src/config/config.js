// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // plugin
  config.plugin = {
    links: [
      { title: 'PersonalProfile', url: '/a/user/user/mine' },
      // { title: 'front', url: 'static/comments.html' },
      // { title: 'external', url: 'https://cabloy.com' },
    ],
  };

  return config;
};
