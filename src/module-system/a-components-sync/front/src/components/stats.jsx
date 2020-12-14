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
      this.value = await this.$api.post('/a/stats/stats/get', {
        module: this.module,
        name: this.name,
        nameSub: this.nameSub,
      });
    },
  },
  render() {
    return (
      <f7-badge color={this.color}>{this.value}</f7-badge>
    );
  },
};
