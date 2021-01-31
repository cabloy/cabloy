export default {
  methods: {
    renderFile(c, context) {
      const { data, key, property, dataPath, meta } = context;
      const title = this.getTitle(context);
      if ((this.validate.readOnly || property.ebReadOnly) && !property.ebTextarea) {
        return c('f7-list-item', {
          key,
          staticClass: property.ebReadOnly ? 'text-color-gray' : '',
          attrs: {
            after: data[key] ? data[key].toString() : null,
          },
        }, [
          c('div', {
            slot: 'title',
            staticClass: property.ebReadOnly ? 'text-color-gray' : '',
            domProps: { innerText: title },
          }),
        ]);
      }
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
      // mode
      const mode = this.getMetaValue(meta, 'mode', dataPath) || property.ebParams.mode;
      // atomId
      const atomId = this.getMetaValue(meta, 'atomId', dataPath) || property.ebParams.atomId || 0;
      // attachment
      const attachment = this.getMetaValue(meta, 'attachment', dataPath) || property.ebParams.attachment;
      // flag
      const flag = this.getMetaValue(meta, 'flag', dataPath) || property.ebParams.flag;
      // accept
      const accept = this.getMetaValue(meta, 'accept', dataPath) || property.ebParams.accept;
      // fixed
      const fixed = this.getMetaValue(meta, 'fixed', dataPath) || property.ebParams.fixed;
      // render
      return c('eb-list-input', {
        key,
        attrs: {
          floatingLabel: this.$config.form.floatingLabel,
          type,
          placeholder,
          info,
          resizable: property.ebTextarea,
          clearButton: !this.validate.readOnly && !property.ebReadOnly,
          dataPath,
          value: this.getValue(data, key, property),
          disabled: this.validate.readOnly || property.ebReadOnly,
        },
        on: {
          input: value => {
            this.setValue(data, key, value, property);
          },
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
          domProps: { innerText: this.$text('Upload') },
          props: {
            onPerform: () => {
              this.$view.navigate('/a/file/file/upload', {
                target: '_self',
                context: {
                  params: {
                    mode,
                    atomId,
                    attachment,
                    flag,
                    accept,
                    fixed,
                  },
                  callback: (code, value) => {
                    if (code === 200) {
                      this.setValue(data, key, value.downloadUrl, property);
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
