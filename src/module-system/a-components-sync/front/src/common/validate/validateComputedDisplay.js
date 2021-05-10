import ValidateComputedBaseFn from './validateComputedBase.js';
export default {
  data() {
    return {
      computed_display_values: {},
    };
  },
  created() {
    const _Class = ValidateComputedBaseFn({
      ctx: this,
      dataRootName: 'parcel.data',
      dataRoot: this.parcel.data,
      onDataMeta: () => {
        return {
          host: this.validate.host,
          user: this.$store.state.auth.user.op,
        };
      },
      onChange: ({ parcel, name, value }) => {
        // dataPath
        const dataPath = parcel.pathParent + name;
        this.$set(this.computed_display_values, dataPath, !!value);
      },
    });
    this.__computed_display = new _Class();
  },
  beforeDestroy() {
    this.__computed_display.dispose();
    this.__computed_display = null;
  },
  methods: {
    __computed_display_getValue(parcel, name) {
      // dataPath
      const dataPath = parcel.pathParent + name;
      return this.computed_display_values[dataPath];
    },
  },
};
