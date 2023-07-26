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
    mapper: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    onItemClick(event) {
      return this.layoutManager.item_onActionView(event, this.info.record);
    },
    _renderMedia() {
      // media/avatar
      let media = this.mapper?.media;
      if (media === undefined) {
        media = this.mapper?.avatar;
      }
      // default is false
      if (media === undefined) media = false;
      return this.layoutManager.item_renderMedia2(this.info, 'avatar avatar24 eb-vertical-align', media);
    },
    _getAtomName(item) {
      const atomNameFieldName = this.mapper?.atomName;
      return this.layoutManager.item_getAtomName(item, atomNameFieldName);
    },
  },
  render() {
    const item = this.info.record;
    // domAfter
    const domAfterMetaFlags = this.layoutManager.item_renderMetaFlags(item);
    const domAfterLabels = this.layoutManager.item_renderLabels(item);
    // domSummary
    const domSummary = <div class="atomName-summary">{this.layoutManager.item_getMetaSummary(item)}</div>;
    // domMedia
    const domMedia = this._renderMedia();
    // atomName
    const atomName = this._getAtomName(item);
    return (
      <div class="atom-list-layout-table-cell-atomName">
        <div class="atomName-inner">
          <div class="atomName-left" title={atomName}>
            <eb-link propsOnPerform={event => this.onItemClick(event)}>
              {domMedia}
              {atomName}
            </eb-link>
          </div>
          <div class="atomName-right">
            <span class="stats">{this.layoutManager.item_renderStats(item)}</span>
            {domAfterMetaFlags}
            {domAfterLabels}
          </div>
        </div>
        {domSummary}
      </div>
    );
  },
};
