export default {
  data() {
    return {
      timeline: {
      },
    };
  },
  methods: {
    _timeline_renderFlowNode({ task }) {
      let domDate;
      let domTime;
      if (task.flowNodeStatus === 0) {
        domDate = (
          <f7-icon material="play_arrow"></f7-icon>
        );
      } else {
        domDate = (
          <span>{this.$meta.util.formatDateTime(task.timeDone, 'MM-DD')}</span>
        );
        let domRemark;
        if (task.flowNodeRemark) {
          domRemark = (
            <f7-badge class="eb-flowstatus" key="flowStatus" color="gray">{task.flowNodeRemark}</f7-badge>
          );
        }
        domTime = (
          <div class="timeline-item-time">
            <span>{this.$meta.util.formatDateTime(task.timeDone, 'HH:mm')}</span>
            {domRemark}
          </div>
        );
      }
      return (
        <div key={`flowNode:${task.flowNodeId}`} class="timeline-item">
          <div class="timeline-item-date">{domDate}</div>
          <div class="timeline-item-divider"></div>
          <div class="timeline-item-content">
            {domTime}
            <div class="timeline-item-title">{task.flowNodeName}</div>
          </div>
        </div>
      );
    },
    _timeline_renderFlowTask({ task }) {
      let domDate;
      let domTime;
      if (task.flowNodeStatus === 0) {
        domDate = (
          <f7-icon material="play_arrow"></f7-icon>
        );
      } else {
        domDate = (
          <span>{this.$meta.util.formatDateTime(task.timeDone, 'MM-DD')}</span>
        );
        let domRemark;
        if (task.flowNodeRemark) {
          domRemark = (
            <f7-badge class="eb-flowstatus" key="flowStatus" color="gray">{task.flowNodeRemark}</f7-badge>
          );
        }
        domTime = (
          <div class="timeline-item-time">
            <span>{this.$meta.util.formatDateTime(task.timeDone, 'HH:mm')}</span>
            {domRemark}
          </div>
        );
      }
      return (
        <div key={`flowTask:${task.flowTaskId}`} class="timeline-item">
          <div class="timeline-item-date">{domDate}</div>
          <div class="timeline-item-divider"></div>
          <div class="timeline-item-content">
            {domTime}
            <div class="timeline-item-title">{task.flowNodeName}</div>
          </div>
        </div>
      );
    },
    _timeline_renderTasks() {
      const children = [];
      let flowNodeGroup;
      const tasks = this.base.data.tasks;
      for (const task of tasks) {
        // node as group
        if (!flowNodeGroup) {
          flowNodeGroup = task.flowNodeId;
          children.push(this._timeline_renderFlowNode({ task }));
        }
        // task
        children.push(this._timeline_renderFlowTask({ task }));
      }
      return children;
    },
    timeline_render() {
      const tasks = this._timeline_renderTasks();
      return (
        <div class="timeline">
          {tasks}
        </div>
      );
    },
  },
};
