export default {
  methods: {
    renderAtomClass(c, context) {
      const { parcel, key, property, dataPath } = context;
      const title = this.getTitle(context);
      const value = this.getValue(parcel, key);
      // atomClass
      const atomClass = (value && typeof value === 'string') ? window.JSON5.parse(value) : value;
      // atomClassTitle
      const atomClassBase = this.getAtomClass(atomClass);
      const atomClassTitle = atomClassBase ? atomClassBase.titleLocale : null;
      // readOnly
      if ((this.validate.readOnly || property.ebReadOnly) && !property.ebTextarea) {
        return c('f7-list-item', {
          key,
          staticClass: property.ebReadOnly ? 'text-color-gray' : '',
          attrs: {
            after: atomClassTitle,
          },
        }, [
          c('div', {
            slot: 'title',
            staticClass: property.ebReadOnly ? 'text-color-gray' : '',
            domProps: { innerText: title },
          }),
        ]);
      }
      // edit
      const placeholder = this.getPlaceholder(context);
      const info = property.ebHelp ? this.$text(property.ebHelp) : undefined;
      let type;
      if (property.ebSecure) {
        type = 'password';
      } else if (property.ebTextarea) {
        type = 'textarea';
      } else {
        type = 'text';
      }
      // target
      let target = this.$meta.util.getProperty(property, 'ebParams.target');
      if (target === undefined) target = '_self';
      // optional
      const optional = this.$meta.util.getProperty(property, 'ebParams.optional');
      // render
      return c('eb-list-input', {
        key,
        attrs: {
          floatingLabel: this.$config.form.floatingLabel,
          type,
          placeholder,
          info,
          resizable: property.ebTextarea,
          clearButton: false, // !this.validate.readOnly && !property.ebReadOnly,
          dataPath,
          value: atomClassTitle,
          readonly: true, // always
          disabled: this.validate.readOnly || property.ebReadOnly || property.ebDisabled,
        },
        on: {
          // input: value => {
          //   this.setValue(parcel, key, value);
          // },
          focus: event => {
            const upload = this.$$(event.target).closest('li').find('.eb-input-file-upload');
            const timeoutId = upload.data('timeoutId');
            if (timeoutId) {
              window.clearTimeout(timeoutId);
              upload.data('timeoutId', 0);
            }
            upload.show();
          },
          blur: () => {
            const upload = this.$$(event.target).closest('li').find('.eb-input-file-upload');
            const timeoutId = window.setTimeout(() => {
              upload.data('timeoutId', 0);
              upload.hide();
            }, 300);
            upload.data('timeoutId', timeoutId);
          },
        },
      }, [
        c('div', {
          slot: 'label',
          staticClass: property.ebReadOnly ? 'text-color-gray' : '',
          domProps: { innerText: title },
        }),
        c('eb-button', {
          slot: 'root-end',
          staticClass: 'eb-input-file-upload',
          domProps: { innerText: this.$text('Select') },
          props: {
            onPerform: () => {
              const url = '/a/basefront/atom/selectAtomClass';
              this.$view.navigate(url, {
                target,
                context: {
                  params: {
                    atomClass,
                    optional,
                  },
                  callback: (code, data) => {
                    if (code === 200) {
                      // string
                      let value;
                      if (property.type === 'string') {
                        value = data ? JSON.stringify(data) : null;
                      } else {
                        value = data;
                      }
                      // setValue
                      this.setValue(parcel, key, value);
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
        }),
      ]);
    },
  },
};
