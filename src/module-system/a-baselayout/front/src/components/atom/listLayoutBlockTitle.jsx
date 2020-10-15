export default {
  meta: {
    global: false,
  },
  props: {
    layoutManager: {
      type: Object,
    },
    blockConfig: {
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
  },
  render() {
    return (
      <eb-navbar title={this.layoutManager.getPageTitle()} eb-back-link="Back"></eb-navbar>
    );
  },
};
