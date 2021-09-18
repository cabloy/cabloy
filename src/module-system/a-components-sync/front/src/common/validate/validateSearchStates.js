export default {
  methods: {
    __searchStates_render(c, context) {
      const { key, property, dataPath } = context;
      const ebSearch = property;
      // operators
      let operators = ebSearch.operators;
      // null or =
      if (!operators || operators === '=') return null; // render nothing
      operators = operators.split(',');
      return c('eb-link', {
        attrs: {
          text: '=',
        },
      });
    },
  },
};
