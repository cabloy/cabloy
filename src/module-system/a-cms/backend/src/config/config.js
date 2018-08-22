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
      url: '',
      rootPath: '',
    },
    format: {
      date: 'YYYY-MM-DD',
      time: 'HH:mm:ss',
    },
    language: {
      default: 'en-us',
      items: 'en-us',
    },
    themes: {
      'en-us': 'cms-themeblog',
    },
  };

  //
  return config;
};
