export default {
  methods: {
    renderAtom(c, context) {
      const { parcel, key, property, dataPath, meta } = context;
      const title = this.getTitle(context);
      const value = this.getValue(parcel, key, property);
      if ((this.validate.readOnly || property.ebReadOnly) && !property.ebTextarea) {
        return c('f7-list-item', {
          key,
          staticClass: property.ebReadOnly ? 'text-color-gray' : '',
          attrs: {
            after: value,
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
      // target
      const target = this.getMetaValue(meta, 'target', dataPath) || property.ebParams.target;
      // atomClass
      const atomClass = this.getMetaValue(meta, 'atomClass', dataPath) || property.ebParams.atomClass;
      // selectOptions
      const selectOptions = this.getMetaValue(meta, 'selectOptions', dataPath) || property.ebParams.selectOptions;
      // atomId
      let atomId = this.getMetaValue(meta, 'atomId', dataPath) || property.ebParams.atomId;
      if (typeof atomId === 'string') {
        atomId = parcel.data[atomId] || 0;
      } else {
        atomId = atomId || 0;
      }
      // mapper
      const mapper = this.getMetaValue(meta, 'mapper', dataPath) || property.ebParams.mapper;
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
          value,
          disabled: this.validate.readOnly || property.ebReadOnly,
        },
        on: {
          input: value => {
            this.setValue(parcel, key, value, property);
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
          domProps: { innerText: this.$text('Select') },
          props: {
            onPerform: () => {
              const url = '/a/basefront/atom/select';
              this.$view.navigate(url, {
                target,
                context: {
                  params: {
                    selectMode: 'single',
                    selectedAtomId: atomId,
                    atomClass,
                    options: selectOptions,
                  },
                  callback: (code, selectedAtom) => {
                    if (code === 200) {
                      // mapper
                      for (const key in mapper) {
                        const value = selectedAtom[mapper[key]];
                        this.setValue(parcel, key, value, property);
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
