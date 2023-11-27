export default {
  methods: {
    onAction_atomName() {
      const { ctx, item } = this.$props;
      const { value, operator, data } = item;
      if (!value) return null;
      const op = operator.op;
      const clauseValue = { op, val: value };
      const clause = {
        __or__atomNameResource: [{ 'a.atomName': clauseValue }],
      };
      const atomClass = data.atomClass ? ctx.getAtomClass(data.atomClass) : null;
      if (atomClass?.resource && !['draft', 'history'].includes(data.stage)) {
        clause.__or__atomNameResource.push({ 'm.atomNameLocale': clauseValue });
      }
      return clause;
    },
  },
};
