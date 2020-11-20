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
    async actions_onPerformValidate(event, data) {
      // prompt
      await this.$view.dialog.confirm(this.$text(data.status === 1 ? 'TaskPassPrompt' : 'TaskRejectPrompt'));
      // params
      const params = {
        flowTaskId: this.container.flowTaskId,
        handle: {
          status: data.status,
          remark: data.remark,
        },
      };
      if (data.status === 1) {
        params.formAtom = this.container_data.item;
      }
      // complete
      await this.$api.post('/a/flowtask/task/complete', params);
      // load flow
      await this.container_flowLayoutManager.base_loadData();
      // check
      this.$f7router.back();
    },
    actions_onPerformTaskHandle() {
      this.$refs.actionHandleTask.open({
        flowLayoutManager: this.container_flowLayoutManager,
        flowTaskId: this.container.flowTaskId,
        action: this.container_action,
        callback: (event, data) => {
          const validateInstance = this.validate_getInstance();
          if (!validateInstance) return;
          return validateInstance.perform(event, data);
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
