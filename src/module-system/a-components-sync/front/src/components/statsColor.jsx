/**
 * @module a-components/front/components/eb-stats-color
 */
export default {
  /**
   * @event change
   * @type {object} The stats value
   */
  /**
   * @property {boolean} global - true
   */
  meta: {
    global: true,
  },
  /**
   * @default eb-stats-color
   */
  name: 'eb-stats-color',
  /**
   * @property {object} stats_params - The stats parameters
   */
  props: {
    stats_params: {
      type: Object,
    },
  },
  /**
   * @name data
   * @property {object} statsValue - The stats value
   */
  data() {
    return {
      statsValue: null,
    };
  },
  /**
   * @property {string} statsColor - the stats color
   */
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
    /**
     * @function onChange
     * @param {object} statsValue
     * @fires change
     */
    onChange(statsValue) {
      this.statsValue = statsValue;
      this.$emit('change', statsValue);
    },
    /**
     * @function onAdjustValue
     * @param {object} statsValue
     * @returns {number} The stats value which is adjusted
     */
    onAdjustValue(statsValue) {
      if (!statsValue) return null;
      return statsValue.red || statsValue.orange || statsValue.gray || null;
    },
  },
  render() {
    return (
      <eb-stats
        stats_params={this.stats_params}
        stats_color={this.statsColor}
        propsOnAdjustValue={this.onAdjustValue}
        onChange={this.onChange}
      ></eb-stats>
    );
  },
};
