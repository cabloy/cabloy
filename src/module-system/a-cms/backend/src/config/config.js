// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // article
  config.article = {
    trim: {
      limit: 100,
      wordBreak: false,
      preserveTags: false,
    },
    publishOnSubmit: true,
  };

  // site
  config.site = {
    base: {
      title: 'my blog',
      subTitle: 'gone with the wind',
      description: '',
      keywords: '',
    },
    host: {
      url: 'http://example.com',
      rootPath: '',
    },
    language: {
      default: 'en-us',
      items: 'en-us',
    },
    themes: {
      'en-us': 'cms-themeblog',
    },
    edit: {
      mode: 1, // markdown
    },
    env: {
      format: {
        date: 'YYYY-MM-DD',
        time: 'HH:mm:ss',
      },
      comments: {
        order: 'asc',
      },
    },
    profile: {
      userName: 'zhennann',
      motto: 'Less is more, while more is less.',
      avatar: 'assets/images/avatar.jpg',
      avatarUrl: '',
    },
  };

  //
  return config;
};
