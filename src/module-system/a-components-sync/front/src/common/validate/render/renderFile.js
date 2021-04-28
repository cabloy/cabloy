import Vue from 'vue';
export default {
  methods: {
    renderFile(c, context) {
      const { parcel, key, property, dataPath } = context;
      const title = this.getTitle(context);
      const value = context.getValue();
      const mode = property.ebParams.mode;
      if ((this.validate.readOnly || property.ebReadOnly) && !property.ebTextarea) {
        const children = [];
        children.push(c('div', {
          key: 'title',
          slot: 'title',
          staticClass: property.ebReadOnly ? 'text-color-gray' : '',
          domProps: { innerText: title },
        }));
        if (mode === 1 && value) {
          const buttons = [];
          const photoBrowserId = Vue.prototype.$meta.util.nextId('photoBrowser');
          buttons.push(c('eb-button', {
            key: 'button-view',
            domProps: { innerText: this.$text('View') },
            props: {
              onPerform: () => {
                this.$refs[photoBrowserId].open();
              },
            },
          }));
          const photos = [{
            url: value,
            caption: title,
          }];
          buttons.push(c('f7-photo-browser', {
            key: 'photo-browser',
            ref: photoBrowserId,
            props: {
              photos,
              type: 'page',
              exposition: false,
            },
          }));
          children.push(c('div', {
            key: 'value',
            slot: 'after',
          }, buttons));
        } else {
          children.push(c('div', {
            key: 'value',
            slot: 'after',
            staticClass: property.ebReadOnly ? 'text-color-gray' : '',
            domProps: { innerText: value },
          }));
        }
        return c('f7-list-item', {
          key,
          staticClass: property.ebReadOnly ? 'text-color-gray' : '',
        }, children);
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
      // atomId: maybe from host
      let atomId = (this.validate.host && this.validate.host.atomId) || property.ebParams.atomId;
      if (typeof atomId === 'string') {
        atomId = parcel.data[atomId] || 0;
      } else {
        atomId = atomId || 0;
      }
      // attachment
      const attachment = property.ebParams.attachment;
      // flag
      const flag = property.ebParams.flag;
      // accept
      const accept = property.ebParams.accept;
      // fixed
      const fixed = property.ebParams.fixed;
      // buttons
      const buttons = [];
      // view
      if (mode === 1 && value) {
        const photoBrowserId = Vue.prototype.$meta.util.nextId('photoBrowser');
        buttons.push(c('eb-button', {
          key: 'button-view',
          domProps: { innerText: this.$text('View') },
          props: {
            onPerform: () => {
              this.$refs[photoBrowserId].open();
            },
          },
        }));
        const photos = [{
          url: value,
          caption: title,
        }];
        buttons.push(c('f7-photo-browser', {
          key: 'photo-browser',
          ref: photoBrowserId,
          props: {
            photos,
            type: 'page',
            exposition: false,
          },
        }));
      }
      buttons.push(c('eb-button', {
        key: 'button-upload',
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
                    context.setValue(value.downloadUrl);
                  }
                },
              },
            });
          },
        },
      }));
      // children
      const children = [];
      children.push(c('div', {
        key: 'label',
        slot: 'label',
        staticClass: property.ebReadOnly ? 'text-color-gray' : '',
        domProps: { innerText: title },
      }));
      children.push(c('div', {
        key: 'buttons',
        slot: 'root-end',
        staticClass: 'eb-input-file-upload',
      }, buttons));
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
          disabled: this.validate.readOnly || property.ebReadOnly || property.ebDisabled,
        },
        on: {
          input: value => {
            context.setValue(value);
          },
          focus: event => {
            const upload = this.$$(event.target).closest('li').find('.eb-input-file-upload');
            const timeoutId = upload.data('timeoutId');
            if (timeoutId) {
              window.clearTimeout(timeoutId);
              upload.data('timeoutId', 0);
            }
            upload.css('display', 'flex');
            // upload.show();
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
      }, children);
    },
  },
};
