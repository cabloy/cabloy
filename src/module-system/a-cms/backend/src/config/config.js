// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // queues
  config.queues = {
    render: {
      bean: 'render',
      concurrency: true,
    },
  };

  // startups
  config.startups = {
    registerAllWatchers: {
      bean: 'registerAllWatchers',
      instance: true,
      debounce: true,
    },
    registerDevelopment: {
      bean: 'registerDevelopment',
      debounce: true,
    },
  };

  // article
  config.article = {
    trim: {
      limit: 100,
      wordBreak: false,
      preserveTags: false,
    },
  };

  // watch
  config.watch = {
    atomClass: null,
  };

  // site
  config.cms = {};
  config.cms.site = {
    base: {
      title: 'my blog',
      subTitle: 'gone with the wind',
      description: '',
      keywords: '',
    },
    host: {
      url: 'http://localhost',
      rootPath: 'cms-test',
    },
    language: {
      default: 'en-us',
      items: 'en-us,zh-cn',
    },
    themes: {
      'en-us': 'cms-themeblog',
      'zh-cn': 'cms-themeblog',
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
    beian: {
      icp: '',
    },
  };

  //
  return config;
};
