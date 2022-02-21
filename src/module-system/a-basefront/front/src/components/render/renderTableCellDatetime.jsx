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
    dateFormat: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  methods: {
    _renderDateDefault() {
      const { text } = this.info;
      const { pattern } = this.dateFormat;
      let value;
      if (typeof text === 'object' && text instanceof Date) {
        value = this.$meta.util.formatDateTime(text, pattern);
      } else {
        value = text;
      }
      return { title: value, value };
    },
    _renderDateLines() {},
  },
  render() {
    let res;
    if (this.dateFormat.pattern) {
      res = this._renderDateDefault();
    } else {
      res = this._renderDateLines();
    }
    const { title, value } = res;
    return (
      <div class="eb-antdv-table-cell" title={title}>
        {value}
      </div>
    );
  },
};
