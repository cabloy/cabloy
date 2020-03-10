<script>
export default {
  name: 'eb-dashboard-widget-group',
  render(c) {
    return this.__renderRow(c);
  },
  props: {
    root: {
      type: Boolean,
    },
    dashboard: {
      type: Object,
    },
    widgets: {
      type: Array,
    }
  },
  data() {
    return {
      dragdropSceneResize: Vue.prototype.$meta.util.nextId('dragdrop'),
      dragdropScene: Vue.prototype.$meta.util.nextId('dragdrop'),
    };
  },
  methods: {
    __renderRow(c) {
      // cols
      const cols = [];
      for (const item of this.widgets) {
        const col = c('eb-dashboard-widget', {
          key: item.id,
          props: {
            dashboard: this.dashboard,
            group: this,
            options: item,
            dragdropSceneResize: this.dragdropSceneResize,
            dragdropScene: this.dragdropScene,
          }
        });
        cols.push(col);
      }
      //last
      cols.push(c('f7-col', {
        staticClass: 'widget widget-last',
        props: {
          resizable: true,
          resizableHandler: false,
          width: 100,
        }
      }));
      // row
      return c('f7-row', {
        staticClass: `group`,
      }, cols);
    },
    __getWidgetById(widgetId) {
      const index = this.widgets.findIndex(item => item.id === widgetId);
      if (index === -1) return [null, -1];
      return [this.widgets[index], index];
    },
    onWidgetAdd(widget) {
      const _widget = { module: widget.module, name: widget.name };
      this.dashboard.__initWidget(_widget, this.root ? 'widget' : 'group');
      this.widgets.push(_widget);
    },
  }
}

</script>
