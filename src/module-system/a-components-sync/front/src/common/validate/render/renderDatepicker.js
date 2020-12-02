export default {
  methods: {
    renderDatepicker(c, context) {
      const { data, key, property, dataPath } = context;
      const title = this.getTitle(context);
      // should format date
      // // the form is readOnly
      // if (this.validate.readOnly || property.ebDisabled) {
      //   return c('f7-list-item', {
      //     key,
      //     staticClass: '',
      //     attrs: {
      //       title,
      //       after: data[key] ? data[key].toString() : null,
      //     },
      //   });
      // }
      const placeholder = this.getPlaceholder(context);
      const info = property.ebHelp ? this.$text(property.ebHelp) : undefined;
      // value
      let value = this.getValue(data, key, property);
      if (!value) {
        value = [];
      } else if (!Array.isArray(value)) {
        value = [ value ];
      }
      // input
      return c('eb-list-input', {
        key,
        attrs: {
          floatingLabel: this.$config.form.floatingLabel,
          type: 'datepicker',
          placeholder,
          info,
          resizable: false,
          clearButton: !this.validate.readOnly && !property.ebDisabled,
          dataPath,
          value,
          readonly: true, // always
          disabled: this.validate.readOnly || property.ebDisabled,
        },
        props: {
          calendarParams: property.ebParams,
        },
        on: {
          'calendar:change': values => {
            // date or array of date
            if (property.type === 'array') {
              this.setValue(data, key, values, property);
            } else {
              this.setValue(data, key, values[0] || null, property);
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
