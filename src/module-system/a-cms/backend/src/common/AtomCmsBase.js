const require3 = require('require3');
const trimHtml = require3('@zhennann/trim-html');
const markdown = require3('@zhennann/markdown');
const markdonw_it_block = require3('@zhennann/markdown-it-block');
const uuid = require3('uuid');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class AtomCmsBase extends app.meta.AtomBase {

    get modelArticle() {
      return this.ctx.model.module(moduleInfo.relativeName).article;
    }

    get modelContent() {
      return this.ctx.model.module(moduleInfo.relativeName).content;
    }

    get moduleConfig() {
      return this.ctx.config.module(moduleInfo.relativeName);
    }

    async create({ atomClass, item, user }) {
      // super
      const key = await super.create({ atomClass, item, user });
      // article
      const site = await this.ctx.bean.cms.render.combineSiteBase({ atomClass, mergeConfigSite: true });
      const editMode = this.ctx.bean.util.getProperty(site, 'edit.mode') || 0;
      // add article
      const params = {
        atomId: key.atomId,
        editMode,
      };
      // uuid
      params.uuid = item.uuid || uuid.v4().replace(/-/g, '');
      // insert
      await this.modelArticle.insert(params);
      // add content
      await this.modelContent.insert({
        atomId: key.atomId,
        content: '',
      });
      return { atomId: key.atomId };
    }

    async read({ atomClass, options, key, user }) {
      // super
      const item = await super.read({ atomClass, options, key, user });
      if (!item) return null;
      // read: showSorting=true
      this._getMeta(item, true);
      // ok
      return item;
    }

    async select({ atomClass, options, items, user }) {
      // super
      await super.select({ atomClass, options, items, user });
      // select
      const showSorting = options && options.category;
      for (const item of items) {
        this._getMeta(item, showSorting);
      }
    }

    async write({ atomClass, target, key, item, options, user }) {
      const atomStage = item.atomStage;
      // get atom for safety
      const atomOld = await this.ctx.bean.atom.read({ key, user });
      // super
      await super.write({ atomClass, target, key, item, options, user });
      // if undefined then old
      const fields = [ 'atomLanguage', 'slug', 'editMode', 'content', 'sticky', 'keywords', 'description', 'sorting', 'flag', 'extra' ];
      for (const field of fields) {
        if (item[field] === undefined) item[field] = atomOld[field];
      }
      // clone
      if (target === 'clone') {
        item.slug = null; // clear slug
      } else if (item.slug) {
        item.slug = item.slug.trim();
      }
      // url
      let url;
      const draftExt = atomStage === 0 ? '.draft' : '';
      if (item.slug) {
        url = `articles/${item.slug}${draftExt}.html`;
      } else {
        url = `articles/${atomOld.uuid}${draftExt}.html`;
      }
      // image first
      let imageFirst = '';
      if (item.editMode === 1) {
        const matches = item.content && item.content.match(/!\[[^\]]*?\]\(([^\)]*?)\)/);
        imageFirst = (matches && matches[1]) || '';
      }
      // audio first
      let audioFirst = '';
      let audioCoverFirst = '';
      if (item.editMode === 1) {
        const matches = item.content && item.content.match(/\$\$\$\s*cms-pluginblock:blockAudio([\s\S]*?)\$\$\$/);
        let options = matches && matches[1];
        if (options) {
          options = global.JSON5.parse(options);
          if (options && options.audio) {
            if (Array.isArray(options.audio)) {
              audioFirst = options.audio[0].url;
              audioCoverFirst = options.audio[0].cover;
            } else {
              audioFirst = options.audio.url;
              audioCoverFirst = options.audio.cover;
            }
          }
        }
      }
      if (audioCoverFirst && !imageFirst) {
        imageFirst = audioCoverFirst;
      }
      // html
      const html = await this._renderContent({ item });
      const summary = this._parseSummary({ item, html });
      // update article
      await this.modelArticle.update({
        sticky: item.sticky,
        keywords: item.keywords,
        description: item.description,
        summary,
        url,
        editMode: item.editMode,
        slug: item.slug,
        sorting: item.sorting,
        flag: item.flag,
        extra: item.extra || '{}',
        imageCover: item.imageCover,
        imageFirst,
        audioFirst,
        audioCoverFirst,
      }, {
        where: {
          atomId: key.atomId,
        },
      });
      // update content
      await this.ctx.model.query('update aCmsContent a set a.content=?, a.html=? where a.iid=? and a.atomId=?',
        [ item.content, html, this.ctx.instance.id, key.atomId ]);

      // render
      const ignoreRender = options && options.ignoreRender;
      const renderSync = options && options.renderSync;
      if (!ignoreRender) {
        if (atomStage === 0 || atomStage === 1) {
          const inner = atomStage === 0;
          if (renderSync) {
            await this.ctx.bean.cms.render._renderArticlePushAsync({ atomClass, key, inner });
          } else {
            await this.ctx.bean.cms.render._renderArticlePush({ atomClass, key, inner });
          }
        }
      }
    }

    async _renderContent({ item }) {
      // editMode
      const editMode = item.editMode;
      // html
      let html = '';
      // not use item.html directly, for maybe handled twice
      // if (item.html) {
      //  html = item.html;
      // } else {
      if (editMode === 0) {
        // 0: custom
        //   same as plain text
        // html = item.html || '';
        html = item.content || '';
      } else if (editMode === 1) {
        // 1: markdown
        //   always renderMarkdown, for html maybe different for stage:0/1
        html = await this._renderMarkdown({ item });
      } else if (editMode === 2) {
        // 2: html
        html = item.content || '';
      } else {
        // not supported
        // do nothing
      }
      // }
      // title
      const title = this.ctx.bean.util.escapeHtml(item.atomName);
      html = `<!-- ${title} -->\r\n` + html;
      // ok
      return html;
    }

    _parseSummary({ item, html }) {
      // summary
      let summary;
      if (html) {
        const res = trimHtml(html, this.moduleConfig.article.trim);
        summary = res.html.trim();
      }
      if (!summary) {
        summary = item.description || '';
      }
      // ok
      return summary;
    }

    async _renderMarkdown({ item }) {
      if (!item.content) return '';
      // markdown
      const md = markdown.create();
      // markdown-it-block
      const blocks = this.ctx.bean.cms.site.getBlocks();
      // asyncs
      const asyncs = {};
      // block options
      const blockOptions = {
        ctx: this.ctx,
        article: item,
        utils: {
          text: (...args) => {
            return this.ctx.text.locale(item.atomLanguage || this.ctx.app.config.i18n.defaultLocale, ...args);
          },
        },
        blocks,
      };
      md.use(markdonw_it_block, blockOptions);
      // render
      const content = md.render(item.content);
      return content;
    }

    async delete({ atomClass, key, user }) {
      // get atom for safety
      const atomOld = await this.ctx.bean.atom.read({ key, user });

      // delete article
      await this.modelArticle.delete({
        atomId: key.atomId,
      });
      // delete content
      await this.modelContent.delete({
        atomId: key.atomId,
      });

      // delete article
      //   always renderSync=false
      if (atomOld.atomStage === 0) {
        await this.ctx.bean.cms.render._deleteArticlePush({ atomClass, key, article: atomOld, inner: true });
      }
      if (atomOld.atomStage === 1) {
        await this.ctx.bean.cms.render._deleteArticlePush({ atomClass, key, article: atomOld, inner: false });
      }

      // super
      await super.delete({ atomClass, key, user });
    }

    _getMeta(item, showSorting) {
      // flags
      const flags = [];
      if (item.sticky) flags.push(this.ctx.text('Sticky'));
      if (item.sorting && showSorting) flags.push(item.sorting);
      // meta
      const meta = {
        summary: item.summary,
        flags,
      };
      // ok
      item._meta = meta;
    }

  }
  return AtomCmsBase;
};
