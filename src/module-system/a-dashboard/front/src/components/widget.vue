<script>
import widgetToolbar from './widgetToolbar.vue';

const _colWidths = [5, 10, 15, 20, 25, 30, 33, 35, 40, 45, 50, 55, 60, 65, 66, 70, 75, 80, 85, 90, 95, 100];
export default {
  name: 'eb-dashboard-widget',
  components: {
    widgetToolbar,
  },
  render(c) {
    const children = [];
    // toolbar
    const toolbar = c('widget-toolbar', {
      staticClass: 'widget-toolbar',
      props: {
        widget: this.options,
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
    children.push(toolbar);
    // resize handler
    const resizeHandler = c('span', {
      staticClass: 'resize-handler',
      directives: [{
        name: 'eb-dragdrop',
        value: {
          scene: this.dragdropSceneResize,
          resizable: true,
          widgetId: this.options.id,
          onDragStart: this.onDragStartResizable,
          onDragMove: this.onDragMoveResizable,
        }
      }],
    });
    children.push(resizeHandler);
    // group/widget
    if (this.options.group) {
      children.push(c('eb-dashboard-widget-group', {
        ref: 'group',
        props: {
          root: false,
          dashboard: this.dashboard,
          widgets: this.options.widgets,
        },
      }));
    } else {
      if (this.ready) {
        children.push(c(this.__getFullName(), {
          staticClass: 'widget-inner',
        }));
      }
    }
    // f7-col
    return c('f7-col', {
      staticClass: this.__getClassName(),
      attrs: {
        'data-widget-id': this.options.id,
      },
      props: {
        resizable: true,
        resizableHandler: false,
        width: this.options.properties.width.small,
        medium: this.options.properties.width.medium,
        large: this.options.properties.width.large,
      },
      style: {
        height: this.options.properties.height,
      }
    }, children);
  },
  props: {
    dashboard: {
      type: Object,
    },
    group: {
      type: Object,
    },
    options: {
      type: Object,
    },
    dragdropSceneResize: {
      type: String,
    },
    dragdropScene: {
      type: String,
    }
  },
  data() {
    return {
      ready: false,
    };
  },
  created() {
    this.__init();
  },
  beforeDestroy() {
    this.$emit('widget:destroy');
  },
  methods: {
    __init() {
      if (this.options.group) return;
      this.$meta.module.use(this.options.module, module => {
        this.$options.components[this.__getFullName()] = module.options.components[this.options.name];
        this.ready = true;
      });
    },
    __getClassName() {
      if (this.options.group) return `widget widget-id-${this.options.id} widget-group ${this.options.widgets.length===0?'widget-group-empty':'widget-group-some'}`;
      return `widget widget-id-${this.options.id} widget-name-${this.options.module}-${this.options.name}`;
    },
    __getFullName() {
      return `${this.options.module}:${this.options.name}`;
    },
    onDragStartResizable({ $el, context, dragElement }) {
      const $container = this.$$(this.dashboard.$el);
      const size = { width: $container.width() };
      const tooltip = this.__getTooltipResizable(context);
      return { size, tooltip };
    },
    onDragMoveResizable({ $el, context, diff }) {
      const viewSize = this.getViewSize();
      // diff
      const diffPercent = parseInt(diff.percent.x * 100);
      if (diffPercent === 0) return;
      const minus = diffPercent < 0;
      // this widget
      const [widget, index] = this.group.__getWidgetById(context.widgetId);
      const widgetWidthCurrent = widget.properties.width[viewSize];
      let widgetWidthNew = widgetWidthCurrent + diffPercent;
      widgetWidthNew = this.__getPreferWidth(widgetWidthCurrent, widgetWidthNew, false, minus);
      if (!widgetWidthNew) return false;
      if (widgetWidthCurrent === widgetWidthNew) return false;
      // set width
      widget.properties.width[viewSize] = widgetWidthNew;
      // tooltip
      let tooltip = widget.properties.width[viewSize];
      // next col
      const widgetNext = this.group.widgets[index + 1];
      if (widgetNext) {
        const widgetWidthNext = widgetNext.properties.width[viewSize];
        let widgetWidthNewNext = widgetWidthNext - (widgetWidthNew - widgetWidthCurrent);
        widgetWidthNewNext = this.__getPreferWidth(widgetWidthNext, widgetWidthNewNext, true, !minus);
        if (widgetWidthNewNext) {
          widgetNext.properties.width[viewSize] = widgetWidthNewNext;
        }
        tooltip = `${tooltip}:${widgetNext.properties.width[viewSize]}`;
      }
      return { eaten: true, tooltip };
    },
    __getTooltipResizable(context) {
      const viewSize = this.getViewSize();
      let tooltip;
      const [widget, index] = this.group.__getWidgetById(context.widgetId);
      tooltip = widget.properties.width[viewSize];
      const widgetNext = this.group.widgets[index + 1];
      if (widgetNext) {
        tooltip = `${tooltip}:${widgetNext.properties.width[viewSize]}`;
      }
      return tooltip;
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
    onDragStart({ $el, context, dragElement }) {
      const [widgetDrag, indexDrag] = this.group.__getWidgetById(context.widgetId);
      const tooltip = `${this.dashboard.__getWidgetTitle(widgetDrag)}`;
      return { tooltip };
    },
    onDragElement({ $el, context }) {
      return this.$$(`.widget-id-${context.widgetId}`);
    },
    onDropElement({ $el, context, dragElement, dragContext }) {
      const [widgetDrop, indexDrop] = this.group.__getWidgetById(context.widgetId);
      const [widgetDrag, indexDrag] = this.group.__getWidgetById(dragContext.widgetId);
      if (indexDrop === indexDrag || indexDrop == indexDrag + 1) return null;
      // dropElement
      const dropElement = this.$$(`.widget-id-${context.widgetId}`);
      // tooltip
      const tooltip = this.dashboard.__getWidgetTitle(widgetDrop);
      // ok
      return { dropElement, tooltip };
    },
    onDropLeave({ $el, context, dropElement }) {},
    onDropEnter({ $el, context, dropElement }) {},
    onDragEnd({ $el, context, dragElement }) {},
    onDragDone({ $el, context, dragElement, dropElement, dropContext }) {
      const [widgetDrag, indexDrag] = this.group.__getWidgetById(context.widgetId);
      this.group.widgets.splice(indexDrag, 1);
      const [widgetDrop, indexDrop] = this.group.__getWidgetById(dropContext.widgetId);
      this.group.widgets.splice(indexDrop, 0, widgetDrag);
      // save
      //this.layout.__saveLayoutConfig();
    },
    onWidgetDelete(widget) {
      this.$view.dialog.confirm().then(() => {
        const [_widget, index] = this.group.__getWidgetById(widget.id);
        if (index === -1) return;
        this.group.widgets.splice(index, 1);
      }).catch(() => {});
    },
    onWidgetProperties(widget) {
      this.$view.navigate(`/a/dashboard/widget/properties?widgetId=${this.options.id}`, {
        scene: 'sidebar',
        sceneOptions: { side: 'right', name: 'properties', title: 'Properties' },
        context: {
          params: {
            dashboard: this.dashboard,
            widget: this,
          },
        },
      });
    },
    onWidgetsAdd({ widgets }) {
      for (const widget of widgets) {
        this.dashboard.onWidgetAdd(this.options.widgets, widget);
      }
    },
  }
}

</script>
