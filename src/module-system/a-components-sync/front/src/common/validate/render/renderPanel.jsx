export default {
  methods: {
    renderPanel(context) {
      let { key, property, dataPath } = context;
      // panelMeta
      const panelMeta = this.$meta.util.getProperty(property, 'ebParams.meta');
      const title = this.getTitle(context);
      const value = context.getValue();
      // dataPath
      dataPath = dataPath + '/';
      // props
      const props = {
        link: '#',
        title,
        dataPath,
      };
      const on = {
        click: () => {
          this._renderPanel_onClick(context, panelMeta, title, value);
        },
      };
      return <eb-list-item-panel key={key} {...{ props, on }}></eb-list-item-panel>;
    },
    _renderPanel_onClick(context, panelMeta, title, value) {
      const { property, dataPath } = context;
      // schemaSub
      let schemaSub;
      const metaSchema = this.validate.meta && this.validate.meta.schema;
      if (metaSchema) {
        schemaSub = {
          module: metaSchema.module,
          validator: metaSchema.validator,
          schema: property.$ref,
        };
      } else {
        schemaSub = {
          module: this.validate.params.module,
          validator: this.validate.params.validator,
          schema: property.$ref,
        };
      }
      // errors
      const verrors = this.validate.verrors;
      // target
      let target = this.$meta.util.getProperty(property, 'ebParams.target');
      if (target === undefined) target = '_self';
      // navigate
      this.$view.navigate(`/a/validation/validate?t=${Date.now()}`, {
        target,
        context: {
          params: {
            host: this.validate.host,
            params: schemaSub,
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
};
