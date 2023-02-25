export default {
  methods: {
    renderDatePicker(context) {
      const { key, property, dataPath } = context;
      // value
      let value = context.getValue();
      if (!value) {
        value = [];
      } else if (!Array.isArray(value)) {
        value = [value];
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
      const props = {
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
        calendarParams: property.ebParams,
      };
      // input
      return (
        <eb-list-input
          key={key}
          {...{ props }}
          onCalendarChange={values => {
            // date or array of date
            if (property.type === 'array') {
              context.setValue(values);
            } else {
              context.setValue(values[0] || null);
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
