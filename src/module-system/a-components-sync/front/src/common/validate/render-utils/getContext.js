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
      context.renderTitle = ({ key, slot, notHint }) => {
        return this.renderTitle(context, { key, slot, notHint });
      };
      context.getTitle = notHint => {
        return this.getTitle(context, notHint);
      };
      context.getValue = name => {
        const propertyName = name || key;
        let value = this.getValue(parcel, propertyName);
        if (patchGetValue && (!name || name === key)) {
          // only patch this
          value = patchGetValue(value, context);
        }
        if (patchGetValueGlobal) {
          value = patchGetValueGlobal(value, propertyName, context);
        }
        return value;
      };
      context.setValue = (value, name) => {
        const propertyName = name || key;
        if (patchSetValueGlobal) {
          value = patchSetValueGlobal(value, propertyName, context);
        }
        if (patchSetValue && (!name || name === key)) {
          // only patch this
          value = patchSetValue(value, context);
        }
        this.setValue(parcel, propertyName, value);
      };
      context.getParams = () => {
        if (!context._params) {
          const scope = this.getCascadeScope({ context, groupWhole });
          context._params = this.$meta.util.cascadeExtend({ scope, source: property, name: 'ebParams' }) || {};
        }
        return context._params;
      };
      context.getParamsDefault = () => {
        if (!context._paramsDefault) {
          const scope = this.getCascadeScope({ context, groupWhole });
          const source = this.$config.validate.cascadeParams.default;
          context._paramsDefault = this.$meta.util.cascadeExtend({ scope, source, name: 'ebParams' }) || {};
        }
        return context._paramsDefault;
      };
      context.getReadOnly = () => {
        return this.validate.readOnly || property.ebReadOnly;
      };
      return context;
    },
  },
};
