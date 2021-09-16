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
      if (this.action.name === 'cms-content-preview') {
        return await this.onAction_preview_cms_content();
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
        return await this._preview();
      }
      // save first
      await ctx.onPerformSave();
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
      window.open(data.url, `cms_article_${atomClass.module}_${atomId}`);
    },
  },
};
