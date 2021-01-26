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
    onAdjustValue: {
      type: Function,
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
    __adjustValue() {
      if (!this.onAdjustValue) return this.value;
      return this.onAdjustValue(this.value);
    },
  },
  render() {
    const value = this.__adjustValue();
    const hidden = this.hidden || (!value && this.hiddenOnEmpty);
    return (
      <f7-badge color={this.stats_color} class={hidden ? 'display-none' : ''}>{value}</f7-badge>
    );
  },
};
