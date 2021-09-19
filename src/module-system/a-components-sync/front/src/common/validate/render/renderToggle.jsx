export default {
  methods: {
    renderToggle(context) {
      const { key, property, dataPath } = context;
      const title = this.getTitle(context);
      // props
      const props = {
        dataPath,
        value: context.getValue(),
        disabled: this.validate.readOnly || property.ebReadOnly,
      };
      return (
        <f7-list-item key={key}>
          <div slot="title" staticClass={property.ebReadOnly ? 'text-color-gray' : ''}>
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
