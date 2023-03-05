export default {
  meta: {
    global: false,
  },
  props: {
    layoutManager: {
      type: Object,
    },
    layout: {
      type: Object,
    },
    layoutItems: {
      type: Object,
    },
    info: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  created() {},
  methods: {},
  render() {
    const { text } = this.info;
    return <div class="eb-antdv-table-cell">{text}</div>;
  },
};
