export default {
  meta: {
    global: true,
  },
  name: 'eb-stats-color',
  props: {
    stats_params: {
      type: Object,
    },
  },
  data() {
    return {
      statsValue: null,
    };
  },
  computed: {
    statsColor() {
      if (!this.statsValue) return null;
      if (this.statsValue.red) return 'red';
      if (this.statsValue.orange) return 'orange';
      if (this.statsValue.gray) return 'gray';
      return null;
    },
  },
  methods: {
    onChange(statsValue) {
      this.statsValue = statsValue;
      this.$emit('change', statsValue);
    },
    onAdjustValue(statsValue) {
      if (!statsValue) return null;
      return statsValue.red || statsValue.orange || statsValue.gray || null;
    },
  },
  render() {
    return <eb-stats stats_params={this.stats_params} stats_color={this.statsColor} propsOnAdjustValue={this.onAdjustValue} onChange={this.onChange}></eb-stats>;
  },
};
