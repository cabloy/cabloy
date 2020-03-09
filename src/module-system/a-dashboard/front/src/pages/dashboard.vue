<script>
const _colWidths = [5, 10, 15, 20, 25, 30, 33, 35, 40, 45, 50, 55, 60, 65, 66, 70, 75, 80, 85, 90, 95, 100];
import widget from './widget.vue';
import widgetToolbar from './widgetToolbar.vue';
export default {
  meta: {
    title: 'Dashboard',
  },
  components: {
    widget,
    widgetToolbar,
  },
  render(c) {
    const children = [];
    if (this.ready) {
      // row
      children.push(this.__renderRow(c));
      // settings
      children.push(c('f7-link', {
        staticClass: 'dashboard-settings',
        attrs: {
          iconMaterial: 'settings'
        },
        on: {
          click: this.onClickSettings,
        }
      }));
    }
    return c('eb-page', {}, children);
  },
  data() {
    return {
      ready: false,
      widgetsAll: null,
      profile: null,
      dragdropSceneResize: Vue.prototype.$meta.util.nextId('dragdrop'),
      dragdropScene: Vue.prototype.$meta.util.nextId('dragdrop'),
    };
  },
  created() {
    this.__init();
  },
  methods: {
    __renderRow(c) {
      // cols
      const cols = [];
      for (const item of this.profile.widgets) {
        const widget = c('widget', {
          props: {
            options: item,
          }
        });
        const toolbar = c('widget-toolbar', {
          staticClass: 'widget-toolbar',
          props: {
            widget: item,
            dragdropScene: this.dragdropScene,
            onDragStart: this.onDragStart,
            onDragElement: this.onDragElement,
            onDropElement: this.onDropElement,
            onDropLeave: this.onDropLeave,
            onDropEnter: this.onDropEnter,
            onDragEnd: this.onDragEnd,
            onDragDone: this.onDragDone,
            onWidgetDelete: this.onWidgetDelete,
            onWidgetProperties: this.onWidgetProperties,
          },
        });
        const resizeHandler = c('span', {
          staticClass: 'resize-handler',
          directives: [{
            name: 'eb-dragdrop',
            value: {
              scene: this.dragdropSceneResize,
              resizable: true,
              widgetId: item.id,
              onDragContainer: this.onDragContainerResizable,
              onDragMove: this.onDragMoveResizable,
            }
          }],
        });
        cols.push(c('f7-col', {
          key: item.id,
          staticClass: `widget widget-${item.id}`,
          attrs: {
            'data-widget-id': item.id,
          },
          props: {
            resizable: true,
            resizableHandler: false,
            width: item.properties.width.small,
            medium: item.properties.width.medium,
            large: item.properties.width.large,
          },
          style: {
            height: item.properties.height,
          }
        }, [widget, toolbar, resizeHandler]));
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
        ref: 'container',
        staticClass: 'dashboard',
      }, cols);
    },
    __init() {
      // widgetsAll
      this.$store.dispatch('a/base/getWidgets').then(widgets => {
        this.widgetsAll = widgets;
        // layoutConfig
        this.$store.dispatch('a/base/getLayoutConfig', 'a-dashboard').then(layoutConfig => {
          // init layoutConfig
          this.__initLayoutConfig(layoutConfig);
          // ready
          this.ready = true;
        });
      });
    },
    __initLayoutConfig(layoutConfig) {
      // profile
      let profile;
      if (layoutConfig.profile) {
        profile = JSON.parse(JSON.stringify(layoutConfig.profile));
      } else {
        const profileDefault = this.$config.profile.default;
        profile = JSON.parse(JSON.stringify(profileDefault));
      }
      // profile id
      if (!profile.id) {
        profile.id = this.__generateUUID();
      }
      // widget id
      for (const widget of profile.widgets) {
        this.__initWidget(widget);
      }
      // ok
      this.profile = profile;
    },
    __initWidget(widget) {
      // uuid
      if (!widget.id) {
        widget.id = this.__generateUUID();
      }
      if (!widget.properties) {
        widget.properties = this.$utils.extend({}, this.$config.profile.meta.widget.properties);
      }
    },
    onDragContainerResizable({ $el, context }) {
      const $container = this.$$(this.$refs.container.$el);
      const size = { width: $container.width() };
      const tip = this.__getTip(context);
      return { size, tip };
    },
    onDragMoveResizable({ $el, context, diff }) {
      const viewSize = this.getViewSize();
      // diff
      const diffPercent = parseInt(diff.percent.x * 100);
      if (diffPercent === 0) return;
      const minus = diffPercent < 0;
      // this widget
      const [widget, index] = this.__getWidgetById(context.widgetId);
      const widgetWidthCurrent = widget.properties.width[viewSize];
      let widgetWidthNew = widgetWidthCurrent + diffPercent;
      widgetWidthNew = this.__getPreferWidth(widgetWidthCurrent, widgetWidthNew, false, minus);
      if (!widgetWidthNew) return false;
      if (widgetWidthCurrent === widgetWidthNew) return false;
      // set width
      widget.properties.width[viewSize] = widgetWidthNew;
      // tip
      let tip = widget.properties.width[viewSize];
      // next col
      const widgetNext = this.profile.widgets[index + 1];
      if (widgetNext) {
        const widgetWidthNext = widgetNext.properties.width[viewSize];
        let widgetWidthNewNext = widgetWidthNext - (widgetWidthNew - widgetWidthCurrent);
        widgetWidthNewNext = this.__getPreferWidth(widgetWidthNext, widgetWidthNewNext, true, !minus);
        if (widgetWidthNewNext) {
          widgetNext.properties.width[viewSize] = widgetWidthNewNext;
        }
        tip = `${tip}:${widgetNext.properties.width[viewSize]}`;
      }
      return { tip };
    },
    __getWidgetById(widgetId) {
      const index = this.profile.widgets.findIndex(item => item.id === widgetId);
      if (index === -1) return [null, -1];
      return [this.profile.widgets[index], index];
    },
    __getTip(context) {
      const viewSize = this.getViewSize();
      let tip;
      const [widget, index] = this.__getWidgetById(context.widgetId);
      tip = widget.properties.width[viewSize];
      const widgetNext = this.profile.widgets[index + 1];
      if (widgetNext) {
        tip = `${tip}:${widgetNext.properties.width[viewSize]}`;
      }
      return tip;
    },
    getViewSize() {
      return this.$view.size;
    },
    __getPreferWidth(widthCurrent, widthNew, force, minus) {
      const loop = force ? 5 : 2;
      for (let i = 0; i < loop; i++) {
        for (const item of _colWidths) {
          if (minus && item < widthCurrent && widthNew - item <= i) return item;
          if (!minus && item > widthCurrent && item - widthNew <= i) return item;
        }
      }
      return null;
    },
    onDragStart({ $el, context, dragElement }) {},
    onDragElement({ $el, context }) {
      return this.$$(`.widget-${context.widgetId}`);
    },
    onDropElement({ $el, context, dragElement, dragContext }) {
      const [widgetDrop, indexDrop] = this.__getWidgetById(context.widgetId);
      const [widgetDrag, indexDrag] = this.__getWidgetById(dragContext.widgetId);
      if (indexDrop === indexDrag || indexDrop == indexDrag + 1) return null;
      return this.$$(`.widget-${context.widgetId}`);
    },
    onDropLeave({ $el, context, dropElement }) {},
    onDropEnter({ $el, context, dropElement }) {},
    onDragEnd({ $el, context, dragElement }) {},
    onDragDone({ $el, context, dragElement, dropElement, dropContext }) {
      const [widgetDrag, indexDrag] = this.__getWidgetById(context.widgetId);
      this.profile.widgets.splice(indexDrag, 1);
      const [widgetDrop, indexDrop] = this.__getWidgetById(dropContext.widgetId);
      this.profile.widgets.splice(indexDrop, 0, widgetDrag);
      // save
      //this.layout.__saveLayoutConfig();
    },
    onClickSettings() {
      this.$view.navigate(`/a/dashboard/dashboard/settings?id=${this.profile.id}`, {
        scene: 'sidebar',
        sceneOptions: { side: 'right', name: 'profile', title: 'Profile2' },
        context: {
          params: {
            dashboard: this,
          },
        },
      });
    },
    onWidgetAdd({ widget }) {
      this.__initWidget(widget);
      this.profile.widgets.push(widget);
    },
    onWidgetDelete(widget) {
      return this.$view.dialog.confirm().then(() => {
        const [_widget, index] = this.__getWidgetById(widget.id);
        if (index === -1) return;
        this.profile.widgets.splice(index, 1);
      });
    },
    onWidgetProperties(widget) {

    },
    __generateUUID() {
      var d = new Date().getTime();
      if (window.performance && typeof window.performance.now === "function") {
        d += performance.now(); //use high-precision timer if available
      }
      var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
      return uuid;
    }
  }
}

</script>
