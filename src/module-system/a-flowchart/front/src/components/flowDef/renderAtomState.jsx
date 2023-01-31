export default {
  props: {
    context: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  computed: {},
  created() {},
  methods: {},
  render() {
    const { dataPath } = this.context;
    const title = this.context.getTitle();
    return <div></div>;
  },
};
