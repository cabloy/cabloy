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
    renderCurrency(c, context) {
      const { data, key, property, dataPath } = context;
      const title = this.getTitle(context);
      // value
      const value = this._formatValueCurrency(data[key]);
      if ((this.validate.readOnly || property.ebReadOnly)) {
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
          resizable: false,
          clearButton: !this.validate.readOnly && !property.ebReadOnly,
          dataPath,
          value,
          disabled: this.validate.readOnly || property.ebReadOnly,
        },
        on: {
          input: value => {
            const _value = this._updateValueCurrency(value);
            this.setValue(data, key, _value, property);
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
