export default {
  meta: {
    global: false,
  },
  props: {
    layoutManager: {
      type: Object,
    },
    layoutConfig: {
      type: Object,
    },
    blockConfig: {
      type: Object,
    },
    info: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  computed: {
    timelineInstance() {
      return this.info.timelineInstance;
    },
  },
  methods: {
    async onPerformViewWorkFlow() {
      const sheet = await this.$view.createModal({ module: 'a-flowtask', name: 'actionCancelFlow' });
      console.log(sheet);
      sheet.open();
      return;
      const flowId = this.timelineInstance.adapter.flowId;
      const url = `/a/flowtask/flow?flowId=${flowId}`;
      this.$view.navigate(url);
    },
    async onPerformViewFlowChart() {
      const flowId = this.timelineInstance.adapter.flowId;
      // flowChartProcess
      const flowChartProcess = await this.$api.post('/a/flowchart/flow/flowChartProcess', {
        host: {
          flowId,
        },
      });
      // flowNodes current
      const tasks = this.timelineInstance.base_tasks;
      const flowNodeDefIds = tasks.filter(task => task.flowTaskStatus === 0).map(task => task.flowNodeDefId);
      // view
      const url = `/a/flowchart/flowDef/contentProcessView?flowId=${flowId}`;
      this.$view.navigate(url, {
        target: undefined,
        context: {
          params: {
            contentProcess: flowChartProcess,
            flowNodeDefIds,
          },
        },
      });
    },
    _renderCardHeader() {
      const allowViewWorkflow = this.timelineInstance.base_allowViewWorkflow;
      const domButtons = [];
      if (allowViewWorkflow) {
        domButtons.push(
          <eb-link
            iconF7="::timeline"
            iconSize={16}
            tooltip={this.$text('ViewWorkFlow')}
            propsOnPerform={this.onPerformViewWorkFlow}
          ></eb-link>
        );
        domButtons.push(
          <eb-link
            iconF7="::flow-chart"
            iconSize={16}
            tooltip={this.$text('ViewFlowChart')}
            propsOnPerform={this.onPerformViewFlowChart}
          ></eb-link>
        );
      }
      return (
        <f7-card-header>
          <f7-block-title>
            <div>
              <f7-icon f7="::play-arrow"></f7-icon>
              {this.$text('TimeLine_ToDoList')}
            </div>
            <div class="links">{domButtons}</div>
          </f7-block-title>
        </f7-card-header>
      );
    },
    _renderCardContent() {
      const domTimeline = this.timelineInstance.timeline_render();
      return <f7-card-content padding={false}>{domTimeline}</f7-card-content>;
    },
    _renderCardFooter() {
      return <f7-card-footer class="eb-card-footer-no-content"></f7-card-footer>;
    },
    _renderContainer() {
      const tasks = this.timelineInstance.base_tasks;
      if (!tasks || tasks.length === 0) return null;
      const domCardHeader = this._renderCardHeader();
      const domCardContent = this._renderCardContent();
      const domCardFooter = this._renderCardFooter();
      return (
        <f7-card class="card-workflow-timeline-currentonly">
          {domCardHeader}
          {domCardContent}
          {domCardFooter}
        </f7-card>
      );
    },
  },
  render() {
    return this._renderContainer();
  },
};
