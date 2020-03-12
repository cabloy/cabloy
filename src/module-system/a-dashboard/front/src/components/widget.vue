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
      if (!this.errorMessage && this.ready) {
        // props
        const props = {
          widget: this, // for more extensible
        };
        this.__combineWidgetProps(props);
        children.push(c(this.__getFullName(), {
          staticClass: 'widget-inner',
          props,
          on: {
            'widgetReal:ready': this.__onWidgetRealReady,
            'widgetReal:destroy': this.__onWidgetRealDestroy,
          },
        }));
      } else if (this.errorMessage) {
        children.push(c('div', {
          staticClass: 'widget-inner widget-inner-error',
          domProps: { innerText: this.errorMessage },
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
        width: this.__getPropertyRealValue('widthSmall'),
        medium: this.__getPropertyRealValue('widthMedium'),
        large: this.__getPropertyRealValue('widthLarge'),
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
      errorMessage: null,
      component: null,
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
        const fullName = this.__getFullName();
        this.component = module.options.components[this.options.name];
        if (!this.component) {
          this.errorMessage = `${this.$text('Widget Not Found')}: ${fullName}`;
          this.ready = false;
        } else {
          this.$options.components[fullName] = this.component;
          this.ready = true;
          this.errorMessage = null;
        }
      });
    },
    __onWidgetRealReady(widgetReal) {
      this.dashboard.__onWidgetRealReady(this.options.id, widgetReal);
    },
    __onWidgetRealDestroy(widgetReal) {
      this.dashboard.__onWidgetRealDestroy(this.options.id, widgetReal);
    },
    __getBindValue(bind) {
      const [widgetSource] = this.dashboard.__findWidgetRealById(bind.widgetId);
      if (!widgetSource) {
        // source not found
        throw new Error(this.$text('Source Widget Not Found'));
      }
      return widgetSource.widgetReal[bind.propertyName];
    },
    __getBindsValue(binds) {
      const values = [];
      for (const bind of binds) {
        const value = this.__getBindValue(bind);
        values.push({
          key: `${bind.widgetId}:${bind.propertyName}`,
          value,
        });
      }
      return values;
    },
    __getPropertyReal2(options, propertyName) {
      return options.properties[propertyName];
    },
    __getPropertyReal(propertyName) {
      return this.__getPropertyReal2(this.options, propertyName);
    },
    __getPropertyRealValue2(options, propertyName) {
      const propertyReal = this.__getPropertyReal2(options, propertyName);
      if (!propertyReal) return undefined;

      try {
        let value;
        if (propertyReal.bind) {
          // bind
          value = this.__getBindValue(propertyReal.bind);
        } else if (propertyReal.binds) {
          // binds
          value = this.__getBindsValue(propertyReal.binds);
        } else {
          // static
          value = propertyReal.value;
        }
        // special for title
        if (propertyName === 'title' && !value) {
          if (options.group) {
            value = this.$text('Group');
          } else {
            value = this.dashboard.__findWidgetStock(options).titleLocale;
          }
        }
        // ok
        this.$set(propertyReal, 'error', null);
        return value;
      } catch (err) {
        this.$set(propertyReal, 'error', err.message);
        return undefined;
      }
    },
    __getPropertyRealValue(propertyName) {
      return this.__getPropertyRealValue2(this.options, propertyName);
    },
    __setPropertyRealValue2(options, propertyName, data) {
      if (!data) data = {};
      if (typeof data !== 'object') data = { value: data };
      // old
      const propertyRealOld = options.properties[propertyName] || {};
      // retain the old value maybe
      const propertyRealNew = this.$meta.util.extend({}, propertyRealOld, { bind: null, binds: null, error: null }, data);
      this.$set(options.properties, propertyName, propertyRealNew);
      return propertyRealNew;
    },
    __setPropertyRealValue(propertyName, data) {
      return this.__setPropertyRealValue2(this.options, propertyName, data);
    },
    __combineWidgetProps(props) {
      const propsSchema = this.component.meta && this.component.meta.schema && this.component.meta.schema.props;
      if (!propsSchema) return;
      for (const propertyName in propsSchema.properties) {
        props[propertyName] = this.__getPropertyRealValue(propertyName);
      }
    },
    getBindValue({ propertyName }) {

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
      const viewSizeUpperCase = viewSize.replace(viewSize[0], viewSize[0].toUpperCase());
      const propertyNameWidth = `width${viewSizeUpperCase}`;
      // diff
      const diffPercent = parseInt(diff.percent.x * 100);
      if (diffPercent === 0) return;
      const minus = diffPercent < 0;
      // this widget
      const [widget, index] = this.group.__getWidgetById(context.widgetId);
      const widgetWidthCurrent = this.__getPropertyRealValue2(widget, propertyNameWidth);
      let widgetWidthNew = widgetWidthCurrent + diffPercent;
      widgetWidthNew = this.__getPreferWidth(widgetWidthCurrent, widgetWidthNew, false, minus);
      if (!widgetWidthNew) return false;
      if (widgetWidthCurrent === widgetWidthNew) return false;
      // set width
      this.__setPropertyRealValue2(widget, propertyNameWidth, widgetWidthNew);
      // save
      this.dashboard.__saveLayoutConfig();
      // tooltip
      let tooltip = this.__getPropertyRealValue2(widget, propertyNameWidth); // dynamically maybe
      // next col
      const widgetNext = this.group.widgets[index + 1];
      if (widgetNext) {
        const widgetWidthNext = this.__getPropertyRealValue2(widgetNext, propertyNameWidth);
        let widgetWidthNewNext = widgetWidthNext - (widgetWidthNew - widgetWidthCurrent);
        widgetWidthNewNext = this.__getPreferWidth(widgetWidthNext, widgetWidthNewNext, true, !minus);
        if (widgetWidthNewNext) {
          this.__setPropertyRealValue2(widgetNext, propertyNameWidth, widgetWidthNewNext);
        }
        tooltip = `${tooltip}:${this.__getPropertyRealValue2(widgetNext, propertyNameWidth)}`;
      }
      return { eaten: true, tooltip };
    },
    __getTooltipResizable(context) {
      const viewSize = this.getViewSize();
      const viewSizeUpperCase = viewSize.replace(viewSize[0], viewSize[0].toUpperCase());
      const propertyNameWidth = `width${viewSizeUpperCase}`;
      let tooltip;
      const [widget, index] = this.group.__getWidgetById(context.widgetId);
      tooltip = this.__getPropertyRealValue2(widget, propertyNameWidth);
      const widgetNext = this.group.widgets[index + 1];
      if (widgetNext) {
        tooltip = `${tooltip}:${this.__getPropertyRealValue2(widgetNext, propertyNameWidth)}`;
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
      const tooltip = `${this.__getPropertyRealValue2(widgetDrag,'title')}`;
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
      const tooltip = this.__getPropertyRealValue2(widgetDrop, 'title');
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
      this.dashboard.__saveLayoutConfig();
    },
    onWidgetDelete(widget) {
      this.$view.dialog.confirm().then(() => {
        const [_widget, index] = this.group.__getWidgetById(widget.id);
        if (index === -1) return;
        this.group.widgets.splice(index, 1);
        // save
        this.dashboard.__saveLayoutConfig();
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
        this.$refs.group.onWidgetAdd(widget);
      }
    },
  }
}

</script>
