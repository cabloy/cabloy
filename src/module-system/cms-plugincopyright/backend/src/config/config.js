// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // plugin
  config.plugin = {
    default: 'simple',
    copyrights: {
      none: null,
      simple: {
        fields: [
          { title: 'Author', value: '{{params.article.userName}}' },
          { title: 'Link', value: '<a href="{{params.url(params.article.url)}}">{{params.url(params.article.url)}}</a>' },
          { title: 'MarkdownSource', value: '<a href="{{`${params.site.serverUrl}/api/cms/plugincopyright/util/md/${params.article.atomId}`}}">{{`${params.site.serverUrl}/api/cms/plugincopyright/util/md/${params.article.atomId}`}}</a>' },
        ],
      },
      license: {
        fields: [
          { title: 'Author', value: '{{params.article.userName}}' },
          { title: 'Link', value: '<a href="{{params.url(params.article.url)}}">{{params.url(params.article.url)}}</a>' },
          { title: 'MarkdownSource', value: '<a href="{{`${params.site.serverUrl}/api/cms/plugincopyright/util/md/${params.article.atomId}`}}">{{`${params.site.serverUrl}/api/cms/plugincopyright/util/md/${params.article.atomId}`}}</a>' },
          { title: 'CopyrightLicenseTitle', value: '{{params.text(\'CopyrightLicenseContent\',\'<a href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><span class="glyphicon glyphicon-subtitles"></span> BY-NC-SA 4.0</a>\')}}' },
        ],
      },
    },
  };

  return config;
};
