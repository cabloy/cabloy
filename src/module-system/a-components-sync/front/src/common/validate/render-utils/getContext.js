export default {
  methods: {
    getContext({ parcel, key, property, meta, index, groupCount, groupWhole }) {
      // dataPath
      const dataPath = parcel.pathParent + key;
      // property
      property = this._combinePropertyMeta({ property, meta, dataPath });
      // patch getValue/setValue
      const patchGetValue = this.$meta.util.getProperty(property, 'ebPatch.getValue');
      const patchSetValue = this.$meta.util.getProperty(property, 'ebPatch.setValue');
      const patchGetValueGlobal = this.$meta.util.getProperty(this.validate, 'meta.ebPatch.getValue');
      const patchSetValueGlobal = this.$meta.util.getProperty(this.validate, 'meta.ebPatch.setValue');
      // context
      const context = {
        validate: this.validate,
        validateItem: this,
        parcel,
        key,
        property,
        dataPath,
        meta,
        index,
        groupCount,
        renderTitle: ({ key, slot, notHint }) => {
          return this.renderTitle(context, { key, slot, notHint });
        },
        getTitle: notHint => {
          return this.getTitle(context, notHint);
        },
        getValue: name => {
          const propertyName = name || key;
          let value = this.getValue(parcel, propertyName);
          if (patchGetValue && (!name || name === key)) {
            // only patch this
            value = patchGetValue(value);
          }
          if (patchGetValueGlobal) {
            value = patchGetValueGlobal(value, propertyName);
          }
          return value;
        },
        setValue: (value, name) => {
          const propertyName = name || key;
          if (patchSetValueGlobal) {
            value = patchSetValueGlobal(value, propertyName);
          }
          if (patchSetValue && (!name || name === key)) {
            // only patch this
            value = patchSetValue(value);
          }
          this.setValue(parcel, propertyName, value);
        },
        getComponentInstance: name => {
          const propertyName = name || key;
          return this.__componentInstance_get(parcel, propertyName);
        },
        setComponentInstance: (componentInstance, name) => {
          const propertyName = name || key;
          this.__componentInstance_set(parcel, propertyName, componentInstance);
        },
        removeComponentInstance: (componentInstance, name) => {
          const propertyName = name || key;
          this.__componentInstance_remove(parcel, propertyName, componentInstance);
        },
      };
      context.getParams = () => {
        if (!context._params) {
          const scope = this._getCascadeScope({ context, groupWhole });
          context._params = this.$meta.util.cascadeExtend({ scope, source: property, name: 'ebParams' }) || {};
        }
        return context._params;
      };
      context.getParamsDefault = () => {
        if (!context._paramsDefault) {
          const scope = this._getCascadeScope({ context, groupWhole });
          const source = this.$config.validate.cascadeParams.default;
          context._paramsDefault = this.$meta.util.cascadeExtend({ scope, source, name: 'ebParams' }) || {};
        }
        return context._paramsDefault;
      };
      context.getClassName = () => {
        const params = context.getParams();
        const className = params.className;
        if (className === undefined) {
          return this._getClassNameDefault({ context });
        }
        return className;
      };
      context.getCssStyle = () => {
        const params = context.getParams();
        return params.cssStyle;
      };
      context.getReadOnly = () => {
        return this.validate.readOnly || property.ebReadOnly;
      };
      return context;
    },
    _getClassNameDefault({ context }) {
      const paramsDefault = context.getParamsDefault();
      return paramsDefault.className;
    },
    _getCascadeScope({ context, groupWhole }) {
      const scope = {};
      // groupWhole
      if (groupWhole) {
        scope.groupWhole = true;
      } else {
        scope.group = true;
      }
      // mobile/pc
      scope[this.$meta.vueApp.layout] = true;
      // small/medium/large
      scope[this.$view.size] = true;
      // readOnly: view/edit
      const readOnly = context.getReadOnly();
      if (readOnly) {
        scope.view = true;
      } else {
        scope.edit = true;
      }
      // ok
      return scope;
    },
    _patchItemClassNameStyle({ context, item }) {
      const { property } = context;
      if (property.ebType === 'group' || property.ebType === 'group-flatten') return;
      const className = context.getClassName();
      const cssStyle = context.getCssStyle();
      const items = Array.isArray(item) ? item : [item];
      for (item of items) {
        if (className) {
          item.data.staticClass = this.$vuef7.utils.classNames(item.data.staticClass, className);
        }
        if (cssStyle) {
        }
      }
    },
  },
};
