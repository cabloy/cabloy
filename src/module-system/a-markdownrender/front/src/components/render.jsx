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
  computed: {
    host2() {
      const host = Object.assign({}, this.host);
      if (host.mode === undefined) {
        host.mode = 'view';
      }
      return host;
    },
  },
  watch: {
    html(newValue) {
      if (newValue === this.htmlInner) return;
      this.htmlInner = newValue;
      this.$nextTick(() => {
        this.__changeHtml();
      });
    },
  },
  created() {
    this.__changeHtml = this.$meta.util.debounce(() => {
      this._setHtml(this.htmlInner);
    }, 100);
  },
  mounted() {
    this._$html = this.$refs.html;
    this._handlerOnClick = this._onClick.bind(this);
    this._$html.addEventListener('click', this._handlerOnClick);
    this.init();
  },
  beforeDestroy() {
    //
    if (this._unwatch) {
      this._unwatch();
      this._unwatch = null;
    }
    //
    this._unmountHtml();
    //
    if (this._$html) {
      this._$html.removeEventListener('click', this._handlerOnClick);
      this._handlerOnClick = null;
      this._$html = null;
    }
  },
  methods: {
    async init() {
      await this.$meta.module.use(this.$meta.config.markdown.style.module);
      await this._setHtml(this.htmlInner);
      // watch atom changed
      if (this.host && this.host.atom) {
        this._unwatch = this.$watch('host.atom', () => {
          this.__changeHtml();
        });
      }
    },
    _onClick(event) {
      const $clickedEl = this.$$(event.target);
      const $clickedLinkEl = $clickedEl.closest('a');
      const isLink = $clickedLinkEl.length > 0;
      const url = isLink && $clickedLinkEl.attr('href');
      if (isLink) {
        event.preventDefault();
        if (url) {
          window.open(url, '_blank');
        }
      }
    },
    async _setHtml(html) {
      await this._unmountHtml();
      this._$html.innerHTML = html;
      await this._mountHtml();
    },
    async _mountHtml() {
      const blocks = this.$$('.markdown-it-cabloy-block', this._$html);
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
        let block_js = `api/static/${module.replace('-', '/')}/blocks/${blockName}/main`;
        if (this.$meta.config.env !== 'development') {
          block_js += '.min';
        }
        this.$meta.util.requirejs.require([block_js], BlockClass => {
          this.BlockClasses[params] = BlockClass;
          resolve(BlockClass);
        });
      });
    },
    _getHost(blockContainer, blockContent) {
      const $util = this.$meta.util.hostUtil({
        ctx: this,
        locale: this.$meta.util.getProperty(this.host2, 'atom.atomLanguage'),
      });
      return {
        $host: this.host2, // atomId/atom
        $container: blockContainer,
        $content: blockContent,
        $util,
        $user: this.$store.state.auth.user,
        $$: this.$$,
      };
    },
  },
  render() {
    return <div ref="html" class="markdown-body"></div>;
  },
};
