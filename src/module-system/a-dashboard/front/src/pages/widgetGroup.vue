<script>
import widget from './widget.vue';

export default {
  components: {
    widget,
  },
  render(c) {
    return this.__renderRow(c);
  },
  props: {
    dashboard: {
      type: Object,
    },
    widgets: {
      type: Array,
    }
  },
  data() {
    return {
      ready: false,
      widgetsAll: null,
      profile: null,
      profileId: 0,
      dragdropSceneResize: Vue.prototype.$meta.util.nextId('dragdrop'),
      dragdropScene: Vue.prototype.$meta.util.nextId('dragdrop'),
    };
  },
  methods: {
    __renderRow(c) {
      // cols
      const cols = [];
      for (const item of this.widgets) {
        const col = c('widget', {
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
        staticClass: 'widget-group',
      }, cols);
    },
    __getWidgetById(widgetId) {
      const index = this.widgets.findIndex(item => item.id === widgetId);
      if (index === -1) return [null, -1];
      return [this.widgets[index], index];
    },
  }
}

</script>
