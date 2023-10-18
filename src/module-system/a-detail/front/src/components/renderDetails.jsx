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
    const { parcel } = this.context;
    const atomIdMain = parcel.data.atomId;
    const options = {
      props: {
        context: this.context,
      },
    };
    if (atomIdMain === 0) {
      // only title
      return <eb-component module="a-detail" name="renderDetailsTitle" options={options}></eb-component>;
    }
    return <eb-component module="a-detail" name="renderDetailsReal" options={options}></eb-component>;
  },
};
