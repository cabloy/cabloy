import Antdv from '../../../common/antdv.jsx';

export default {
  meta: {
    global: false,
  },
  mixins: [Antdv],
  props: {
    layoutManager: {
      type: Object,
    },
    layoutConfig: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  created() {
    this.init();
  },
  beforeDestroy() {
    this.layoutManager.layout_clearInstance(this);
  },
  methods: {
    async init() {
      // subnavbar
      if (this.layoutConfig.options?.subnavbar?.policyDefault) {
        this.layoutManager.subnavbar_policyDefault();
      }
      // eslint-disable-next-line
      this.layoutManager.bottombar.enable = !!this.layoutConfig.blocks.bottombar;
      // provider switch
      const providerOptions = this.layoutConfig.providerOptions || {
        providerName: 'paged',
      };
      await this.layoutManager.data_providerSwitch(providerOptions);
      // instance
      await this.layoutManager.layout_setInstance(this);
    },
    _renderEmpty() {
      const loading = this.layoutManager.data_getLoading();
      if (loading) return <f7-preloader></f7-preloader>;
      return <div>{this.$text('No Data')}</div>;
    },
    _renderConfigProvider() {
      if (!this.antdv.locales) return null;
      const blockName = this.layoutConfig.options?.blockItems || 'items';
      return (
        <a-config-provider locale={this.antdv_getLocale()} renderEmpty={this._renderEmpty}>
          {this.layoutManager.layout_renderBlock({ blockName })}
        </a-config-provider>
      );
    },
  },
  render() {
    return <div class="eb-antdv">{this._renderConfigProvider()}</div>;
  },
};
