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
      return this.layoutManager.data.adapter.item_onClick(event, this.info.record);
    },
  },
  render() {
    const item = this.info.record;
    // domAfter
    const domAfterMetaFlags = [];
    // flow
    if (item.flowNodeNameCurrentLocale) {
      domAfterMetaFlags.push(
        <f7-badge key="flowNodeNameCurrent" color="orange">
          {item.flowNodeNameCurrentLocale}
        </f7-badge>
      );
    }
    // flags
    const itemFlags = this.layoutManager.data.adapter.item_getMetaFlags(item);
    for (const flag of itemFlags) {
      domAfterMetaFlags.push(<f7-badge key={flag}>{flag}</f7-badge>);
    }
    const domAfterLabels = [];
    if (item.labels && this.layoutManager.base_userLabels) {
      for (const label of JSON.parse(item.labels)) {
        const _label = this.layoutManager.data.adapter.item_getLabel(label);
        domAfterLabels.push(
          <f7-badge key={label} style={{ backgroundColor: _label.color }}>
            {_label.text}
          </f7-badge>
        );
      }
    }
    // domSummary
    const domSummary = <div class="atomName-summary">{this.layoutManager.data.adapter.item_getMetaSummary(item)}</div>;
    return (
      <div class="atom-list-layout-table-cell-atomName">
        <div class="atomName-inner">
          <div class="atomName-left">
            <eb-link propsOnPerform={event => this.onItemClick(event)}>{this.info.record.atomNameLocale || this.info.record.atomName}</eb-link>
          </div>
          <div class="atomName-right">
            <span class="stats">
              {item.star > 0 && <span>⭐</span>}
              {item.attachmentCount > 0 && <span>🧷</span>}
              {item.attachmentCount > 1 && <span>{`${item.attachmentCount}`}</span>}
              {item.commentCount > 0 && <span>💬</span>}
              {item.commentCount > 1 && <span>{`${item.commentCount}`}</span>}
            </span>
            {domAfterMetaFlags}
            {domAfterLabels}
          </div>
        </div>
        {domSummary}
      </div>
    );
  },
};
