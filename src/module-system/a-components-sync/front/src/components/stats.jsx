import stats from '../common/stats.js';
export default {
  meta: {
    global: true,
  },
  name: 'eb-stats',
  mixins: [ stats ],
  props: {
    hidden: {
      type: Boolean,
      default: false,
    },
    hiddenOnEmpty: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      value: null,
    };
  },
  methods: {
    stats_onChange(value) {
      this.value = value;
      this.$emit('change', value);
    },
  },
  render() {
    const hidden = this.hidden || (!this.value && this.hiddenOnEmpty);
    return (
      <f7-badge color={this.stats_color} class={hidden ? 'display-none' : ''}>{this.value}</f7-badge>
    );
  },
};
