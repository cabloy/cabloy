export default {
  methods: {
    renderSelect(c, context) {
      const { key, property, dataPath } = context;
      // patch getValue/setValue
      const patchGetValue = this.$meta.util.getProperty(property, 'ebPatch.getValue');
      const patchSetValue = this.$meta.util.getProperty(property, 'ebPatch.setValue');
      // title
      const title = context.getTitle();
      // value
      const valueCurrent = patchGetValue ? patchGetValue() : context.getValue();
      // attrs
      const attrs = {
        name: key,
        dataPath,
        value: valueCurrent,
        readOnly: this.validate.readOnly || property.ebReadOnly,
      };
      if (property.ebOptions) attrs.options = property.ebOptions;
      if (property.ebOptionsUrl) {
        attrs.optionsUrl = property.ebOptionsUrl;
        attrs.optionsUrlParams = property.ebOptionsUrlParams;
      }
      attrs.optionsBlankAuto = property.ebOptionsBlankAuto;
      if (property.ebOptionTitleKey) attrs.optionTitleKey = property.ebOptionTitleKey;
      if (property.ebOptionValueKey) attrs.optionValueKey = property.ebOptionValueKey;
      if (property.ebMultiple) attrs.multiple = property.ebMultiple;
      // specially, not showing blank option when notEmpty and has value
      if (property.notEmpty && !this.checkIfEmptyForSelect(valueCurrent)) {
        attrs.optionsBlankAuto = false;
        if (attrs.options && attrs.options.length > 0) {
          // not check group
          const opt = attrs.options[0];
          if (opt && !opt.options && this.checkIfEmptyForSelect(opt.value)) {
            attrs.options.shift();
          }
        }
      }
      // render
      return c('eb-list-item', {
        key,
        attrs: {
          smartSelect: !this.validate.readOnly && !property.ebReadOnly,
          // title,
          smartSelectParams: property.ebParams || { openIn: 'page', closeOnSelect: true },
        },
      }, [
        c('div', {
          slot: 'title',
          staticClass: property.ebReadOnly ? 'text-color-gray' : '',
          domProps: { innerText: title },
        }),
        c('eb-select', {
          attrs,
          on: {
            input: value => {
              patchSetValue ? patchSetValue(value) : context.setValue(value);
            },
          },
        }),
      ]);
    },
  },
};
