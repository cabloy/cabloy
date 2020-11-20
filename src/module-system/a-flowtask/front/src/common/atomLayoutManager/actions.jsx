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
    actions_onSubmit() {
      this.$refs.buttonSave.onClick();
    },
    actions_onPerformValidate(event, cb) {
      return cb({
        formAtom: this.container_data.item,
      });
    },
    actions_onPerformTaskHandle() {
      this.$refs.actionHandleTask.open({
        flowLayoutManager: this.container_flowLayoutManager,
        flowTaskId: this.container.flowTaskId,
        action: this.container_action,
        callback: (event, cb) => {
          const validateInstance = this.validate_getInstance();
          if (!validateInstance) return;
          return validateInstance.perform(event, cb);
        },
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
        <eb-link ref="buttonSave" iconMaterial='done' propsOnPerform={event => this.actions_onPerformTaskHandle(event)}></eb-link>
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
