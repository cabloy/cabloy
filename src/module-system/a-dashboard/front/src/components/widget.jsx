import widgetToolbar from './widgetToolbar.jsx';

const _colWidths = [5, 10, 15, 20, 25, 30, 33, 35, 40, 45, 50, 55, 60, 65, 66, 70, 75, 80, 85, 90, 95, 100];
export default {
  meta: {
    global: true,
  },
  name: 'eb-dashboard-widget',
  components: {
    widgetToolbar,
  },
  render(c) {
    const children = [];
    // toolbar
    if (!this.dashboard.lock) {
      children.push(
        <widget-toolbar
          key="widget-toolbar"
          staticClass="widget-toolbar"
          widget={this.options}
          dragdropScene={this.dragdropScene}
          propsOnDragStart={this.onDragStart}
          propsOnDragElement={this.onDragElement}
          propsOnDropElement={this.onDropElement}
          propsOnDropLeave={this.onDropLeave}
          propsOnDropEnter={this.onDropEnter}
          propsOnDragEnd={this.onDragEnd}
          propsOnDragDone={this.onDragDone}
          propsOnWidgetDelete={this.onWidgetDelete}
          propsOnWidgetProperties={this.onWidgetProperties}
        ></widget-toolbar>
      );
    }
    // resize handler
    if (!this.dashboard.lock) {
      const directives = [
        {
          name: 'eb-dragdrop',
          value: {
            scene: this.dragdropSceneResize,
            resizable: true,
            widgetId: this.options.id,
            onDragStart: this.onDragStartResizable,
            onDragMove: this.onDragMoveResizable,
          },
        },
      ];
      children.push(<span key="resize-handler" staticClass="resize-handler" {...{ directives }}></span>);
    }
    // group/widget
    if (this.options.group) {
      // props
      const props = {
        widget: this, // for more extensible
        root: false,
        dashboard: this.dashboard,
        widgets: this.options.widgets,
      };
      this.__combineWidgetProps(props);
      children.push(
        <eb-dashboard-widget-group
          key="group"
          ref="group"
          {...{ props }}
          onWidgetRealReady={this.__onWidgetRealReady}
          onWidgetRealDestroy={this.__onWidgetRealDestroy}
        ></eb-dashboard-widget-group>
      );
    } else {
      if (!this.errorMessage && this.ready) {
        // props
        const props = {
          widget: this, // for more extensible
        };
        this.__combineWidgetProps(props);
        children.push(
          c(this.__getFullName(), {
            key: 'widget-inner',
            staticClass: 'widget-inner',
            props,
            style: {
              height: this.__getPropertyRealValue('height'),
            },
            on: {
              'widgetReal:ready': this.__onWidgetRealReady,
              'widgetReal:destroy': this.__onWidgetRealDestroy,
            },
          })
        );
      } else if (this.errorMessage) {
        let domErrorMessage2;
        if (this.errorMessage2) {
          domErrorMessage2 = (
            <f7-link external={true} target="_blank" href={this.errorMessage2}>
              {this.errorMessage2}
            </f7-link>
          );
        }
        children.push(
          <div
            key="errorMessage"
            staticClass="widget-inner widget-inner-error"
            style={{ height: this.__getPropertyRealValue('height') }}
          >
            <div>{this.errorMessage}</div>
            {domErrorMessage2}
          </div>
        );
      }
    }
    // f7-col
    const attrs = {
      'data-widget-id': this.options.id,
    };
    const props = {
      resizable: true,
      resizableHandler: false,
      width: this.__getPropertyRealValue('widthSmall'),
      medium: this.__getPropertyRealValue('widthMedium'),
      large: this.__getPropertyRealValue('widthLarge'),
    };
    return (
      <f7-col staticClass={this.__getClassName()} {...{ attrs }} {...{ props }}>
        {children}
      </f7-col>
    );
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
    resource: {
      type: Object,
    },
    dragdropSceneResize: {
      type: String,
    },
    dragdropScene: {
      type: String,
    },
  },
  data() {
    return {
      ready: false,
      errorMessage: null,
      errorMessage2: null,
    };
  },
  created() {
    this.__init();
  },
  beforeDestroy() {
    this.$emit('widget:destroy');
  },
  methods: {
    async __init() {
      // group
      if (this.options.group) return;
      // fullName
      const fullName = this.__getFullName();
      // resource
      if (!this.resource) {
        this.__setErrorMessage(fullName);
        this.ready = false;
        return;
      }
      // component
      const moduleName = this.resource.resourceConfig.module;
      const componentName = this.resource.resourceConfig.component;
      const module = await this.$meta.module.use(moduleName);
      let component = module.options.components[componentName];
      if (!component) {
        this.__setErrorMessage(fullName);
        this.ready = false;
      } else {
        // uses
        await this.$meta.util.createComponentOptionsUses(component);
        // create
        component = this.$meta.util.createComponentOptions(component);
        this.$options.components[fullName] = component;
        this.__setErrorMessage(null);
        this.ready = true;
      }
    },
    __setErrorMessage(fullName) {
      if (!fullName) {
        this.errorMessage = null;
        this.errorMessage2 = null;
        return;
      }
      // errorMessage
      this.errorMessage = `${this.$text('Widget Not Found')}: ${fullName}`;
      // errorMessage2
      const moduleName = fullName.split(':')[0];
      const entityName = this.$config.widget.errorMessage.moduleMappings[moduleName];
      this.errorMessage2 = entityName ? this.$meta.util.combineStoreUrl(entityName) : null;
    },
    __onWidgetRealReady(widgetReal) {
      this.dashboard.__onWidgetRealReady(this.options.id, widgetReal);
    },
    __onWidgetRealDestroy(widgetReal) {
      this.dashboard.__onWidgetRealDestroy(this.options.id, widgetReal);
    },
    __getBindValue(bind) {
      if (!bind || !bind.widgetId || !bind.propertyName) return undefined;
      const widgetSource = this.dashboard.__getWidgetRealById(bind.widgetId);
      if (!widgetSource) {
        // source not found
        // throw new Error(this.$text('Source Widget Not Found'));
        // maybe load slowly
        return undefined;
      }
      return widgetSource[bind.propertyName];
    },
    __getBindsValue(binds) {
      const values = [];
      for (const bind of binds) {
        if (bind.widgetId && bind.propertyName) {
          const data = this.__getBindValue(bind);
          values.push({
            id: bind.id,
            data,
          });
        }
      }
      return values;
    },
    __getPropertyReal2(options, propertyName) {
      return options.properties[propertyName];
    },
    __getPropertyReal(propertyName) {
      return this.__getPropertyReal2(this.options, propertyName);
    },
    __convertPropertyRealValue(options, propertyName, value) {
      if (value === undefined || value === null) return value;
      const propSchema = this._getPropSchema(options, propertyName);
      if (!propSchema) return value;
      // number, integer, string, boolean, array, object
      switch (propSchema.type) {
        case 'number':
          return Number(value);
        case 'integer':
          return parseInt(value);
        case 'string':
          return value.toString();
        case 'boolean':
          if (value === 'true') return true;
          if (value === 'false') return false;
          return Boolean(value);
        case 'array':
          if (typeof value === 'string') return value.split(',');
          return value;
        default:
          return value;
      }
    },
    __getPropertyRealValue2(options, propertyName) {
      const propertyReal = this.__getPropertyReal2(options, propertyName);
      if (!propertyReal) return undefined;

      let value;
      if (propertyReal.type === 1) {
        // static
        value = propertyReal.value;
      } else if (propertyReal.type === 2) {
        // dynamic
        if (propertyReal.bind) {
          // bind
          value = this.__getBindValue(propertyReal.bind);
        } else if (propertyReal.binds) {
          // binds
          value = this.__getBindsValue(propertyReal.binds);
        }
      }
      // special for title
      if (propertyName === 'title' && !value) {
        if (options.group) {
          value = this.$text('Group');
        } else {
          value = this.dashboard.__findWidgetStock(options).titleLocale;
        }
      }
      // convert
      value = this.__convertPropertyRealValue(options, propertyName, value);
      // ok
      return value;
    },
    __getPropertyRealValue(propertyName) {
      return this.__getPropertyRealValue2(this.options, propertyName);
    },
    __setPropertyRealValue2(options, propertyName, data) {
      if (!data) data = {};
      if (typeof data !== 'object') data = { type: 1, value: data };
      if (!data.type) data.type = 1;
      // old
      const propertyRealOld = options.properties[propertyName] || {};
      // retain the old value
      const propertyRealNew = this.$meta.util.extend({}, propertyRealOld, data);
      this.$set(options.properties, propertyName, propertyRealNew);
      // save
      this.dashboard.__saveLayoutConfig();
      // ok
      return propertyRealNew;
    },
    __setPropertyRealValue(propertyName, data) {
      return this.__setPropertyRealValue2(this.options, propertyName, data);
    },
    // by outer access
    async setPropertyValue(propertyName, data) {
      // create user copy before change profile if needed
      await this.dashboard.__forceDashboardUser();
      // set property
      return this.__setPropertyRealValue(propertyName, data);
    },
    _getPropSchema(options, propertyName) {
      const propsSchema = this._getPropsSchema(options);
      if (propsSchema) {
        const propSchema = propsSchema.properties[propertyName];
        if (propSchema) return propSchema;
      }
      return null;
    },
    _getAttrSchema(options, propertyName) {
      const attrsSchema = this._getAttrsSchema(options);
      if (attrsSchema) {
        const attrSchema = attrsSchema.properties[propertyName];
        if (attrSchema) return attrSchema;
      }
      return null;
    },
    _getAttrsSchema(options) {
      // group
      if (options.group) return this.$options.components['eb-dashboard-widget-group'].options.meta.widget.schema.attrs;
      // widget
      const component = this.$options.components[this.__getFullName(options)];
      const attrsSchema =
        component &&
        component.meta &&
        component.meta.widget &&
        component.meta.widget.schema &&
        component.meta.widget.schema.attrs;
      return attrsSchema || null;
    },
    _getPropsSchema(options) {
      // group
      if (options.group) return this.$options.components['eb-dashboard-widget-group'].options.meta.widget.schema.props;
      // widget
      const component = this.$options.components[this.__getFullName(options)];
      const propsSchema =
        component &&
        component.meta &&
        component.meta.widget &&
        component.meta.widget.schema &&
        component.meta.widget.schema.props;
      return propsSchema || null;
    },
    _getPropsSchemaCategoryGrouping(options) {
      const propsSchema = this._getPropsSchema(options);
      if (!propsSchema) return [null, null];
      const propsCategories = {};
      for (const propertyName in propsSchema.properties) {
        const propSchema = propsSchema.properties[propertyName];
        const ebCategory = this.$meta.util.getPropertyDeprecate(propSchema, 'ebWidget.category', 'ebCategory');
        const category = ebCategory || '';
        if (!propsCategories[category]) propsCategories[category] = {};
        propsCategories[category][propertyName] = propSchema;
      }
      return [propsSchema, propsCategories];
    },
    __combineWidgetProps(props) {
      const propsSchema = this._getPropsSchema(this.options);
      this.__combineWidgetPropsSchema(props, propsSchema);
    },
    __combineWidgetPropsSchema(props, propsSchema) {
      if (!propsSchema) return;
      for (const propertyName in propsSchema.properties) {
        props[propertyName] = this.__getPropertyRealValue(propertyName);
      }
    },
    _getBindSourceTitle(widgetItem) {
      return widgetItem.widgetReal.widget.__getPropertyRealValue('title');
    },
    _getBindSourcePropertyTitle(widgetItem, propertyName) {
      const attrSchema = this._getAttrSchema(widgetItem.widgetReal.widget.options, propertyName);
      if (!attrSchema) return '';
      return this.$text(attrSchema.ebTitle);
    },
    _getBindSourceTitleAndPropertyTitle(widgetId, propertyName) {
      // widget
      const [widgetItem] = this.dashboard.__findWidgetRealById(widgetId);
      if (!widgetItem) return ['', ''];
      // title
      const title = this._getBindSourceTitle(widgetItem);
      // property title
      const propertyTitle = this._getBindSourcePropertyTitle(widgetItem, propertyName);
      // ok
      return [title, propertyTitle];
    },
    __getClassName() {
      if (this.options.group) {
        const classGroup = this.options.widgets.length === 0 ? 'widget-group-empty' : 'widget-group-some';
        return `widget widget-id-${this.options.id} widget-group ${classGroup}`;
      }
      const widgetName = this.options.atomStaticKey || `${this.options.module}:${this.options.name}`;
      return `widget widget-id-${this.options.id} widget-item widget-name-${widgetName}`;
    },
    __getFullName(options) {
      let fullName = this.dashboard.__resourceFullName(options || this.options);
      if (fullName === 'test-party:widgetSimpleChat') {
        fullName = 'test-note:widgetSimpleChat';
      }
      if (fullName === 'a-dashboard:widgetAbout' || fullName === 'test-note:widgetAbout') {
        fullName = 'test-party:widgetAbout';
      }
      return fullName;
    },
    onDragStartResizable({ /* $el,*/ context /* , dragElement*/ }) {
      const $container = this.$$(this.group.$el);
      const size = { width: $container.width() };
      const tooltip = this.__getTooltipResizable(context);
      return { size, tooltip };
    },
    onDragMoveResizable({ /* $el,*/ context, diff }) {
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
    onDragStart({ /* $el,*/ context /* , dragElement*/ }) {
      const [widgetDrag] = this.group.__getWidgetById(context.widgetId);
      const tooltip = `${this.__getPropertyRealValue2(widgetDrag, 'title')}`;
      return { tooltip };
    },
    onDragElement({ /* $el,*/ context }) {
      return this.$$(`.widget-id-${context.widgetId}`);
    },
    onDropElement({ /* $el,*/ context /* , dragElement*/, dragContext }) {
      const [widgetDrop, indexDrop] = this.group.__getWidgetById(context.widgetId);
      const [, /* widgetDrag*/ indexDrag] = this.group.__getWidgetById(dragContext.widgetId);
      if (indexDrop === indexDrag || indexDrop === indexDrag + 1) return null;
      // dropElement
      const dropElement = this.$$(`.widget-id-${context.widgetId}`);
      // tooltip
      const tooltip = this.__getPropertyRealValue2(widgetDrop, 'title');
      // ok
      return { dropElement, tooltip };
    },
    onDropLeave(/* { $el, context, dropElement }*/) {},
    onDropEnter(/* { $el, context, dropElement }*/) {},
    onDragEnd(/* { $el, context, dragElement }*/) {},
    onDragDone({ /* $el,*/ context /* , dragElement, dropElement*/, dropContext }) {
      const [widgetDrag, indexDrag] = this.group.__getWidgetById(context.widgetId);
      // eslint-disable-next-line
      this.group.widgets.splice(indexDrag, 1);
      const [, /* widgetDrop*/ indexDrop] = this.group.__getWidgetById(dropContext.widgetId);
      // eslint-disable-next-line
      this.group.widgets.splice(indexDrop, 0, widgetDrag);
      // save
      this.dashboard.__saveLayoutConfig();
    },
    onWidgetDelete(widget) {
      this.$view.dialog
        .confirm()
        .then(() => {
          const [, /* _widget*/ index] = this.group.__getWidgetById(widget.id);
          if (index === -1) return;
          // eslint-disable-next-line
          this.group.widgets.splice(index, 1);
          // save
          this.dashboard.__saveLayoutConfig();
        })
        .catch(() => {});
    },
    onWidgetProperties(/* widget*/) {
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
  },
};
