export default {
  methods: {
    _formatValueCurrency(value) {
      if (isNaN(value)) return value;
      return (Number(value) / 100).toFixed(2);
    },
    _updateValueCurrency(value) {
      if (isNaN(value)) return value;
      return Number((Number(value) * 100).toFixed(0));
    },
    renderText(context) {
      const { key, property, dataPath } = context;
      const title = this.getTitle(context);
      let value = context.getValue();
      // currency
      if (property.ebCurrency) {
        value = this._formatValueCurrency(value);
      }
      // locale
      if (property.ebLocale) {
        value = this.$text(value);
      }
      // date
      if (property.ebDateFormat) {
        value = this.$meta.util.formatDateTime(value, property.ebDateFormat);
      }
      // render
      if ((this.validate.readOnly || property.ebReadOnly) && !property.ebTextarea) {
        return (
          <f7-list-item key={key} staticClass="" after={value}>
            <div slot="title" staticClass={property.ebReadOnly ? 'text-color-gray' : ''}>
              {title}
            </div>
          </f7-list-item>
        );
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
      // props
      const props = {
        floatingLabel: this.$config.form.floatingLabel,
        type,
        placeholder,
        info,
        resizable: property.ebTextarea,
        clearButton: !this.validate.readOnly && !property.ebReadOnly && !property.ebDisabled,
        dataPath,
        value,
        disabled: this.validate.readOnly || property.ebReadOnly || property.ebDisabled,
      };
      return (
        <eb-list-input
          key={key}
          {...{ props }}
          onInput={valueNew => {
            if (property.ebCurrency) {
              valueNew = this._updateValueCurrency(valueNew);
            }
            context.setValue(valueNew);
          }}
        >
          <div slot="label" staticClass={property.ebReadOnly ? 'text-color-gray' : ''}>
            {title}
          </div>

          {!!property.ebSearch && (
            <div slot="after-title" staticClass={property.ebReadOnly ? 'after-title after-title-search text-color-gray' : 'after-title after-title-search'}>
              {this.__searchStates_render(context)}
            </div>
          )}
        </eb-list-input>
      );
    },
  },
};
