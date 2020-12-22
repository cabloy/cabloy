export default {
  methods: {
    renderJson(c, context) {
      const { data, key, property /* dataPath, meta*/ } = context;
      const title = this.getTitle(context);
      return c('eb-list-item', {
        key,
        staticClass: property.ebReadOnly ? 'text-color-gray' : '',
        props: {
          link: '#',
          onPerform: () => {
            let target = this.$meta.util.getProperty(property, 'ebParams.target');
            if (target === undefined) target = '_self';
            this.$view.navigate('/a/basefront/json/editor', {
              target,
              context: {
                params: {
                  value: this.getValue(data, key, property),
                  title,
                  readOnly: this.validate.readOnly || property.ebReadOnly,
                },
                callback: (code, value) => {
                  if (code === 200) {
                    this.setValue(data, key, value, property);
                    // submit
                    if (property.ebAutoSubmit !== false) {
                      this.validate.onSubmit();
                    }
                  }
                },
              },
            });
          },
        },
      }, [
        c('div', {
          slot: 'title',
          staticClass: property.ebReadOnly ? 'text-color-gray' : '',
          domProps: { innerText: title },
        }),
      ]);
    },
  },
};
