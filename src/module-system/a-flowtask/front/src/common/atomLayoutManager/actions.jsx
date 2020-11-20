import actionCancelFlow from '../../components/action/actionCancelFlow.jsx';
import actionHandleTask from '../../components/action/actionHandleTask.jsx';

export default {
  components: {
    actionCancelFlow,
    actionHandleTask,
  },
  data() {
    return {
    };
  },
  methods: {
    actions_onPerformTaskHandle() {
      this.$refs.actionHandleTask.open({
        flowLayoutManager: this.container_flowLayoutManager,
        flowTaskId: this.container_flowTaskId,
      });
    },
    actions_renderActionComponents() {
      const children = [];
      children.push(
        <actionCancelFlow key="actionCancelFlow" ref="actionCancelFlow"></actionCancelFlow>
      );
      children.push(
        <actionHandleTask key="actionHandleTask" ref="actionHandleTask"></actionHandleTask>
      );
      return children;
    },
    actions_renderHandle() {
      return (
        <eb-link iconMaterial='done' propsOnPerform={event => this.actions_onPerformTaskHandle(event)}></eb-link>
      );
    },
    actions_render() {
      if (!this.base_ready) return null;
      // view
      if (this.container.mode === 'view') {
        return this.container_flowLayoutManager._timeline_renderFlowTaskActionsChildren({
          task: this.container_task,
          enableView: false,
          ctxParent: this,
        });
      }
      // edit
      return this.actions_renderHandle();
    },
  },
};
