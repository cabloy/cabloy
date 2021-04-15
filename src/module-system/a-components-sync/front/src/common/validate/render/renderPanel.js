export default {
  methods: {
    renderPanel(c, context) {
      let { key, property, dataPath } = context;
      // panelMeta
      const panelMeta = this.$meta.util.getProperty(property, 'ebParams.meta');
      const title = this.getTitle(context);
      const value = context.getValue();
      // dataPath
      dataPath = dataPath + '/';
      return c('eb-list-item-panel', {
        key,
        attrs: {
          link: '#',
          title,
          dataPath,
        },
        on: {
          click: () => {
            const params = this.validate.params;
            const verrors = this.validate.verrors;
            let target = this.$meta.util.getProperty(property, 'ebParams.target');
            if (target === undefined) target = '_self';
            this.$view.navigate('/a/validation/validate', {
              target,
              context: {
                params: {
                  host: this.validate.host,
                  params: {
                    module: params.module,
                    validator: params.validator,
                    schema: property.$ref,
                  },
                  meta: panelMeta,
                  title,
                  data: value,
                  dataPathRoot: this.adjustDataPath(dataPath),
                  errors: verrors ? verrors.slice(0) : null,
                  readOnly: this.validate.readOnly || property.ebReadOnly,
                },
                callback: (code, res) => {
                  if (code === 200) {
                    context.setValue(res.data);
                    this.validate.verrors = res.errors;
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
      });
    },
  },
};
