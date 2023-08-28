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
    _renderTodoList() {
      return this.timelineInstance.timeline_render();
    },
    _renderContainer() {
      const tasks = this.timelineInstance.base_tasks;
      if (!tasks || tasks.length === 0) return null;
      return (
        <f7-card class="demo-card-header-pic">
          <f7-card-header>
            <f7-block-title>
              <f7-icon f7="::play-arrow"></f7-icon>
              {this.$text('TimeLine_ToDoList')}
            </f7-block-title>
          </f7-card-header>
          <f7-card-content padding={false}>{this._renderTodoList()}</f7-card-content>
          <f7-card-footer>
            <f7-link>Like</f7-link>
            <f7-link>Read more</f7-link>
          </f7-card-footer>
        </f7-card>
      );
    },
  },
  render() {
    return this._renderContainer();
  },
};
