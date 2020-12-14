export default {
  meta: {
    global: true,
  },
  name: 'eb-stats',
  props: {
    module: {
      type: String,
    },
    name: {
      type: String,
    },
    nameSub: {
      type: String,
    },
    color: {
      type: String,
      default: 'gray',
    },
    hiddenOnEmpty: {
      type: Boolean,
      default: true,
    },
    default: {
    },
  },
  data() {
    return {
      value: null,
    };
  },
  created() {
    this.loadValue();
  },
  methods: {
    async loadValue() {
      const value = await this.$api.post('/a/stats/stats/get', {
        module: this.module,
        name: this.name,
        nameSub: this.nameSub,
      });
      if (value === undefined) {
        this.value = this.default;
      } else {
        this.value = value;
      }
    },
  },
  render() {
    const hidden = !this.value && this.hiddenOnEmpty;
    return (
      <f7-badge color={this.color} class={hidden ? 'display-none' : ''}>{this.value}</f7-badge>
    );
  },
};
