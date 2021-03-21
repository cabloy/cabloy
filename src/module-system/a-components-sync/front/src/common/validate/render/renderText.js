export default {
  methods: {
    _formatValueCurrency(value) {
      if (isNaN(value)) return value;
      return (Number(value) / 100).toFixed(2);
    },
    _updateValueCurrency(value) {
      if (isNaN(value)) return value;
      return (Number(value) * 100).toFixed(0);
    },
    renderText(c, context) {
      const { parcel, key, property, dataPath } = context;
      const title = this.getTitle(context);
      let value = this.getValue(parcel, key);
      // currency
      if (property.ebCurrency) {
        value = this._formatValueCurrency(value);
      }
      // render
      if ((this.validate.readOnly || property.ebReadOnly) && !property.ebTextarea) {
        return c('f7-list-item', {
          key,
          staticClass: '',
          attrs: {
            after: value,
          },
        }, [
          c('div', {
            slot: 'title',
            staticClass: property.ebReadOnly ? 'text-color-gray' : '',
            domProps: { innerText: title },
          }),
        ]);
      }
      const placeholder = this.getPlaceholder(context);
      const info = property.ebHelp ? this.$text(property.ebHelp) : undefined;
      let type;
      if (property.ebSecure) {
        type = 'password';
      } else if (property.ebTextarea) {
        type = 'textarea';
      } else if (property.ebInputType) {
        type = property.ebInputType;
      } else {
        type = 'text';
      }
      return c('eb-list-input', {
        key,
        attrs: {
          floatingLabel: this.$config.form.floatingLabel,
          type,
          placeholder,
          info,
          resizable: property.ebTextarea,
          clearButton: !this.validate.readOnly && !property.ebReadOnly,
          dataPath,
          value,
          disabled: this.validate.readOnly || property.ebReadOnly,
        },
        on: {
          input: value => {
            if (property.ebCurrency) {
              value = this._updateValueCurrency(value);
            }
            this.setValue(parcel, key, value);
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
