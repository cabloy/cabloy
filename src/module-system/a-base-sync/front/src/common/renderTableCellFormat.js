export default {
  methods: {
    formatText({ text, column }) {
      // params
      const params = column.params || {};
      // null
      if (text === null || text === undefined) {
        text = params.default || '';
      }
      if (text === '') return text;
      // date
      if (typeof text === 'object' && text instanceof Date) {
        return this.$meta.util.formatDateTime(text, params.dateFormat);
      }
      // currency
      if (params.currency) {
        const currency = this.$meta.util.currency(params.currency);
        return currency.format(text);
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
