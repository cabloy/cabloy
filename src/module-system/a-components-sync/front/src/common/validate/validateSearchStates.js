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
      // operatorCurrent
      const operatorCurrent = this.__searchStates_getOperatorCurrent(operators, dataPath);
      // render
      if (operators.length === 1) {
        return c('div', {
          staticClass: 'single text-color-gray',
          domProps: {
            title: operatorCurrent.title,
            innerText: operatorCurrent.text,
          },
        });
      }
      return c('eb-button', {
        staticClass: 'more',
        attrs: {
          title: operatorCurrent.title,
          text: operatorCurrent.text,
        },
      });
    },
    __searchStates_getOperatorCurrent(operators, dataPath) {
      const searchState = this.__searchStates_getSearchState(dataPath);
      let operatorCurrent = searchState && operators.find(item => item.op === searchState.op);
      if (!operatorCurrent) {
        operatorCurrent = operators[0];
      }
      return operatorCurrent;
    },
    __searchStates_getSearchState(dataPath) {
      const searchStates = this.validate.vSearchStates;
      if (!searchStates) return null;
      return searchStates[dataPath];
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
