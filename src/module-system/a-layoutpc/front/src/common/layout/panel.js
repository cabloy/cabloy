export default {
  methods: {
    closePanel(side, panel) {
      const sideUpperCase = side.replace(side[0], side[0].toUpperCase());
      this.$refs[`sidebar${sideUpperCase}`].closePanel(panel);
    },
    _panelFullName(panel) {
      return this._resourceFullName(panel);
    },
    _findPanelStock(panel) {
      return this._findResourceStock(this.panelsAll, panel);
    },
    _preparePanel(panel, url) {
      // extra
      const _panelExtra = { resourceConfig: {} };
      if (url) _panelExtra.resourceConfig.url = url;
      if (panel.title) _panelExtra.titleLocale = this.$text(panel.title);
      // stock
      const panelStock = this._findPanelStock(panel);
      // extend
      return this.$meta.util.extend({}, panelStock, panel, _panelExtra);
    },
    _createPanel({ side, panel, url, options, init }) {
      // imActive
      const imActive = options.imActive;
      // side
      const sideUpperCase = side.replace(side[0], side[0].toUpperCase());
      // prepare panel
      panel = this._preparePanel(panel, url);
      // check if has exists
      const _panelTabIndex = this.sidebar[side].panels.findIndex(
        item => this._panelFullName(item) === this._panelFullName(panel)
      );
      if (_panelTabIndex === -1) {
        this.sidebar[side].panels.push(panel);
        if (this.sidebar[side].panels.length === 1) {
          this.onResize();
        }
      } else {
        // always update, maybe some properties have changed
        this.sidebar[side].panels.splice(_panelTabIndex, 1, panel);
      }
      // create view
      if (!imActive) {
        this.$nextTick(() => {
          this.$refs[`sidebar${sideUpperCase}`].createView({ ctx: null, panel, options, init });
        });
      }
    },
  },
};
