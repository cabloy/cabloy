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
    blockConfig: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  methods: {
    onPageChange(page) {
      this.layoutManager.data.adapter.gotoPage(page);
    },
    _renderPagination() {
      const pageInfo = this.layoutManager.data.adapter.getPageInfo();
      if (!pageInfo) return null;
      return (
        <a-pagination
          value={pageInfo.pageCurrent}
          page-size={pageInfo.pageSize}
          total={pageInfo.total}
          disabled={false}
          onChange={this.onPageChange}
        />
      );
    },
    _renderTotal() {
      let domTotal;
      const pageInfo = this.layoutManager.data.adapter.getPageInfo();
      if (pageInfo && pageInfo.total > 0) {
        domTotal = <f7-badge>{pageInfo.total}</f7-badge>;
      }
      return <div>{domTotal}</div>;
    },
    _renderConfigProvider() {
      if (!this.antdv.locales) return null;
      return <a-config-provider locale={this.antdv_getLocale()}>{this._renderPagination()}</a-config-provider>;
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
