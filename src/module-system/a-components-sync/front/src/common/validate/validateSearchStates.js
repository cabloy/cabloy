const __operators_all = {
  like: {
    title: 'SearchInclude',
    text: '{}',
  },
  likeLeft: {
    title: 'SearchLeftMatch',
    text: '}',
  },
  likeRight: {
    title: 'SearchRightMatch',
    text: '{',
  },
  '=': {
    title: 'SearchEqual',
    text: '=',
  },
};
export default {
  methods: {
    __searchStates_render(c, context) {
      const { key, property, dataPath } = context;
      const ebSearch = property.ebSearch;
      // operators
      const operators = this.__searchStates_parseOperators(ebSearch.operators);
      if (!operators) return null; // render nothing
      const operatorFirst = operators[0];
      // render
      if (operators.length === 1) {
        return c('div', {
          staticClass: 'single text-color-gray',
          domProps: {
            title: operatorFirst.title,
            innerText: operatorFirst.text,
          },
        });
      }
      return c('eb-link', {
        staticClass: operators.length === 1 ? 'single text-color-gray' : 'more',
        attrs: {
          title: operatorFirst.title,
          text: operatorFirst.text,
        },
      });
    },
    __searchStates_parseOperators(operators) {
      // null or =
      if (!operators || operators === '=') return null; // render nothing
      if (!Array.isArray(operators)) {
        operators = operators.split(',');
      }
      return operators.map(op => {
        const item = __operators_all[op];
        return {
          op,
          title: this.$text(item.title),
          text: item.text,
        };
      });
    },
  },
};
