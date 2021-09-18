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
      const { property, dataPath } = context;
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
          onPerform: event => {
            this.__searchStates_onPerform(event, context, operatorCurrent, operators);
          },
        },
      });
    },
    async __searchStates_onPerform(event, context, operatorCurrent, operators) {
      const { dataPath } = context;
      // buttons
      const buttons = [];
      for (const item of operators) {
        const icon = operatorCurrent.op === item.op ? '<i class="icon material-icons">done</i>' : item.text;
        buttons.push({
          icon,
          text: item.title,
          disabled: operatorCurrent.op === item.op,
          data: item,
        });
      }
      // choose
      const params = {
        forceToPopover: true,
        targetEl: event.target,
        buttons,
      };
      const button = await this.$view.actions.choose(params);
      // change search states
      this.__searchStates_setSearchState(dataPath, button.data);
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
    __searchStates_setSearchState(dataPath, operator) {
      let searchStates = this.validate.vSearchStates;
      if (!searchStates) searchStates = {};
      this.$set(searchStates, dataPath, {
        op: operator.op,
      });
      this.validate.vSearchStates = searchStates;
      this.validate.$emit('searchStatesChange', searchStates);
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
