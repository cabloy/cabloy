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
      if (this.action.name === 'preview') {
        return await this.onAction_preview();
      }
    },
    async onAction_preview() {
      const { ctx } = this.$props;
      if (ctx.readOnly) {
        return await this._preview();
      }
      await ctx.onPerformSave();
      await this._preview();
    },
    _getAtomClass() {
      const { host } = this.item;
      return {
        module: host.atom.module,
        atomClassName: host.atom.atomClassName,
      };
    },
    async _preview() {
      const { ctx } = this.$props;
      const { host } = this.item;
      const atomClass = this._getAtomClass();
      const data = await ctx.$api.post('/a/cms/render/getArticleUrl', {
        atomClass,
        key: { atomId: host.atomId },
        options: {
          returnWaitingPath: true,
        },
      });
      if (!data) return;
      window.open(data.url, `cms_article_${atomClass.module}_${host.atomId}`);
    },
  },
};
