// export
export default {
  props: {
    context: {
      type: Object,
    },
  },
  data() {
    const { parcel } = this.context;
    const atomIdMain = parcel.data.atomId;
    return {
      atomIdMain,
    };
  },
  methods: {},
  render() {
    const options = {
      props: {
        context: this.context,
      },
    };
    return <eb-component module="a-detail" name="renderDetailsReal" options={options}></eb-component>;
  },
};
