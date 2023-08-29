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
    _renderCardHeader() {
      return (
        <f7-card-header>
          <f7-block-title>
            <f7-icon f7="::play-arrow"></f7-icon>
            {this.$text('TimeLine_ToDoList')}
          </f7-block-title>
        </f7-card-header>
      );
    },
    _renderCardContent() {
      const domTimeline = this.timelineInstance.timeline_render();
      return <f7-card-content padding={false}>{domTimeline}</f7-card-content>;
    },
    _renderCardFooter() {
      const allowViewWorkflow = this.timelineInstance.base_allowViewWorkflow;
      if (!allowViewWorkflow) return <f7-card-footer class="eb-card-footer-no-content"></f7-card-footer>;
      return (
        <f7-card-footer>
          <f7-link>Like</f7-link>
          <f7-link>Read more</f7-link>
        </f7-card-footer>
      );
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
