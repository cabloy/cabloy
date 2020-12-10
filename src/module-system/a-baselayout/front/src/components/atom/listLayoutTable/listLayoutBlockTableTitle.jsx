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
      <f7-nav-right>
        {this.layoutManager.bulk_renderActionsRight()}
        {this.layoutManager.bulk_renderActionsLeftB()}
        {this.layoutManager.order_renderAction()}
        {this.layoutManager.filter_renderAction()}
      </f7-nav-right>
    );
  },
};
