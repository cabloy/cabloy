import Antdv from '../../common/antdv.jsx';

export default {
  meta: {
    global: false,
  },
  mixins: [ Antdv ],
  props: {
    layoutManager: {
      type: Object,
    },
    blockConfig: {
      type: Object,
    },
  },
  data() {
    return {
    };
  },
  computed: {
    layout() {
      return this.layoutManager.layout_componentInstance;
    },
  },
  created() {

  },
  methods: {
    onPageChange(page) {
      this.layout.gotoPage(page);
    },
    _renderPagination() {
      return (
        <a-pagination
          v-model={this.layout.info.pageCurrent}
          page-size={this.layout.info.pageSize}
          total={this.layout.info.total}
          disabled={false}
          onChange={this.onPageChange}
        />
      );
    },
    _renderTotal() {
      let domTotal;
      if (this.layout.info.total > 0) {
        domTotal = <f7-badge>{this.layout.info.total}</f7-badge>;
      }
      return (
        <div>
          {domTotal}
        </div>
      );
    },
    _renderConfigProvider() {
      if (!this.antdv.locales) return null;
      return (
        <a-config-provider locale={this.antdv_getLocale()}>
          { this._renderPagination()}
        </a-config-provider>
      );
    },
  },
  render() {
    return (
      <div class="eb-antdv atom-list-layout-table-pagination-container">
        {this._renderTotal()}
        {this._renderConfigProvider()}
      </div>
    );
  },
};
