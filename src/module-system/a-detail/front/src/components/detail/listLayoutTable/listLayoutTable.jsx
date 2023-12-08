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
      // provider
      await this.layoutManager.data_providerInit({
        providerName: 'all',
        autoInit: true,
      });
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
      return (
        <a-config-provider locale={this.antdv_getLocale()} renderEmpty={this._renderEmpty}>
          {this.layoutManager.layout_renderBlock({ blockName: 'items' })}
        </a-config-provider>
      );
    },
  },
  render() {
    return (
      <div class="eb-antdv">
        {this.layoutManager.layout_renderBlock({ blockName: 'title' })}
        {this._renderConfigProvider()}
      </div>
    );
  },
};
