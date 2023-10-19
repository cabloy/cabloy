// Deprecate: ebCurrency\ebLocale\ebDateFormat\ebTextarea\ebSecure\ebInputType
export default {
  methods: {
    _formatValueCurrency(value, currencyOptions) {
      const currency = this.$meta.util.currency(currencyOptions);
      return currency.format(value);
    },
    _updateValueCurrency(value, currencyOptions) {
      const currency = this.$meta.util.currency(currencyOptions);
      return currency.update(value);
    },
    _formatTextGeneral(property, value) {
      if (this.checkIfEmptyForSelect(value)) return value;
      // currency
      const ebCurrency = this.$meta.util.getPropertyDeprecate(property, 'ebParams.currency', 'ebCurrency');
      if (ebCurrency) {
        value = this._formatValueCurrency(value, ebCurrency);
      }
      // locale
      const ebLocale = this.$meta.util.getPropertyDeprecate(property, 'ebParams.locale', 'ebLocale');
      if (ebLocale) {
        value = this.$text(value);
      }
      // date
      const ebDateFormat = this.$meta.util.getPropertyDeprecate(property, 'ebParams.dateFormat', 'ebDateFormat');
      if (ebDateFormat) {
        value = this.$meta.util.formatDateTime(value, ebDateFormat);
      }
      return value;
    },
    _formatTextView(value) {
      if (value === undefined || value === null) return '';
      return String(value); // 0
    },
    renderText(context) {
      const { key, property, dataPath } = context;
      let value = context.getValue();
      // params
      const ebCurrency = this.$meta.util.getPropertyDeprecate(property, 'ebParams.currency', 'ebCurrency');
      const ebTextarea = this.$meta.util.getPropertyDeprecate(property, 'ebParams.textarea', 'ebTextarea');
      const ebSecure = this.$meta.util.getPropertyDeprecate(property, 'ebParams.secure', 'ebSecure');
      const ebInputType = this.$meta.util.getPropertyDeprecate(property, 'ebParams.inputType', 'ebInputType');
      const ebInputMode = this.$meta.util.getPropertyDeprecate(property, 'ebParams.inputMode', 'ebInputMode');
      const ebImmediate = this.$meta.util.getPropertyDeprecate(property, 'ebParams.immediate', 'ebImmediate');
      const immediate = ebImmediate !== false && !ebCurrency;
      // format
      value = this._formatTextGeneral(property, value);
      // render
      if ((this.validate.readOnly || property.ebReadOnly) && !ebTextarea) {
        const valueView = this._formatTextView(value);
        return (
          <f7-list-item key={key} staticClass="" after={valueView}>
            {context.renderTitle({ slot: 'title' })}
          </f7-list-item>
        );
      }
      const placeholder = this.getPlaceholder(context);
      const info = property.ebHelp ? this.$text(property.ebHelp) : undefined;
      let type;
      if (ebSecure) {
        type = 'password';
      } else if (ebTextarea) {
        type = 'textarea';
      } else if (ebInputType) {
        type = ebInputType;
      } else {
        type = 'text';
      }
      // props
      const props = {
        floatingLabel: this.$config.form.floatingLabel,
        type,
        inputmode: ebInputMode,
        placeholder,
        info,
        resizable: ebTextarea,
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
            if (immediate) {
              context.setValue(valueNew);
            }
          }}
          onChange={valueNew => {
            if (!immediate) {
              if (ebCurrency) {
                valueNew = this._updateValueCurrency(valueNew, ebCurrency);
              }
              context.setValue(valueNew);
            }
          }}
        >
          {context.renderTitle({ slot: 'label' })}
          {this.__searchStates_render_list_item(context)}
        </eb-list-input>
      );
    },
  },
};
