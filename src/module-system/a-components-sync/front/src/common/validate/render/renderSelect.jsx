export default {
  methods: {
    renderSelect(c, context) {
      const { key, property, dataPath } = context;
      // title
      const title = context.getTitle();
      // value
      const valueCurrent = context.getValue();
      // attrs
      const readOnly = this.validate.readOnly || property.ebReadOnly;
      const attrs = {
        name: key,
        dataPath,
        value: valueCurrent,
        readOnly,
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
      return c(
        'eb-list-item',
        {
          key,
          props: {
            smartSelect: !readOnly,
            // title,
            smartSelectParams: property.ebParams || { openIn: 'page', closeOnSelect: true },
          },
        },
        [
          c('div', {
            slot: 'title',
            staticClass: property.ebReadOnly ? 'text-color-gray' : '',
            domProps: { innerText: title },
          }),
          c('eb-select', {
            slot: readOnly ? 'after' : null,
            attrs,
            on: {
              input: value => {
                context.setValue(value);
              },
            },
          }),
        ]
      );
    },
  },
};
