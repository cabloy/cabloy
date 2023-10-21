export default {
  methods: {
    _patchItemClassNameStyle({ context, item }) {
      if (!item) return;
      const { property } = context;
      if (property.ebType === 'group' || property.ebType === 'group-flatten') return;
      // use <tag staticClass="xxx"> as the default value, so as to override the grid-col rules
      //    use <tag class="xxx"> to support extend rules
      const staticClassOriginal = item.data.staticClass;
      const className = this._getClassName({ context, classNameDefault: staticClassOriginal });
      const cssStyle = this._getCssStyle({ context });
      const items = Array.isArray(item) ? item : [item];
      for (item of items) {
        if (className && className !== staticClassOriginal) {
          // hold the original item.data.staticClass
          item.data.staticClass = this.$vuef7.utils.classNames(staticClassOriginal, className);
          // item.data.staticClass = className;
        }
        if (cssStyle) {
          if (item.data.style) {
            item.data.style = this.$meta.util.extend({}, item.data.style, cssStyle);
          } else {
            item.data.style = cssStyle;
          }
        }
      }
    },
    _getCssStyle({ context }) {
      const params = context.getParams();
      return params.cssStyle;
    },
    _getClassName({ context, classNameDefault }) {
      const params = context.getParams();
      const className = params.className;
      if (className !== undefined) return className;
      if (classNameDefault !== undefined) return classNameDefault;
      return this._getClassNameDefault({ context });
    },
    _getClassNameDefault({ context }) {
      const paramsDefault = context.getParamsDefault();
      return paramsDefault.className;
    },
  },
};
