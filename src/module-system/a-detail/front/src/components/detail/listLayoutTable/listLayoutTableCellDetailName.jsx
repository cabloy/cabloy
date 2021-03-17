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
    return {
    };
  },
  created() {
  },
  methods: {
    onItemClick(event) {
      return this.layoutItems.onItemClick(event, this.info.record);
    },
  },
  render() {
    const item = this.info.record;
    // domAfter
    const domAfterMetaFlags = [];
    for (const flag of this.layoutItems._getItemMetaFlags(item)) {
      domAfterMetaFlags.push(
        <f7-badge key={flag}>{flag}</f7-badge>
      );
    }
    // domSummary
    const domSummary = (
      <div class="atomName-summary">
        {this.layoutItems._getItemMetaSummary(item)}
      </div>
    );
    return (
      <div class="atom-list-layout-table-cell-atomName">
        <div class="atomName-inner">
          <div class="atomName-left">
            <eb-link propsOnPerform={event => this.onItemClick(event)}>
              { this.info.record.detailName}
            </eb-link>
          </div>
          <div class="atomName-right">
            {domAfterMetaFlags}
          </div>
        </div>
        {domSummary}
      </div>
    );
  },
};
