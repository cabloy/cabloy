export default {
  meta: {
    global: false,
  },
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
  },
  methods: {
    evaluate() {
      // evaluate
      const { text, record, index, column } = this.info;
      const scope = { text, record, index, options: column.component.options }; // { text, record, index, column }
      this.$meta.util.sandbox.evaluate(this.expression, scope).then(value => {
        this.value = value;
      }).catch(err => {
        throw err;
      });
    },
  },
  render() {
    return (
      <span>{this.value}</span>
    );
  },
};
