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
          context._params = property.ebParams || {};
        }
        return context._params;
      };
      context.getClassName = () => {
        const params = context.getParams();
        const className = params.className;
        if (className === undefined) {
          return this._getClassNameDefault({ context, groupWhole });
        }
        return className;
      };
      return context;
    },
    _getClassNameDefault({ context, groupWhole }) {},
    _getCascadeScope({ groupWhole }) {
      const scope = {};
      // groupWhole
      if (groupWhole) {
        scope.groupWhole = true;
      } else {
        scope.group = true;
      }
      // mobile/pc
      if (this.$meta.vueApp.layout === 'pc') {
        scope.pc = true;
      } else {
        scope.mobile = true;
      }
      // small/medium/large
    },
  },
};
