import Vue from 'vue';
const ebActionBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebActionBase;

export default {
  meta: {
    global: false,
  },
  mixins: [
    ebActionBase, //
  ],
  methods: {
    async onAction() {
      const action = this.action;
      const actionName = action.actionName || action.name;
      if (actionName === 'cms-content-preview') {
        return await this.onAction_preview_cms_content();
      } else if (actionName === 'preview') {
        return await this.onAction_preview();
      }
    },
    async onAction_preview_cms_content() {
      const { ctx } = this.$props;
      const { host } = ctx;
      // info
      const atomClass = {
        module: host.atom.module,
        atomClassName: host.atom.atomClassName,
      };
      const atomId = host.atomId;
      // readOnly
      if (ctx.readOnly) {
        return await this._preview({ atomClass, atomId });
      }
      // save first
      await ctx.onPerformSave();
      await this._preview({ atomClass, atomId });
    },
    async onAction_preview() {
      const { ctx, item } = this.$props;
      // info
      const atomClass = {
        module: item.module,
        atomClassName: item.atomClassName,
      };
      const atomId = item.atomId;
      // readOnly
      if (!ctx.page_getDirty || !ctx.page_getDirty()) {
        return await this._preview({ atomClass, atomId });
      }
      // save first
      await ctx.validate_onPerformValidateWrapper(null, { action: 'save' });
      await this._preview({ atomClass, atomId });
    },
    async _preview({ atomClass, atomId }) {
      const { ctx } = this.$props;
      const data = await ctx.$api.post('/a/cms/render/getArticleUrl', {
        atomClass,
        key: { atomId },
        options: {
          returnWaitingPath: true,
        },
      });
      if (!data) return;
      // open
      const link = data.url;
      const target = `cms_article_${atomClass.module}_${atomId}`;
      if (this.$device.desktop) {
        window.open(link, target);
      } else {
        const queries = { data: JSON.stringify({ title: this.$text('Preview'), link, target }) };
        const url = ctx.$meta.util.combineQueries('/a/basefront/base/openLink', queries);
        ctx.$view.navigate(url);
      }
    },
  },
};
