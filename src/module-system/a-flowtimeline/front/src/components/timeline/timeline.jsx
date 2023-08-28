export default {
  data() {
    return {
      timeline: {},
    };
  },
  methods: {
    _timeline_prepareActions({ task }) {
      // actions
      let actions = task._actions || [];
      // map
      actions = actions.map(item => this._timeline_getActionBase(item));
      // filter
      const actionsBasic = actions.filter(item => {
        if (item.name === 'claim' && task.timeClaimed) return false;
        return item.basic;
      });
      const actionsMore = actions.filter(item => {
        if (item.name === 'appendHandleRemark' && task.handleRemark) return false;
        return !item.basic;
      });
      // ok
      return [actionsBasic, actionsMore];
    },
    async timeline_onPerformTaskActionMore(event, task) {
      const [, actionsMore] = this._timeline_prepareActions({ task });
      const buttons = [];
      for (const actionBase of actionsMore) {
        let icon;
        if (actionBase.icon) {
          const material = actionBase.icon.material;
          const f7 = actionBase.icon.f7;
          icon = await this.$meta.util.combineIcon({ material, f7 });
        }
        buttons.push({
          icon: icon || '<i class="icon"></i>',
          text: this.$text(actionBase.title),
          data: actionBase,
        });
      }
      // choose
      const params = {
        forceToPopover: true,
        targetEl: event.currentTarget,
        buttons,
      };
      const button = await this.$view.actions.choose(params);
      const actionBase = button.data;
      await this.timeline_onPerformTaskAction(event, actionBase, task);
    },
    async timeline_onPerformTaskAction(event, actionBase, task, ctxParent) {
      return await this.$meta.util.performAction({
        ctx: ctxParent || this.adapter.ctx,
        action: actionBase,
        item: {
          flowLayoutManager: this,
          task,
        },
      });
    },
    _timeline_getActionBase(action) {
      const actions = this.$meta.config.modules['a-flowtimeline'].flowTask.actions;
      const actionBase = actions[action.name];
      return this.$meta.util.extend({}, actionBase, action);
    },
    _timeline_renderFlowNodeItems({ tasks }) {
      const children = [];
      for (const task of tasks) {
        const domTask = this._timeline_renderFlowTask({ task });
        if (domTask) {
          children.push(domTask);
        }
      }
      return <f7-list medial-list>{children}</f7-list>;
    },
    _timeline_renderFlowNode({ task, flowNodeGroupIndex }) {
      // index
      const domIndex = (
        <f7-badge class="flowNodeIndex" color="teal">
          {flowNodeGroupIndex}
        </f7-badge>
      );
      // title
      const domTitle = <span>{task.flowNodeNameLocale}</span>;
      // remark
      let domStatuses;
      if (task.__showStatus) {
        domStatuses = this._timeline_renderFlowNodeStatuses({ task });
      }
      // current
      let domCurrent;
      if (task.flowNodeId === this.base_flow.flowNodeIdCurrent) {
        domCurrent = <f7-badge color="orange">{this.$text('Current')}</f7-badge>;
      }
      // tasks
      const items = this._timeline_renderFlowNodeItems({ tasks: task.items });
      return (
        <f7-card key={`flowNode:${task.flowNodeId}`} outline>
          <f7-card-header>
            <div>
              {domIndex}
              {domTitle}
            </div>
            <div>
              {domStatuses}
              {domCurrent}
            </div>
          </f7-card-header>
          <f7-card-content padding={false}>{items}</f7-card-content>
        </f7-card>
      );
    },
    _timeline_renderFlowNodeStatuses({ task }) {
      const children = [];
      // status
      const status = this._timeline_renderFlowNodeStatus({ task });
      if (status) {
        children.push(status);
      }
      return children;
    },
    _timeline_renderFlowNodeStatus({ task }) {
      if (task.flowNodeHandleStatus === 0) return;
      const flowNodeHandleStatuses = this.$meta.config.modules['a-flowtask'].flowNodeHandleStatuses;
      const status = flowNodeHandleStatuses[task.flowNodeHandleStatus];
      const text = task.flowNodeRemarkLocale || this.$text(status.text);
      return <f7-badge color={status.color}>{text}</f7-badge>;
    },
    _timeline_renderFlowTaskStatuses({ task }) {
      const children = [];
      // forward
      if (task.flowTaskIdForwardTo) {
        const taskTo = this.base_tasks.find(item => item.flowTaskId === task.flowTaskIdForwardTo);
        children.push(<f7-badge>{`To: ${taskTo.userName}`}</f7-badge>);
      }
      if (task.flowTaskIdForwardFrom) {
        const taskFrom = this.base_tasks.find(item => item.flowTaskId === task.flowTaskIdForwardFrom);
        children.push(<f7-badge>{`From: ${taskFrom.userName}`}</f7-badge>);
      }
      // substitute
      if (task.flowTaskIdSubstituteTo) {
        const taskTo = this.base_tasks.find(item => item.flowTaskId === task.flowTaskIdSubstituteTo);
        if (taskTo) {
          children.push(<f7-badge>{`To: ${taskTo.userName}`}</f7-badge>);
        }
      }
      if (task.flowTaskIdSubstituteFrom) {
        const taskFrom = this.base_tasks.find(item => item.flowTaskId === task.flowTaskIdSubstituteFrom);
        if (taskFrom) {
          children.push(<f7-badge>{`From: ${taskFrom.userName}`}</f7-badge>);
        }
      }
      // status
      const status = this._timeline_renderFlowTaskStatus({ task });
      if (status) {
        children.push(status);
      }
      return children;
    },
    _timeline_renderFlowTaskStatus({ task }) {
      if (task.handleStatus === 0) return;
      const flowTaskHandleStatuses = this.$meta.config.modules['a-flowtask'].flowTaskHandleStatuses;
      const status = flowTaskHandleStatuses[task.handleStatus];
      let text;
      if (task.flowNodeType.indexOf('startEventAtom') > -1) {
        text = this.$text('Submitted');
      } else {
        text = this.$text(status.text);
      }
      return <f7-badge color={status.color}>{text}</f7-badge>;
    },
    // be invoked by atomLayoutManager
    _timeline_renderFlowTaskActions_HandleView({ task, ctxParent }) {
      if (task.userIdAssignee !== this.base_user.id || this.base_flowOld) return;
      const children = [];
      const [actionsBasic] = this._timeline_prepareActions({ task });
      // claim handleTask
      for (const actionName of ['claim', 'handleTask']) {
        const actionBase = actionsBasic.find(item => item.name === actionName);
        if (actionBase) {
          children.push(
            <eb-link
              key={actionBase.name}
              iconMaterial={actionBase.icon.material}
              iconF7={actionBase.icon.f7}
              tooltip={this.$text(actionBase.title)}
              propsOnPerform={event => this.timeline_onPerformTaskAction(event, actionBase, task, ctxParent)}
            ></eb-link>
          );
        }
      }
      return children;
    },
    _timeline_renderFlowTaskActionsChildren({ task }) {
      if (task.userIdAssignee !== this.base_user.id || this.base_flowOld) return;
      const children = [];
      const [actionsBasic, actionsMore] = this._timeline_prepareActions({ task });
      for (const actionBase of actionsBasic) {
        children.push(
          <eb-link
            key={actionBase.name}
            iconMaterial={actionBase.icon.material}
            iconF7={actionBase.icon.f7}
            tooltip={this.$text(actionBase.title)}
            propsOnPerform={event => this.timeline_onPerformTaskAction(event, actionBase, task)}
          ></eb-link>
        );
      }
      if (actionsMore.length > 0) {
        children.push(
          <eb-link
            key="actionsPopover"
            iconF7="::more-horiz"
            propsOnPerform={event => this.timeline_onPerformTaskActionMore(event, task)}
          ></eb-link>
        );
      }
      return children;
    },
    _timeline_renderFlowTaskActions({ task }) {
      if (task.userIdAssignee !== this.base_user.id || this.base_flowOld) return;
      const children = this._timeline_renderFlowTaskActionsChildren({ task });
      return <div class="task-actions">{children}</div>;
    },
    _timeline_getHandleRemark({ task }) {
      if (task.flowTaskStatus === 0 && task.specificFlag === 1) {
        // assigneesConfirmation
        return this.$text('AssigneesConfirmationPrompt');
      }
      if (task.flowTaskStatus === 0 && task.specificFlag === 2) {
        // assigneesConfirmation
        return this.$text('Recall Available');
      }
      // others
      return task.handleRemarkLocale || task.handleRemark;
    },
    _timeline_renderFlowTask({ task }) {
      // taskCurrentClass
      const taskCurrentClass = task.id === this.container.flowTaskId ? 'item flowTaskCurrent' : 'item';
      // media
      const domMedia = (
        <div slot="media">
          <img class="avatar avatar24" src={this.info_getItemMetaMedia(task.avatar)} />
        </div>
      );
      // domHeader
      let date;
      if (task.handleStatus > 0) {
        date = this.$meta.util.formatDateTime(task.timeHandled);
      }
      const domStatuses = this._timeline_renderFlowTaskStatuses({ task });
      const domHeader = (
        <div slot="root-start" class="header">
          <div class="mediaLabel">
            <span>{date}</span>
          </div>
          <div class="date">{domStatuses}</div>
        </div>
      );
      // domTitle
      const domTitle = (
        <div slot="title" class="title">
          <div>{task.userName}</div>
        </div>
      );
      // domSummary
      const handleRemark = this._timeline_getHandleRemark({ task });
      const domSummary = (
        <div slot="root-end" class="summary">
          {handleRemark}
        </div>
      );
      // domAfter
      const domActions = this._timeline_renderFlowTaskActions({ task });
      const domAfter = (
        <div slot="after" class="after">
          {domActions}
        </div>
      );

      return (
        <eb-list-item class={taskCurrentClass} key={`flowTask:${task.flowTaskId}`} ref={`flowTask:${task.flowTaskId}`}>
          {domMedia}
          {domHeader}
          {domTitle}
          {domSummary}
          {domAfter}
        </eb-list-item>
      );
    },
    _timeline_renderTasks() {
      const children = [];
      const groups = this.base_tasksGroup;
      let flowNodeGroupIndex = groups.length;
      for (const group of groups) {
        children.push(this._timeline_renderFlowNode({ task: group, flowNodeGroupIndex }));
        flowNodeGroupIndex--;
      }
      return children;
    },
    timeline_render() {
      const tasks = this._timeline_renderTasks();
      return <div class="eb-flow-timeline">{tasks}</div>;
    },
  },
};
