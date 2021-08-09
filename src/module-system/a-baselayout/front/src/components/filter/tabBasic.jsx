export default {
  props: {
    layoutManager: {
      type: Object,
    },
    filterConfig: {
      type: Object,
    },
    filterContainer: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  created() {
    console.log(this.filterConfig);
  },
  methods: {
    _renderForm() {},
    _renderFormAtomClass() {},
  },
  render() {
    return (
      <div>
        {this._renderForm()}
        {this._renderFormAtomClass()}
      </div>
    );
  },
};
