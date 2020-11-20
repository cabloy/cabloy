import actionCancelFlow from '../../components/actionCancelFlow.jsx';
export default {
  components: {
    actionCancelFlow,
  },
  data() {
    return {
    };
  },
  methods: {
    actions_renderActionComponents() {
      return (
        <actionCancelFlow ref="actionCancelFlow"></actionCancelFlow>
      );
    },
    actions_render() {
      if (!this.base_ready) return null;
      const children = this.container_flowLayoutManager._timeline_renderFlowTaskActionsChildren({
        task: this.container_task,
        enableView: false,
        ctxParent: this,
      });
      return children;
    },
  },
};
