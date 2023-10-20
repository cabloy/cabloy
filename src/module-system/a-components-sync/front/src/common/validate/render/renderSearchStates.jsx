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
  },
  '>': {},
  '>=': {},
  '<': {},
  '<=': {},
};
export default {
  methods: {
    __searchStates_render_list_item(context) {
      const { property } = context;
      if (!property.ebSearch) return null;
      return (
        <div
          slot="after-title"
          class={
            property.ebReadOnly ? 'after-title after-title-search text-color-gray' : 'after-title after-title-search'
          }
        >
          {this.__searchStates_render(context)}
        </div>
      );
    },
    __searchStates_render(context) {
      const { property, dataPath } = context;
      const ebSearch = property.ebSearch;
      // operators
      const operators = this.__searchStates_parseOperators(property, ebSearch.operators);
      if (!operators) return null; // render nothing
      // operatorCurrent
      const operatorCurrent = this.__searchStates_getOperatorCurrent(operators, dataPath);
      // render
      if (operators.length === 1) {
        return (
          <div class="single text-color-gray" title={operatorCurrent.title}>
            {operatorCurrent.text}
          </div>
        );
      }
      const props = {
        text: operatorCurrent.text,
        onPerform: event => {
          event.preventDefault();
          event.stopPropagation();
          return this.__searchStates_onPerform(event, context, operatorCurrent, operators);
        },
      };
      return <eb-button class="more" title={operatorCurrent.title} {...{ props }}></eb-button>;
    },
    async __searchStates_onPerform(event, context, operatorCurrent, operators) {
      const { dataPath } = context;
      // icon
      const iconDone = await this.$meta.util.combineIcon({ f7: '::done' });
      // buttons
      const buttons = [];
      for (const item of operators) {
        const icon = operatorCurrent.op === item.op ? iconDone : item.text;
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
        targetEl: event.currentTarget,
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
    __searchStates_parseOperators(property, operators) {
      // null or =
      if (!operators || operators === '=') return null; // render nothing
      if (!Array.isArray(operators)) {
        operators = operators.split(',');
      }
      return operators.map(op => {
        const item = __operators_all[op];
        const text = item.text || op;
        const title = item.title ? this.$text(item.title) : text;
        return { op, title, text };
      });
    },
  },
};
