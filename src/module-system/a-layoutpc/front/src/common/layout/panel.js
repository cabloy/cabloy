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
      if (panel.title && !panel.titleLocale) _panelExtra.titleLocale = this.$text(panel.title);
      // stock
      const panelStock = this._findPanelStock(panel);
      // extend
      return this.$meta.util.extend({}, panelStock, panel, _panelExtra);
    },
    _createPanel({ side, panel, url, options, init }) {
      // imActive
      const imActive = options && options.imActive;
      const panelIndex = options && options.panelIndex;
      console.log(panelIndex);
      // side
      const sideUpperCase = side.replace(side[0], side[0].toUpperCase());
      const sidePanels = this.sidebar[side].panels;
      // prepare panel
      panel = this._preparePanel(panel, url);
      // check if has exists
      const panelCountOld = sidePanels.length;
      const _panelTabIndex = sidePanels.findIndex(item => this._panelFullName(item) === this._panelFullName(panel));
      if (_panelTabIndex === -1) {
        if (panelIndex !== undefined) {
          sidePanels.splice(panelIndex, 0, panel);
        } else {
          sidePanels.push(panel);
        }
      } else {
        // always update, maybe some properties have changed
        sidePanels.splice(_panelTabIndex, 1, panel);
      }
      const panelCountNew = sidePanels.length;
      if (panelCountOld === 0 && panelCountNew === 1) {
        this.onResize();
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
