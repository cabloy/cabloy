module.exports = app => {

  class RSSController extends app.Controller {

    async feed() {
      // language
      const language = this.ctx.params.language;
      // options
      const options = {
        where: {
          'f.language': language,
        },
        orders: [
          [ 'a.updatedAt', 'desc' ],
        ],
        page: { index: 0 },
        mode: 'list',
      };
      // select
      const res = await this.ctx.performAction({
        method: 'post',
        url: '/a/cms/article/list',
        body: { options },
      });
      const list = res.list;
      // site
      const site = await this.ctx.service.render.getSite({ language });
      // feed
      let feed =
`<rss xmlns:dc="http://purl.org/dc/elements/1.1/" version="2.0">
  <channel>
    <title><![CDATA[${site.base.title}]]></title>
    <link>${this.ctx.service.render.getUrl(site, language, 'index.html')}</link>
    <description><![CDATA[${site.base.description || site.base.subTitle}]]></description>
    <language>${language}</language>
    <generator>https://cms.cabloy.org</generator>
`;
      for (const article of list) {
        feed +=
`
    <item>
      <title>
        <![CDATA[
          ${article.atomName}
        ]]>
      </title>
      <link>
        ${this.ctx.service.render.getUrl(site, language, article.url)}
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
      feed +=
`
  </channel>
</rss>
`;
      // ok
      this.ctx.status = 200;
      this.ctx.body = feed;
      this.ctx.set('content-type', 'application/rss+xml; charset=UTF-8');
    }

    async feedComments() {
      // language
      const language = this.ctx.params.language;
      // options
      const options = {
        orders: [
          [ 'h_updatedAt', 'desc' ],
        ],
        page: { index: 0 },
      };
      // select
      const res = await this.ctx.performAction({
        method: 'post',
        url: '/a/cms/comment/all',
        body: {
          options,
        },
      });
      const list = res.list;
      // site
      const site = await this.ctx.service.render.getSite({ language });
      // feed
      let feed =
`<rss xmlns:dc="http://purl.org/dc/elements/1.1/" version="2.0">
  <channel>
    <title><![CDATA[Comments for ${site.base.title}]]></title>
    <link>${this.ctx.service.render.getUrl(site, language, 'index.html')}</link>
    <description><![CDATA[${site.base.description || site.base.subTitle}]]></description>
    <language>${language}</language>
    <generator>https://cms.cabloy.org</generator>
`;
      for (const item of list) {
        feed +=
`
    <item>
      <title>
        <![CDATA[
          Comment on ${item.atomName}
        ]]>
      </title>
      <link>
        ${this.ctx.service.render.getUrl(site, language, item.url)}#comments
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
      feed +=
`
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
      const article = await this.ctx.service.render._getArticle({ key: { atomId }, inner: false });
      // language
      const language = article.language;
      // options
      const options = {
        orders: [
          [ 'updatedAt', 'desc' ],
        ],
        page: { index: 0 },
      };
      const res = await this.ctx.performAction({
        method: 'post',
        url: '/a/base/comment/list',
        body: {
          key: { atomId },
          options,
        },
      });
      const list = res.list;
      // site
      const site = await this.ctx.service.render.getSite({ language });
      // feed
      let feed =
`<rss xmlns:dc="http://purl.org/dc/elements/1.1/" version="2.0">
  <channel>
    <title><![CDATA[Comments on: ${article.atomName}]]></title>
    <link>${this.ctx.service.render.getUrl(site, language, article.url)}</link>
    <description><![CDATA[${article.description || article.summary}]]></description>
    <language>${language}</language>
    <generator>https://cms.cabloy.org</generator>
`;
      for (const item of list) {
        feed +=
`
    <item>
      <title>
        <![CDATA[
          Comment on ${article.atomName}
        ]]>
      </title>
      <link>
        ${this.ctx.service.render.getUrl(site, language, article.url)}#comments
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
      feed +=
`
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

