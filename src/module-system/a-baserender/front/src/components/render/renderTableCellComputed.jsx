import Vue from 'vue';
const ebRenderTableCellBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebRenderTableCellBase;

const __watchNames = ['info.record', 'info.index', 'info.indexTotal'];
export default {
  mixins: [ebRenderTableCellBase],
  data() {
    return {
      value: null,
    };
  },
  computed: {
    computed() {
      return this.base_getParam({ name: 'computed' });
    },
    expression() {
      return this.computed?.expression;
    },
  },
  created() {
    this.evaluate();
    this._unwatches = [];
    for (const name of __watchNames) {
      const unwatch = this.$watch(name, () => {
        this.evaluate();
      });
      this._unwatches.push(unwatch);
    }
  },
  beforeDestroy() {
    if (this._unwatches) {
      for (const unwatch of this._unwatches) {
        unwatch();
      }
      this._unwatches = null;
    }
  },
  methods: {
    evaluate() {
      // evaluate
      let { text, record, index, indexTotal, column } = this.info;
      // for tree table
      if (record.children) {
        record = Object.assign({}, record, { children: undefined });
      }
      const scope = {
        text,
        record,
        index,
        indexTotal,
        params: column.params,
      }; // { text, record, index, indexTotal, params }
      this.evaluate_inner({ scope });
    },
    async evaluate_inner({ scope }) {
      const useStoreSandbox = await this.$meta.store.use('a/sandbox/sandbox');
      const value = await useStoreSandbox.evaluate(this.expression, scope);
      this.value = this.base_formatText({ text: value });
    },
  },
  render() {
    return (
      <div class="eb-antdv-table-cell" title={this.value}>
        {this.value}
      </div>
    );
  },
};
