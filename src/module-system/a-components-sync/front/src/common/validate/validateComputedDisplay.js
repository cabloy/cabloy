import ValidateComputedBase2Fn from './validateComputedBase2.js';
export default {
  data() {
    return {
      computed_display_values: {},
    };
  },
  created() {
    // create
    this.__computed_display = ValidateComputedBase2Fn({
      ctx: this,
      onChange: ({ parcel, name, value }) => {
        // dataPath
        const dataPath = parcel.pathParent + name;
        this.$set(this.computed_display_values, dataPath, !!value);
      },
    });
    // init
    this.__computed_display_init();
  },
  beforeDestroy() {
    this.__computed_display_dispose();
  },
  methods: {
    __computed_display_init() {
      this.__computed_display.initialize();
    },
    __computed_display_dispose() {
      if (this.__computed_display) {
        this.__computed_display.dispose();
        this.__computed_display = null;
      }
    },
    __computed_display_getValue(parcel, name) {
      // dataPath
      const dataPath = parcel.pathParent + name;
      return this.computed_display_values[dataPath];
    },
  },
};
