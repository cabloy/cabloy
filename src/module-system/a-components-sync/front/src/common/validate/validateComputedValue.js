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
