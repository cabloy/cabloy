// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // startups
  config.startups = {
    cacheMailScenes: {
      bean: 'cacheMailScenes',
      instance: true,
    },
  };

  // broadcasts
  config.broadcasts = {
    mailSceneChanged: {
      bean: 'mailSceneChanged',
    },
  };

  // scenes
  config.scenes = {
    system: {
      title: 'System',
      transport: {
        host: '',
        port: 0,
        secure: false,
        auth: {
          user: '',
          pass: '',
        },
        logger: false,
        debug: false,
      },
      defaults: {
        from: '',
      },
    },
  };

  return config;
};
