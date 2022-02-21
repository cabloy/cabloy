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
      let _default = this.dateFormat.default;
      if (_default === true) _default = null;
      let value;
      if (typeof text === 'object' && text instanceof Date) {
        value = this.$meta.util.formatDateTime(text, _default);
      } else {
        value = text;
      }
      return { title: value, value };
    },
    _renderDateLines() {
      const { text } = this.info;
      const children = [];
      const valueDate = this.$meta.util.formatDate(text, this.dateFormat.dateSeparator);
      const valueTime = this.$meta.util.formatTime(text, this.dateFormat.timeSeparator);
      children.push(<div key="date:one">{valueDate}</div>);
      children.push(<div key="date:two">{valueTime}</div>);
      const value = <div class="date-lines">{children}</div>;
      const title = `${valueDate} ${valueTime}`;
      return { title, value };
    },
  },
  render() {
    let res;
    if (this.dateFormat.lines) {
      res = this._renderDateLines();
    } else {
      res = this._renderDateDefault();
    }
    const { title, value } = res;
    return (
      <div class="eb-antdv-table-cell" title={title}>
        {value}
      </div>
    );
  },
};
