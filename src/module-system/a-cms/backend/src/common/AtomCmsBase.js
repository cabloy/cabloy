const require3 = require('require3');
const trimHtml = require3('@zhennann/trim-html');
const markdown = require3('@zhennann/markdown');
const markdonw_it_block = require3('@zhennann/markdown-it-block');
const uuid = require3('uuid');
const utils = require('./utils.js');

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
      const editMode = this.ctx.util.getProperty(site, 'edit.mode') || 0;
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
      // html
      const { html, summary } = this._renderContent({ item });
      // update article
      await this.modelArticle.update({
        id: key.itemId,
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
        imageFirst,
        audioFirst,
        audioCoverFirst,
      });
      // update content
      await this.ctx.model.query('update aCmsContent a set a.content=?, a.html=? where a.iid=? and a.atomId=?',
        [ item.content, html, this.ctx.instance.id, key.atomId ]);

      // render
      const ignoreRender = options && options.ignoreRender;
      if (!ignoreRender) {
        if (atomStage === 0) {
          await this.ctx.bean.cms.render._renderArticlePush({ atomClass, key, inner: true });
        }
        if (atomStage === 1) {
          await this.ctx.bean.cms.render._renderArticlePush({ atomClass, key, inner: false });
        }
      }
    }

    _renderContent({ item }) {
      // editMode
      const editMode = item.editMode;
      // html
      let html = '';
      if (editMode === 0) {
        // 0: custom
        html = item.html || '';
      } else if (editMode === 1) {
        // 1: markdown
        html = this._renderMarkdown({ item });
      } else if (editMode === 2) {
        // 2: html
        html = item.content || '';
      } else {
        // not supported
        // do nothing
      }
      // summary
      let summary;
      if (item.summary) {
        summary = item.summary;
      } else if (html) {
        const res = trimHtml(html, this.moduleConfig.article.trim);
        summary = res.html;
      }
      if (!summary) {
        summary = item.description || '';
      }
      // title
      const title = utils.escapeHtml(item.atomName);
      html = `<!-- ${title} -->\r\n` + html;
      // ok
      return { html, summary };
    }

    _renderMarkdown({ item }) {
      if (!item.content) return '';
      // markdown
      const md = markdown.create();
      // markdown-it-block
      const blocks = this.ctx.bean.cms.site.getBlocks();
      // block options
      const blockOptions = {
        utils: {
          text: (...args) => {
            return this.ctx.text.locale(item.atomLanguage, ...args);
          },
        },
        blocks,
      };
      md.use(markdonw_it_block, blockOptions);
      // render
      return md.render(item.content);
    }

    async delete({ atomClass, key, user }) {
      // get atom for safety
      const atomOld = await this.ctx.bean.atom.read({ key, user });

      // delete article
      await this.modelArticle.delete({
        id: key.itemId,
      });
      // delete content
      await this.modelContent.delete({
        itemId: key.itemId,
      });

      // delete article
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
