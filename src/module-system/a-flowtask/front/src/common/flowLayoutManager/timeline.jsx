const __flowTaskStatuses = {
  1: {
    color: 'teal',
    text: 'Passed',
  },
  2: {
    color: 'orange',
    text: 'Rejected',
  },
  3: {
    color: 'gray',
    text: 'Cancelled',
  },
};
export default {
  data() {
    return {
      timeline: {
      },
    };
  },
  methods: {
    _timeline_prepareActions({ task, enableView }) {
      // actions
      let actions = [];
      // concat
      actions = task._actions ? actions.concat(task._actions) : actions;
      // action view
      if (enableView) {
        actions.push({
          name: 'viewAtom',
        });
      }
      return actions;
    },
    async timeline_onPerformTaskAction(event, actionBase, task, ctxParent) {
      return await this.$meta.util.performAction({
        ctx: ctxParent || this,
        action: actionBase,
        item: {
          flowLayoutManager: this,
          task,
        },
      });
    },
    _timeline_getActionBase(action) {
      const actions = this.$meta.config.modules['a-flowtask'].flowTask.actions;
      const actionBase = actions[action.name];
      return this.$meta.util.extend({}, actionBase, action);
    },
    _timeline_renderFlowNode({ task, flowNodeGroupIndex }) {
      // date
      const domDate = (
        <f7-badge color="teal">{flowNodeGroupIndex}</f7-badge>
      );
      // title
      let domRemark;
      if (task.flowNodeRemarkLocale) {
        domRemark = (
          <f7-badge class="flowRemark" color="gray">{task.flowNodeRemarkLocale}</f7-badge>
        );
      }
      const domTitle = (
        <div class="timeline-item-title">
          <span>{task.flowNodeNameLocale}</span>
          {domRemark}
        </div>
      );
      return (
        <div key={`flowNode:${task.flowNodeId}`} class="timeline-item">
          <div class="timeline-item-date">{domDate}</div>
          <div class="timeline-item-divider"></div>
          <div class="timeline-item-content flowNode">
            {domTitle}
          </div>
        </div>
      );
    },
    _timeline_renderFlowTaskStatus({ task }) {
      if (task.handleStatus === 0) return;
      const status = __flowTaskStatuses[task.handleStatus];
      return (
        <f7-badge class="flowRemark" color={status.color}>{this.$text(status.text)}</f7-badge>
      );
    },
    // also be invoked by atomLayoutManager
    _timeline_renderFlowTaskActionsChildren({ task, enableView, ctxParent }) {
      if (task.userIdAssignee !== this.base_user.id || this.base_flowOld) return;
      const children = [];
      const actions = this._timeline_prepareActions({ task, enableView });
      for (const action of actions) {
        const actionBase = this._timeline_getActionBase(action);
        children.push(
          <eb-link key={actionBase.name} iconMaterial={actionBase.icon.material} propsOnPerform={event => this.timeline_onPerformTaskAction(event, actionBase, task, ctxParent)}></eb-link>
        );
      }
      return children;
    },
    _timeline_renderFlowTaskActions({ task }) {
      if (task.userIdAssignee !== this.base_user.id || this.base_flowOld) return;
      const children = this._timeline_renderFlowTaskActionsChildren({ task, enableView: true });
      return (
        <div class="task-actions">
          {children}
        </div>
      );
    },
    _timeline_getHandleRemark({ task }) {
      if (task.handleRemarkLocale) return task.handleRemarkLocale;
      if (task.flowTaskStatus === 0 && task.specificFlag === 1) {
        // assigneesConfirmation
        return this.$text('AssigneesConfirmationPrompt');
      }
    },
    _timeline_renderFlowTask({ task }) {
      // taskCurrentClass
      const taskCurrentClass = task.id === this.container.flowTaskId ? 'text-color-orange' : '';
      // date
      let domDate;
      if (task.handleStatus === 0) {
        if (task.userIdAssignee === this.base_user.id) {
          domDate = (
            <f7-icon class={taskCurrentClass} material="play_arrow"></f7-icon>
          );
        }
      } else {
        domDate = (
          <small class={taskCurrentClass}>{this.$meta.util.formatDateTime(task.timeHandled, 'MM-DD')}</small>
        );
      }
      // info
      let domTime;
      if (task.handleStatus > 0) {
        domTime = (
          <span>{this.$meta.util.formatDateTime(task.timeHandled, 'HH:mm')}</span>
        );
      }
      const domStatus = this._timeline_renderFlowTaskStatus({ task });
      const domActions = this._timeline_renderFlowTaskActions({ task });
      const domInfo = (
        <div class="timeline-item-time flowTaskInfo">
          <div class="task-user">
            {domTime}
            <img class="avatar avatar12" src={this.info_getItemMetaMedia(task.avatar)} />
            <span>{task.userName}</span>
            {domStatus}
          </div>
          {domActions}
        </div>
      );
      // remark
      let domRemark;
      const handleRemark = this._timeline_getHandleRemark({ task });
      if (handleRemark) {
        domRemark = (
          <div class="timeline-item-text">
            {'> ' + handleRemark}
          </div>
        );
      }
      return (
        <div key={`flowTask:${task.flowTaskId}`} ref={`flowTask:${task.flowTaskId}`} class="timeline-item">
          <div class="timeline-item-date">{domDate}</div>
          <div class="timeline-item-divider"></div>
          <div class={`timeline-item-content flowTask ${taskCurrentClass}` }>
            {domInfo}
            {domRemark}
          </div>
        </div>
      );
    },
    _timeline_renderTasks() {
      const flowNodeCount = this._timeline_getFlowNodeCount();
      let flowNodeGroup;
      let flowNodeGroupIndex = flowNodeCount + 1;
      const children = [];
      const tasks = this.base.data.tasks;
      for (const task of tasks) {
        // node as group
        if (flowNodeGroup !== task.flowNodeId) {
          flowNodeGroup = task.flowNodeId;
          flowNodeGroupIndex--;
          children.push(this._timeline_renderFlowNode({ task, flowNodeGroupIndex }));
        }
        // task
        children.push(this._timeline_renderFlowTask({ task }));
      }
      return children;
    },
    _timeline_getFlowNodeCount() {
      const flowNodeIds = {};
      const tasks = this.base.data.tasks;
      for (const task of tasks) {
        flowNodeIds[task.flowNodeId] = true;
      }
      return Object.keys(flowNodeIds).length;
    },
    timeline_render() {
      const tasks = this._timeline_renderTasks();
      return (
        <div class="timeline eb-flow-timeline">
          {tasks}
        </div>
      );
    },
  },
};
