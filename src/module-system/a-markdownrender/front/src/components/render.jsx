export default {
  meta: {
    global: true,
  },
  name: 'eb-markdown-render',
  props: {
    html: {
      type: String,
    },
    host: {
      type: Object,
    },
  },
  data() {
    return {
      htmlInner: this.html,
      BlockClasses: {},
      blockInstances: [],
    };
  },
  watch: {
    html(newValue) {
      if (newValue === this.htmlInner) return;
      this.htmlInner = newValue;
      this.$nextTick(() => {
        this._setHtml(newValue);
      });
    },
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this._unmountHtml();
  },
  methods: {
    async init() {
      await this.$meta.module.use(this.$meta.config.markdown.style.module);
      await this._setHtml(this.htmlInner);
    },
    async _setHtml(html) {
      await this._unmountHtml();
      this.$refs.html.innerHTML = html;
      this._mountHtml();
    },
    async _mountHtml() {
      const blocks = this.$$('.markdown-it-cabloy-block', this.$refs.html);
      for (let i = 0; i < blocks.length; i++) {
        await this._mountBlock(blocks[i]);
      }
    },
    async _unmountHtml() {
      if (this.blockInstances.length === 0) return;
      for (const blockInstance of this.blockInstances) {
        if (blockInstance.unmount) {
          await blockInstance.unmount();
        }
      }
      this.blockInstances = [];
    },
    async _mountBlock(blockContainer) {
      const blockParams = this._getBlockParams(blockContainer);
      const blockContent = this._getBlockContent(blockContainer);
      if (!blockParams || !blockContent) return;
      // use module
      await this.$meta.module.use(blockParams.module);
      // Block Class
      const BlockClass = await this._getBlockClass(blockParams);
      if (!BlockClass) {
        // do nothing
        return;
      }
      // host
      const host = this._getHost(blockContainer, blockContent);
      // Block Instance
      const blockInstance = new BlockClass(host);
      // mount
      if (blockInstance.mount) {
        await blockInstance.mount();
      }
      // record
      this.blockInstances.push(blockInstance);
    },
    _getBlockParams(block) {
      const params = block.getAttribute('data-block-params');
      if (!params) return null;
      const [module, blockName] = params.split(':');
      if (!module || !blockName) return null;
      return { params, module, blockName };
    },
    _getBlockContent(block) {
      const content = block.getAttribute('data-block-content');
      if (!content) return null;
      return window.JSON5.parse(decodeURIComponent(content));
    },
    async _getBlockClass(blockParams) {
      const { params, module, blockName } = blockParams;
      const BlockClass = this.BlockClasses[params];
      if (BlockClass) return Promise.resolve(BlockClass);
      return new Promise(resolve => {
        const block_js = `api/static/${module.replace('-', '/')}/blocks/${blockName}/main`;
        this.$meta.util.requirejs.require([block_js], BlockClass => {
          this.BlockClasses[params] = BlockClass;
          resolve(BlockClass);
        });
      });
    },
    _getHost(blockContainer, blockContent) {
      const $util = this.$meta.util.hostUtil({
        locale: this.$meta.util.getProperty(this.host, 'atom.atomLanguage'),
      });
      return {
        $host: this.host, // atomId/atom
        $container: blockContainer,
        $content: blockContent,
        $util,
      };
    },
  },
  render() {
    return <div ref="html" class="markdown-body"></div>;
  },
};
