export default {
  methods: {
    renderDatepicker(c, context) {
      const { key, property, dataPath } = context;
      const title = this.getTitle(context);
      // value
      let value = context.getValue();
      if (!value) {
        value = [];
      } else if (!Array.isArray(value)) {
        value = [ value ];
      }
      // should format date
      // // the form is readOnly
      // if (this.validate.readOnly || property.ebDisabled) {
      //   return c('f7-list-item', {
      //     key,
      //     staticClass: '',
      //     attrs: {
      //       title,
      //       after: value,
      //     },
      //   });
      // }
      const placeholder = this.getPlaceholder(context);
      const info = property.ebHelp ? this.$text(property.ebHelp) : undefined;
      // input
      return c('eb-list-input', {
        key,
        attrs: {
          floatingLabel: this.$config.form.floatingLabel,
          type: 'datepicker',
          placeholder,
          info,
          resizable: false,
          clearButton: !this.validate.readOnly && !property.ebReadOnly && !property.ebDisabled,
          dataPath,
          value,
          readonly: true, // always
          disabled: this.validate.readOnly || property.ebReadOnly || property.ebDisabled,
        },
        props: {
          calendarParams: property.ebParams,
        },
        on: {
          'calendar:change': values => {
            // date or array of date
            if (property.type === 'array') {
              context.setValue(values);
            } else {
              context.setValue(values[0] || null);
            }
          },
        },
      }, [
        c('div', {
          slot: 'label',
          staticClass: property.ebReadOnly ? 'text-color-gray' : '',
          domProps: { innerText: title },
        }),
      ]);
    },
  },
};
