export default {
  methods: {
    formatText() {
      //
      let text = this.info.text;
      const column = this.info.column;
      const params = column.params || {};
      // null
      if (text === null || text === undefined) {
        return params.default || '';
      }
      // data
      if (typeof text === 'object' && text instanceof Date) {
        return this.$meta.util.formatDateTime(text, params.dateFormat);
      }
      // currency
      if (params.currency) {
        return isNaN(text) ? text : (Number(text) / 100).toFixed(2);
      }
      // text
      if (params.locale) {
        text = this.$text(text);
      }
      // ok
      return text;
    },
  },
};
