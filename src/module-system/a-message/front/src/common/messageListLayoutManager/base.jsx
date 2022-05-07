export default {
  data() {
    return {
      base: {
        configMessageBase: null,
        // configMessage: null, // todo: later
      },
    };
  },
  computed: {
    base_messageClass() {
      const messageClass = this.container.messageClass;
      return {
        module: messageClass.info.module,
        messageClassName: messageClass.info.name,
      };
    },
  },
  methods: {
    base_prepareSelectOptions() {
      // options
      let options = {
        where: {},
      };
      // layout
      options.layout = this.layout.current;
      // order
      options.orders = [['a.createdAt', 'desc']];
      // extend 1
      if (this.container.options) {
        options = this.$utils.extend({}, options, this.container.options);
      }
      // options
      return options;
    },
    base_prepareSelectParams() {
      // options
      const options = this.base_prepareSelectOptions();
      // params
      const params = {
        messageClass: this.base_messageClass,
        options,
      };
      return params;
    },
    base_getItems() {
      return this.layout.instance ? this.layout.instance.getItems() : [];
    },
  },
};
