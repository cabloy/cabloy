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
    return {
    };
  },
  created() {
  },
  methods: {
    onItemClick(event) {
      return this.layoutItems.onItemClick(event, this.info.record);
    },
  },
  render() {
    const index = this.info.index;
    return (
      <span>{index + 1}</span>
    );
  },
};
