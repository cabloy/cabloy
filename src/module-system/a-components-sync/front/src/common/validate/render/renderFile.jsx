import Vue from 'vue';
export default {
  methods: {
    renderFile(context) {
      const { parcel, key, property, dataPath } = context;
      const title = this.getTitle(context);
      const value = context.getValue();
      const mode = property.ebParams.mode;
      if ((this.validate.readOnly || property.ebReadOnly) && !property.ebTextarea) {
        const children = [];
        children.push(
          <div key="title" slot="title" staticClass={property.ebReadOnly ? 'text-color-gray' : ''}>
            {title}
          </div>
        );
        if (mode === 1 && value) {
          const buttons = [];
          const photoBrowserId = Vue.prototype.$meta.util.nextId('photoBrowser');
          buttons.push(
            <eb-button
              key="button-view"
              propsOnPerform={() => {
                this.$refs[photoBrowserId].open();
              }}
            >
              {this.$text('View')}
            </eb-button>
          );
          const photos = [
            {
              url: value,
              caption: title,
            },
          ];
          buttons.push(
            <f7-photo-browser
              key="photo-browser"
              ref={photoBrowserId}
              photos={photos}
              type="page"
              exposition={false}
            ></f7-photo-browser>
          );
          children.push(
            <div key="value" slot="after">
              {buttons}
            </div>
          );
        } else {
          children.push(
            <div key="value" slot="after" staticClass={property.ebReadOnly ? 'text-color-gray' : ''}>
              {value}
            </div>
          );
        }
        return (
          <f7-list-item key={key} staticClass={property.ebReadOnly ? 'text-color-gray' : ''}>
            {children}
          </f7-list-item>
        );
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
        buttons.push(
          <eb-button
            key="button-view"
            propsOnPerform={() => {
              this.$refs[photoBrowserId].open();
            }}
          >
            {this.$text('View')}
          </eb-button>
        );
        const photos = [
          {
            url: value,
            caption: title,
          },
        ];
        buttons.push(
          <f7-photo-browser
            key="photo-browser"
            ref={photoBrowserId}
            photos={photos}
            type="page"
            exposition={false}
          ></f7-photo-browser>
        );
      }
      buttons.push(
        <eb-button
          key="button-upload"
          propsOnPerform={() => {
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
          }}
        >
          {this.$text('Upload')}
        </eb-button>
      );
      // children
      const children = [];
      children.push(
        <div key="label" slot="label" staticClass={property.ebReadOnly ? 'text-color-gray' : ''}>
          {title}
        </div>
      );
      children.push(
        <div key="buttons" slot="root-end" staticClass="eb-input-file-upload">
          {buttons}
        </div>
      );
      const props = {
        floatingLabel: this.$config.form.floatingLabel,
        type,
        placeholder,
        info,
        resizable: property.ebTextarea,
        clearButton: false, // !this.validate.readOnly && !property.ebReadOnly,
        dataPath,
        value,
        disabled: this.validate.readOnly || property.ebReadOnly || property.ebDisabled,
      };
      const on = {
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
      };
      // render
      return (
        <eb-list-input key={key} {...{ props, on }}>
          {children}
        </eb-list-input>
      );
    },
  },
};
