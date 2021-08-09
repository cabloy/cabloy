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
    reload(force) {},
  },
  render() {
    return <div>test</div>;
  },
};
