// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // plugin
  config.plugin = {
    default: 'simple',
    license: {
      link: 'http://creativecommons.org/licenses/by-nc-sa/4.0/',
      version: 'BY-NC-SA 4.0',
      content: '',
    },
    titles: {
      title: 'Title',
      author: 'Author',
      createdAt: 'Created Time',
      updatedAt: 'Modification Time',
      link: 'Link',
      markdown: 'MarkdownSource',
      license: 'CopyrightLicenseTitle',
    },
    copyrights: {
      none: null,
      simple: {
        fields: 'author,link,markdown',
      },
      license: {
        fields: 'author,link,markdown,license',
      },
      full: {
        fields: 'title,author,createdAt,updatedAt,link,markdown,license',
      },
    },
  };

  return config;
};
