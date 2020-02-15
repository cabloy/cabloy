// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // queues
  config.queues = {
    render: {
      path: 'queue/render',
    },
  };

  // startups
  config.startups = {
    registerAllWatchers: {
      type: 'worker',
      instance: true,
      path: 'site/registerAllWatchers',
    },
  };

  // article
  config.article = {
    trim: {
      limit: 100,
      wordBreak: false,
      preserveTags: false,
    },
    // publishOnSubmit: true,
  };

  // checkFile
  config.checkFile = {
    timeout: 1000,
    timeoutDelay: 5000,
  };

  // site
  config.site = {
    base: {
      title: 'my blog',
      subTitle: 'gone with the wind',
      description: '',
      keywords: '',
      publishOnSubmit: true,
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
      article2: {
        recentNum: 5,
      },
      comment: {
        order: 'asc',
        recentNum: 5,
      },
      brother: {
        order: 'desc',
      },
      loadMore: {
        loadOnScroll: false,
      },
    },
    profile: {
      userName: 'zhennann',
      motto: 'Less is more, while more is less.',
      avatar: 'assets/images/avatar.jpg',
      url: 'index.html',
      extra: '',
    },
  };

  //
  return config;
};
