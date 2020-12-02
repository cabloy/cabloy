export default {
  methods: {
    renderToggle(c, context) {
      const { data, key, property, dataPath } = context;
      const title = this.getTitle(context);
      return c('f7-list-item', {
        key,
      }, [
        c('div', {
          slot: 'title',
          staticClass: property.ebReadOnly ? 'text-color-gray' : '',
          domProps: { innerText: title },
        }),
        c('eb-toggle', {
          slot: 'after',
          attrs: {
            dataPath,
            value: this.getValue(data, key, property),
            disabled: this.validate.readOnly || property.ebReadOnly,
          },
          on: {
            input: value => {
              this.setValue(data, key, value, property);
            },
          },
        }),
      ]);
    },
  },
};
