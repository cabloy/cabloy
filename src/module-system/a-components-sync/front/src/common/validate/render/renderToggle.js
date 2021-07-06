export default {
  methods: {
    renderToggle(c, context) {
      const { key, property, dataPath } = context;
      const title = this.getTitle(context);
      return c(
        'f7-list-item',
        {
          key,
        },
        [
          c('div', {
            slot: 'title',
            staticClass: property.ebReadOnly ? 'text-color-gray' : '',
            domProps: { innerText: title },
          }),
          c('eb-toggle', {
            slot: 'after',
            attrs: {
              dataPath,
              value: context.getValue(),
              disabled: this.validate.readOnly || property.ebReadOnly,
            },
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
