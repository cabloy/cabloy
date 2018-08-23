// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // site
  config.site = {
    base: {
      title: '',
      subTitle: '',
      description: '',
      keywords: '',
    },
    host: {
      url: 'http://example.com',
      rootPath: '',
    },
    format: {
      date: 'YYYY-MM-DD',
      time: 'HH:mm:ss',
    },
    language: {
      default: 'en-us',
      items: 'en-us,zh-cn',
    },
    themes: {
      'en-us': 'cms-themeblog',
      'zh-cn': 'cms-themeblog',
    },
  };

  //
  return config;
};
