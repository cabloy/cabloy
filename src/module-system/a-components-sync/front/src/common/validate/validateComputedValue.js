import ValidateComputedBaseFn from './validateComputedBase.js';
export default {
  data() {
    return {
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
        this.setValue(parcel, name, value);
      },
    });
    this.__computed_value = new _Class();
  },
  beforeDestroy() {
    this.__computed_value.dispose();
    this.__computed_value = null;
  },
  methods: {
  },
};
