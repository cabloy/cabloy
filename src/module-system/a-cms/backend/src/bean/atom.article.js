const require3 = require('require3');
const trimHtml = require3('@zhennann/trim-html');
const markdown = require3('@zhennann/markdown');
const markdonw_it_block = require3('@zhennann/markdown-it-block');
const uuid = require3('uuid');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom extends app.meta.AtomBase {

    async create({ atomClass, item, user }) {
      // super
      const key = await super.create({ atomClass, item, user });
      // article
      const site = await this.ctx.service.render.combineSiteBase({ atomClass, mergeConfigSite: true });
      const editMode = site.edit.mode;
      // add article
      const params = {
        atomId: key.atomId,
        editMode,
      };
      // uuid
      params.uuid = item.uuid || uuid.v4().replace(/-/g, '');
      // insert
      const res = await this.ctx.model.article.insert(params);
      const itemId = res.insertId;
      // add content
      await this.ctx.model.content.insert({
        atomId: key.atomId,
        itemId,
        content: '',
      });
      return { atomId: key.atomId, itemId };
    }

    async read({ atomClass, key, user }) {
      // super
      const item = await super.read({ atomClass, key, user });
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
        const matches = item.content && item.content.match(/\$\$\$\s*cms-pluginblock:audio([\s\S]*?)\$\$\$/);
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
      // markdown
      const md = markdown.create();
      // markdown-it-block
      const blocks = this.ctx.service.site.getBlocks({ locale: item.atomLanguage });
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
      // html
      let html;
      if (item.editMode === 1) {
        html = item.content ? md.render(item.content) : '';
      } else {
        html = item.content || '';
      }
      // summary
      const summary = trimHtml(html, this.ctx.config.article.trim);
      // update article
      await this.ctx.model.article.update({
        id: key.itemId,
        sticky: item.sticky,
        keywords: item.keywords,
        description: item.description,
        summary: summary.html,
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
          await this._renderArticle({ atomClass, key, inner: true });
        }
        if (atomStage === 1) {
          await this._renderArticle({ atomClass, key, inner: false });
        }
      }
    }

    async delete({ atomClass, key, user }) {
      // get atom for safety
      const atomOld = await this.ctx.bean.atom.read({ key, user });

      // delete article
      await this.ctx.model.article.delete({
        id: key.itemId,
      });
      // delete content
      await this.ctx.model.content.delete({
        itemId: key.itemId,
      });

      // delete article
      if (atomOld.atomStage === 0) {
        await this._deleteArticle({ atomClass, key, article: atomOld, inner: true });
      }
      if (atomOld.atomStage === 1) {
        await this._deleteArticle({ atomClass, key, article: atomOld, inner: false });
      }

      // super
      await super.delete({ atomClass, key, user });
    }

    async submit({ atomClass, key, options, user }) {
      // super
      return await super.submit({ atomClass, key, options, user });
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

    async _deleteArticle({ atomClass, key, article, inner }) {
      this.ctx.tail(async () => {
        // queue
        await this.ctx.app.meta.queue.pushAsync({
          locale: this.ctx.locale,
          subdomain: this.ctx.subdomain,
          module: moduleInfo.relativeName,
          queueName: 'render',
          queueNameSub: `${atomClass.module}:${atomClass.atomClassName}`,
          data: {
            queueAction: 'deleteArticle',
            atomClass, key, article, inner,
          },
        });
      });
    }

    async _renderArticle({ atomClass, key, inner }) {
      this.ctx.tail(async () => {
        // queue
        await this.ctx.app.meta.queue.pushAsync({
          locale: this.ctx.locale,
          subdomain: this.ctx.subdomain,
          module: moduleInfo.relativeName,
          queueName: 'render',
          queueNameSub: `${atomClass.module}:${atomClass.atomClassName}`,
          data: {
            queueAction: 'renderArticle',
            atomClass, key, inner,
          },
        });
      });
    }

    async _getArticle({ key, inner }) {
      if (!inner) {
        // check right
        const roleAnonymous = await this.ctx.bean.role.getSystemRole({ roleName: 'anonymous' });
        const right = await this.ctx.bean.atom.checkRoleRightRead({ atom: { id: key.atomId }, roleId: roleAnonymous.id });
        if (!right) return null;
      }
      // article
      const article = await this.ctx.bean.atom.read({ key, user: { id: 0 } });
      if (!article) return null;
      // check atomLanguage
      if (!article.atomLanguage) {
        return null;
        // this.ctx.throw(1001);
      }
      return article;
    }

  }

  return Atom;
};
