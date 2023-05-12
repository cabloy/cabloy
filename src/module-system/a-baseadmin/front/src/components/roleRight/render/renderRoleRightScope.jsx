export default {
  props: {
    context: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  computed: {
    action() {
      return this.context.getValue('action');
    },
    value() {
      return this.context.getValue();
    },
    atomClassBase() {
      return this.context.getValue('__atomClassBase');
    },
    actionBaseCurrent() {
      return this.context.getValue('__actionBaseCurrent');
    },
  },
  watch: {
    action: {
      handler(newValue) {
        this.__actionChanged(newValue);
      },
      immediate: false, // true,
    },
  },
  methods: {
    __actionChanged() {
      this.context.setValue(null);
      // await this.__loadActionSelectOptions();
    },
  },
  render() {
    return <div>scope</div>;
  },
};
