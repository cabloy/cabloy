export default {
  methods: {
    _renderToggleOnClick(event, context) {
      const { property } = context;
      const disabled = this.validate.readOnly || property.ebReadOnly;
      if (disabled) return;
      const value = context.getValue();
      context.setValue(!value);
    },
    renderToggle(context) {
      const { key, property, dataPath } = context;
      const title = this.getTitle(context);
      const disabled = this.validate.readOnly || property.ebReadOnly;
      // props
      const props = {
        dataPath,
        value: context.getValue(),
        disabled,
      };
      // className
      let className = '';
      if (property.ebReadOnly) {
        className = 'text-color-gray';
      } else if (!disabled) {
        className = 'eb-cursor-pointer';
      }
      return (
        <f7-list-item key={key}>
          <div slot="title" class={className} onClick={event => this._renderToggleOnClick(event, context)}>
            {title}
          </div>
          <eb-toggle
            slot="after"
            {...{ props }}
            onInput={value => {
              context.setValue(value);
            }}
          ></eb-toggle>
        </f7-list-item>
      );
    },
  },
};
