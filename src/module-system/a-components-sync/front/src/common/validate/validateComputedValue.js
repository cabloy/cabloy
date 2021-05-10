import ValidateComputedBase2Fn from './validateComputedBase2.js';
export default {
  data() {
    return {
    };
  },
  created() {
    // create
    this.__computed_value = ValidateComputedBase2Fn({
      ctx: this,
      onChange: ({ parcel, name, value }) => {
        this.setValue(parcel, name, value);
      },
    });
    // init
    this.__computed_value_init();
  },
  beforeDestroy() {
    this.__computed_value_dispose();
  },
  methods: {
    __computed_value_init() {
      this.__computed_value.initialize();
    },
    __computed_value_dispose() {
      if (this.__computed_value) {
        this.__computed_value.dispose();
        this.__computed_value = null;
      }
    },
  },
};
