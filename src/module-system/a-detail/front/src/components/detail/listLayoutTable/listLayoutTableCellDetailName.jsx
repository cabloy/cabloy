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
      return this.layoutManager.item_onItemClick(event, this.info.record);
    },
  },
  render() {
    const item = this.info.record;
    // domAfter
    const domAfterMetaFlags = this.layoutManager.item_renderMetaFlags(item);
    // domSummary
    const domSummary = <div class="atomName-summary">{this.layoutManager.item_getMetaSummary(item)}</div>;
    return (
      <div class="atom-list-layout-table-cell-atomName">
        <div class="atomName-inner">
          <div class="atomName-left">
            <eb-link propsOnPerform={event => this.onItemClick(event)}>
              {this.layoutManager.item_getDetailName(item)}
            </eb-link>
          </div>
          <div class="atomName-right">{domAfterMetaFlags}</div>
        </div>
        {domSummary}
      </div>
    );
  },
};
