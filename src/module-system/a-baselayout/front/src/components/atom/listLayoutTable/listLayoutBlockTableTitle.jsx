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
        {this.layoutManager.bulk_rendActionsLeftB()}
        {this.layoutManager.bulk_rendActionsRight()}
        {this.layoutManager.create_renderActions()}
        {this.layoutManager.filter_renderAction()}
      </f7-nav-right>
    );
  },
};
