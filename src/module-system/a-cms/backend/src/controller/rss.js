module.exports = app => {
  // const moduleInfo = module.info;
  class RSSController extends app.Controller {
    async feed() {
      // params
      //   module
      const module = this.ctx.params.module;
      //   atomClassName
      const atomClassName = this.ctx.params.atomClassName;
      //   language
      const language = this.ctx.params.language;
      // atomClass
      const atomClass = { module, atomClassName };
      // options
      const options = {
        language,
        orders: [['a.updatedAt', 'desc']],
        page: { index: 0 },
        mode: 'default',
      };
      // select
      const res = await this.ctx.meta.util.performAction({
        method: 'post',
        url: '/a/cms/article/list',
        body: { atomClass, options },
      });
      const list = res.list;
      // build
      const build = this.ctx.bean.cms.build({ atomClass });
      // site
      const site = await build.getSite({ language });
      // feed
      let feed = `<rss xmlns:dc="http://purl.org/dc/elements/1.1/" version="2.0">
  <channel>
    <title><![CDATA[${site.base.title}]]></title>
    <link>${build.getUrl(site, language, 'index.html')}</link>
    <description><![CDATA[${site.base.description || site.base.subTitle}]]></description>
    <language>${language}</language>
    <generator>https://cms.cabloy.com</generator>
`;
      for (const article of list) {
        feed += `
    <item>
      <title>
        <![CDATA[
          ${article.atomName}
        ]]>
      </title>
      <link>
        ${build.getUrl(site, language, article.url)}
      </link>
      <description>
        <![CDATA[
          ${article.description || article.summary}
        ]]>
      </description>
      <category><![CDATA[${article.categoryName}]]></category>
      <pubDate>${article.updatedAt}</pubDate>
      <dc:creator><![CDATA[${article.userName}]]></dc:creator>
    </item>
`;
      }
      feed += `
  </channel>
</rss>
`;
      // ok
      this.ctx.status = 200;
      this.ctx.body = feed;
      this.ctx.set('content-type', 'application/rss+xml; charset=UTF-8');
    }

    async feedComments() {
      // params
      //   module
      const module = this.ctx.params.module;
      //   atomClassName
      const atomClassName = this.ctx.params.atomClassName;
      //   language
      const language = this.ctx.params.language;
      // atomClass
      const atomClass = { module, atomClassName };
      // options
      const options = {
        orders: [['h_updatedAt', 'desc']],
        page: { index: 0 },
      };
      // select
      const res = await this.ctx.meta.util.performAction({
        method: 'post',
        url: '/a/cms/comment/all',
        body: { atomClass, options },
      });
      const list = res.list;
      // build
      const build = this.ctx.bean.cms.build({ atomClass });
      // site
      const site = await build.getSite({ language });
      // feed
      let feed = `<rss xmlns:dc="http://purl.org/dc/elements/1.1/" version="2.0">
  <channel>
    <title><![CDATA[Comments for ${site.base.title}]]></title>
    <link>${build.getUrl(site, language, 'index.html')}</link>
    <description><![CDATA[${site.base.description || site.base.subTitle}]]></description>
    <language>${language}</language>
    <generator>https://cms.cabloy.com</generator>
`;
      for (const item of list) {
        feed += `
    <item>
      <title>
        <![CDATA[
          Comment on ${item.atomName}
        ]]>
      </title>
      <link>
        ${build.getUrl(site, language, item.url)}#comments
      </link>
      <description>
        <![CDATA[
          ${item.h_summary}
        ]]>
      </description>
      <pubDate>${item.h_updatedAt}</pubDate>
      <dc:creator><![CDATA[${item.h_userName}]]></dc:creator>
    </item>
`;
      }
      feed += `
  </channel>
</rss>
`;
      // ok
      this.ctx.status = 200;
      this.ctx.body = feed;
      this.ctx.set('content-type', 'application/rss+xml; charset=UTF-8');
    }

    async articleComments() {
      // atomId
      const atomId = this.ctx.params.atomId;
      // article
      const article = await this.ctx.bean.cms.render.getArticle({ key: { atomId }, inner: false });
      if (!article) this.ctx.throw.module('a-base', 1002);
      // language
      const language = article.atomLanguage;
      // options
      const options = {
        orders: [['updatedAt', 'desc']],
        page: { index: 0 },
      };
      const res = await this.ctx.meta.util.performAction({
        method: 'post',
        url: '/a/base/comment/list',
        body: {
          key: { atomId },
          options,
        },
      });
      const list = res.list;
      // atomClass
      const atomClass = await this.ctx.bean.atomClass.get({ id: article.atomClassId });
      // build
      const build = this.ctx.bean.cms.build({ atomClass });
      // site
      const site = await build.getSite({ language });
      // feed
      let feed = `<rss xmlns:dc="http://purl.org/dc/elements/1.1/" version="2.0">
  <channel>
    <title><![CDATA[Comments on: ${article.atomName}]]></title>
    <link>${build.getUrl(site, language, article.url)}</link>
    <description><![CDATA[${article.description || article.summary}]]></description>
    <language>${language}</language>
    <generator>https://cms.cabloy.com</generator>
`;
      for (const item of list) {
        feed += `
    <item>
      <title>
        <![CDATA[
          Comment on ${article.atomName}
        ]]>
      </title>
      <link>
        ${build.getUrl(site, language, article.url)}#comments
      </link>
      <description>
        <![CDATA[
          ${item.summary}
        ]]>
      </description>
      <pubDate>${item.updatedAt}</pubDate>
      <dc:creator><![CDATA[${item.userName}]]></dc:creator>
    </item>
`;
      }
      feed += `
  </channel>
</rss>
`;
      // ok
      this.ctx.status = 200;
      this.ctx.body = feed;
      this.ctx.set('content-type', 'application/rss+xml; charset=UTF-8');
    }
  }
  return RSSController;
};
