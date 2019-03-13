// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // site
  config.site = {
    base: {
      title: 'Community',
      subTitle: 'Talk about CabloyJS',
      description: '',
      keywords: '',
      publishOnSubmit: true,
    },
    host: {
      url: 'http://community.example.com',
      rootPath: '',
    },
    language: {
      default: 'en-us',
      items: 'en-us',
    },
    themes: {
      'en-us': 'cms-themeblog', // 'cms-themecommunity'
    },
    edit: {
      mode: 1, // markdown
    },
    env: {
      format: {
        date: 'YYYY-MM-DD',
        time: 'HH:mm:ss',
      },
      comment: {
        order: 'asc',
        recentNum: 5,
      },
      brother: {
        order: 'desc',
      },
    },
    profile: {

    },
  };

  return config;
};
