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
import Vue from 'vue';
export default {
  data() {
    return {
      timeline: {
      },
    };
  },
  methods: {
    timeline_onPerformTaskActions(event, task) {
      // popover
      const popover = this.$$(this.$refs[`flowTask:${task.flowTaskId}`]).find('.popover');
      if (popover.length === 0) return;
      this.$f7.popover.open(popover, event.currentTarget);
      // actions
      if (!task._actions) {
        this.$api.post('/a/flowtask/task/actions', {
          flowTaskId: task.flowTaskId,
        }).then(data => {
          Vue.set(task, '_actions', data);
        });
      }
    },
    _timeline_renderFlowNode({ task, flowNodeGroupIndex }) {
      // date
      const domDate = (
        <f7-badge color="teal">{flowNodeGroupIndex}</f7-badge>
      );
      // title
      let domRemark;
      task.flowNodeRemark;
      if (task.flowNodeRemark) {
        domRemark = (
          <f7-badge class="flowRemark" color="gray">{task.flowNodeRemark}</f7-badge>
        );
      }
      const domTitle = (
        <div class="timeline-item-title">
          <span>{task.flowNodeName}</span>
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
    _timeline_renderFlowTaskActions({ task }) {
      if (task.userIdAssignee !== this.base_user.id || this.base_flowOld) return;
      return (
        <eb-link iconMaterial="more_horiz" propsOnPerform={event => this.timeline_onPerformTaskActions(event, task)}></eb-link>
      );
    },
    _timeline_renderFlowTaskActionsPopoverActions({ task }) {
      if (!task._actions) return;
      const children = [];
      for (const action of task._actions) {

      }
    },
    _timeline_renderFlowTaskActionsPopover({ task }) {
      if (task.userIdAssignee !== this.base_user.id || this.base_flowOld) return;
      const children = this._timeline_renderFlowTaskActionsPopoverActions({ task });
      return (
        <eb-popover ready={task._actions}>
          <f7-list inset>
            {children}
          </f7-list>
        </eb-popover>
      );
    },
    _timeline_renderFlowTask({ task }) {
      // date
      let domDate;
      if (task.handleStatus === 0) {
        if (task.userIdAssignee === this.base_user.id) {
          domDate = (
            <f7-icon material="play_arrow"></f7-icon>
          );
        }
      } else {
        domDate = (
          <small>{this.$meta.util.formatDateTime(task.timeHandled, 'MM-DD')}</small>
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
      if (task.handleRemark) {
        domRemark = (
          <div class="timeline-item-text">
            {'> ' + task.handleRemark}
          </div>
        );
      }
      // popover
      const domPopover = this._timeline_renderFlowTaskActionsPopover({ task });
      return (
        <div key={`flowTask:${task.flowTaskId}`} ref={`flowTask:${task.flowTaskId}`} class="timeline-item">
          <div class="timeline-item-date">{domDate}</div>
          <div class="timeline-item-divider"></div>
          <div class="timeline-item-content flowTask">
            {domInfo}
            {domRemark}
            {domPopover}
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
