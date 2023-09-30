const trimHtml = require('@zhennann/trim-html');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class AtomCmsBase extends app.meta.AtomBase {
    get modelCMSArticle() {
      return this.ctx.model.module(moduleInfo.relativeName).article;
    }

    get modelCMSContent() {
      return this.ctx.model.module(moduleInfo.relativeName).content;
    }

    get moduleCMSConfig() {
      return this.ctx.config.module(moduleInfo.relativeName);
    }

    async create({ atomClass, item, options, user }) {
      const atomStage = item.atomStage;
      // super
      const key = await super.create({ atomClass, item, options, user });
      // article
      let editMode;
      let slug;
      if (atomStage === 0) {
        // draft init
        const site = await this.ctx.bean.cms.render.combineSiteBase({ atomClass, mergeConfigSite: true });
        editMode = this.ctx.bean.util.getProperty(site, 'edit.mode') || 0;
        slug = null;
      } else {
        // copy init
        const srcItem = options.createOptions.srcItem;
        editMode = srcItem.editMode;
        slug = srcItem.slug;
      }
      // add article
      const params = {
        atomId: key.atomId,
        editMode,
        slug,
      };
      // uuid
      params.uuid = item.uuid || this.ctx.bean.util.uuidv4();
      // insert
      await this.modelCMSArticle.insert(params);
      // add content
      await this.modelCMSContent.insert({
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
      this._cms_getMeta(options, item, true);
      // ok
      return item;
    }

    async select({ atomClass, options, items, user }) {
      // super
      await super.select({ atomClass, options, items, user });
      // select
      const showSorting = options && options.category;
      for (const item of items) {
        this._cms_getMeta(options, item, showSorting);
      }
    }

    async write({ atomClass, target, key, item, options, user }) {
      const atomStage = item.atomStage;
      // super
      if (!target) {
        await super.write({ atomClass, target, key, item, options, user });
      }
      // write cms
      await this._write_cms({ atomStage, target, key, item, options, user });
      // super
      if (target) {
        await super.write({ atomClass, target, key, item, options, user });
      }
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

    async _write_cms({ atomStage, target, key, item, options, user }) {
      // get atom for safety
      const atomOld = await this.ctx.bean.atom.read({ key, user });
      // if undefined then old
      const fields = [
        // 'atomLanguage',
        'slug',
        'editMode',
        'content',
        'sticky',
        'keywords',
        'description',
        'sorting',
        'flag',
        'extra',
      ];
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
        if (imageFirst.length > 255) {
          imageFirst = '';
        }
      }
      // audio first
      let audioFirst = '';
      let audioCoverFirst = '';
      if (item.editMode === 1) {
        const matches = item.content && item.content.match(/\$\$\$\s*a-markdownblock:audio([\s\S]*?)\$\$\$/);
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
      if (audioCoverFirst.length > 255) {
        audioCoverFirst = '';
      }
      if (audioCoverFirst && !imageFirst) {
        imageFirst = audioCoverFirst;
      }
      // html
      const html = await this._renderContent({ item, atomId: key.atomId });
      const summary = this._parseSummary({ item, html });
      // update article
      await this.modelCMSArticle.update(
        {
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
        },
        {
          where: {
            atomId: key.atomId,
          },
        }
      );
      // update content
      await this.ctx.model.query('update aCmsContent a set a.content=?, a.html=? where a.iid=? and a.atomId=?', [
        item.content,
        html,
        this.ctx.instance.id,
        key.atomId,
      ]);
    }

    async _renderContent({ item, atomId }) {
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
        html = await this.ctx.bean.markdown.render({
          host: {
            atom: item,
            atomId,
          },
          content: item.content,
          locale: item.atomLanguage,
        });
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
        const res = trimHtml(html, this.moduleCMSConfig.article.trim);
        summary = res.html.trim();
      }
      if (!summary) {
        summary = item.description || '';
      }
      // ok
      return summary;
    }

    async delete({ atomClass, key, options, user }) {
      // get atom for safety
      const atomOld = await this.ctx.bean.atom.read({ key, user });

      // delete article
      //   always renderSync=false
      if (atomOld.atomStage === 0) {
        await this.ctx.bean.cms.render._deleteArticlePush({ atomClass, key, article: atomOld, inner: true });
      }
      if (atomOld.atomStage === 1) {
        await this.ctx.bean.cms.render._deleteArticlePush({ atomClass, key, article: atomOld, inner: false });
      }

      // super
      await super.delete({ atomClass, key, options, user });

      // delete article
      await this.modelCMSArticle.delete({
        atomId: key.atomId,
      });
      // delete content
      await this.modelCMSContent.delete({
        atomId: key.atomId,
      });
    }

    _cms_getMeta(options, item, showSorting) {
      const meta = this._ensureItemMeta(item);
      // meta.flags
      if (item.sticky) meta.flags.push(this.ctx.text('Sticky'));
      if (item.sorting && showSorting) meta.flags.push(item.sorting);
      // meta.summary
      meta.summary = item.description || item.summary;
      // atomNameSub
      if (item.atomNameSub) {
        item.atomNameFull = `${item.atomName}: ${item.atomNameSub}`;
      }
    }
  }
  return AtomCmsBase;
};
