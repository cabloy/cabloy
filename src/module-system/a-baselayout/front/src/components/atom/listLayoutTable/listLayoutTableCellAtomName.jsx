export default {
  meta: {
    global: false,
  },
  props: {
    layoutManager: {
      type: Object,
    },
    layout: {
      type: Object,
    },
    layoutItems: {
      type: Object,
    },
    info: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    onItemClick(event) {
      return this.layoutItems.onItemClick(event, this.info.record);
    },
  },
  render() {
    const item = this.info.record;
    // domAfter
    const domAfterMetaFlags = this.layoutManager.data.adapter.item_renderMetaFlags(item);
    const domAfterLabels = this.layoutManager.data.adapter.item_renderLabels(item);
    // domSummary
    const domSummary = <div class="atomName-summary">{this.layoutManager.data.adapter.item_getMetaSummary(item)}</div>;
    return (
      <div class="atom-list-layout-table-cell-atomName">
        <div class="atomName-inner">
          <div class="atomName-left">
            <eb-link propsOnPerform={event => this.onItemClick(event)}>{item.atomNameLocale || item.atomName}</eb-link>
          </div>
          <div class="atomName-right">
            <span class="stats">{this.layoutManager.data.adapter.item_renderStats(item)}</span>
            {domAfterMetaFlags}
            {domAfterLabels}
          </div>
        </div>
        {domSummary}
      </div>
    );
  },
};
