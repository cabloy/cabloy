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
    async actions_onPerformValidate(event, { /* action,*/ handle }) {
      // init for validateInstance.perform directly
      this.$refs.actionHandleTask.init({
        flowLayoutManager: this.container_flowLayoutManager,
        flowTaskId: this.container.flowTaskId,
        action: this.container_action,
      });
      // formAtom
      const formAtom = this.container_data.item;
      // submit
      return await this.$refs.actionHandleTask._submit({ handle, formAtom });
    },
    async actions_onPerformTaskHandleSave() {
      // save
      const validateInstance = this.validate_getInstance();
      if (!validateInstance) return;
      await validateInstance.perform(null, { action: 'save' });
      return this.$text('Saved');
    },
    actions_onPerformTaskHandleSubmit() {
      // open
      this.$refs.actionHandleTask.open({
        flowLayoutManager: this.container_flowLayoutManager,
        flowTaskId: this.container.flowTaskId,
        action: this.container_action,
        callback: async ({ handle }) => {
          const validateInstance = this.validate_getInstance();
          if (!validateInstance) return;
          return await validateInstance.perform(null, { action: 'submit', handle });
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
      const children = [];
      children.push(
        <eb-link key="save" ref="buttonSave" iconMaterial='save' propsOnPerform={event => this.actions_onPerformTaskHandleSave(event)}></eb-link>
      );
      children.push(
        <eb-link key="submit" ref="buttonSubmit" iconMaterial='done' propsOnPerform={event => this.actions_onPerformTaskHandleSubmit(event)}></eb-link>
      );
      return children;
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
