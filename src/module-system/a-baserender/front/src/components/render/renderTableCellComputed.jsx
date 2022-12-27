import Vue from 'vue';
const ebRenderTableCellFormat = Vue.prototype.$meta.module.get('a-base').options.mixins.ebRenderTableCellFormat;

const __watchNames = ['info.record', 'info.index', 'info.indexTotal'];
export default {
  meta: {
    global: false,
  },
  mixins: [ebRenderTableCellFormat],
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
    expression: {
      type: String,
    },
  },
  data() {
    return {
      value: null,
    };
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
        options: column.component && column.component.options,
      }; // { text, record, index, indexTotal, column }
      this.$meta.util.sandbox
        .evaluate(this.expression, scope)
        .then(value => {
          this.value = this.formatText({ text: value, column });
        })
        .catch(err => {
          throw err;
        });
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
