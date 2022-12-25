export default {
  methods: {
    _renderImage_render({ modeView, context }) {
      const { key, property, dataPath } = context;
      const title = this.getTitle(context);
      //
      const placeholder = this.getPlaceholder(context);
      const info = property.ebHelp ? this.$text(property.ebHelp) : undefined;
      // params
      const max = property.ebParams.max || 1;
      // style
      let cellStyle = property.ebParams.cellStyle;
      if (!cellStyle) {
        if (max === 1) {
          cellStyle = { 'max-width': '80%', 'max-height': '100px' };
        } else {
          cellStyle = {
            width: '80px',
            height: '80px',
          };
        }
      }
      const cellStyleAdd = max === 1 ? { width: '80px', height: '80px' } : cellStyle;
      // domImages
      const domImages = [];
      const value2 = context.getValue() || '';
      const images = value2 ? value2.split(',') : [];
      for (let index = 0; index < images.length; index++) {
        const image = images[index];
        let domImage;
        if (max === 1) {
          domImage = (
            <img
              key={index}
              class="image-item image-preview"
              style={cellStyle}
              onClick={event => this._renderImage_preview(event, context, images, index)}
              src={image}
            />
          );
        } else {
          let domImageDelete;
          if (!modeView) {
            domImageDelete = (
              <a class="image-delete" onClick={event => this._renderImage_delete(event, context, images, index)}>
                <f7-icon f7="::close"></f7-icon>
              </a>
            );
          }
          domImage = (
            <a
              key={index}
              class="image-item image-preview"
              style={cellStyle}
              onClick={event => this._renderImage_preview(event, context, images, index)}
            >
              <img src={image} />
              {domImageDelete}
            </a>
          );
        }
        domImages.push(domImage);
        if (!modeView && max === 1) {
          domImages.push(
            <a class="image-delete-single" onClick={event => this._renderImage_delete(event, context, images, index)}>
              <f7-icon f7="::close"></f7-icon>
            </a>
          );
        }
      }
      // domImageAdd
      let domImageAdd;
      if (!modeView && max - images.length > 0) {
        domImageAdd = (
          <a class="image-item image-add" style={cellStyleAdd} onClick={event => this._renderImage_add(event, context)}>
            <f7-icon f7="::add"></f7-icon>
          </a>
        );
      }
      // className
      const className = {
        'eb-list-item-render-image': true,
        'eb-property-view': modeView,
        'eb-property-edit': !modeView,
        'text-color-gray': property.ebReadOnly,
      };
      return (
        <f7-list-item key={key} class={className}>
          <div slot="title" staticClass={property.ebReadOnly ? 'text-color-gray' : ''}>
            {title}
          </div>
          <div slot="root" class="images-container">
            {domImages}
            {domImageAdd}
          </div>
        </f7-list-item>
      );
    },
    _renderImage_preview(event, context, images, index) {
      const { property } = context;
      const title = this.getTitle(context);
      // target
      let target = this.$meta.util.getProperty(property, 'ebParams.target');
      if (target === undefined) target = '_self';
      // photos
      const photos = [];
      for (let index = 0; index < images.length; index++) {
        const image = images[index];
        photos.push({
          url: image,
          caption: title,
        });
      }
      // pageContext
      const pageContext = {
        params: {
          title: this.$text('View'),
          photos,
          activeIndex: index,
        },
      };
      // navigate
      this.$view.navigate(`/a/photobrowser/photoBrowser?t=${Date.now()}`, {
        target,
        context: pageContext,
      });
    },
    _renderImage_delete(event, context, images, index) {
      images.splice(index, 1);
      context.setValue(images.join(','));
    },
    _renderImage_add(event, context) {
      const { property } = context;
      // atomId: maybe from host
      const atomId = this.getAtomId(context);
      // attachment
      const attachment = property.ebParams.attachment;
      // flag
      const flag = property.ebParams.flag;
      // accept
      const accept = property.ebParams.accept;
      // fixed
      const fixed = property.ebParams.fixed;
      // upload
      this.$view.navigate('/a/file/file/upload', {
        target: '_self',
        context: {
          params: {
            mode: 1,
            atomId,
            attachment,
            flag,
            accept,
            fixed,
          },
          callback: (code, value) => {
            if (code === 200) {
              const valueOld = context.getValue() || '';
              const parts = valueOld ? valueOld.split(',') : [];
              parts.push(value.downloadUrl);
              context.setValue(parts.join(','));
            }
          },
        },
      });
    },
    renderImage(context) {
      const { property } = context;
      // view
      if (this.validate.readOnly || property.ebReadOnly) {
        return this._renderImage_render({ modeView: true, context });
      }
      // edit
      return this._renderImage_render({ modeView: false, context });
    },
  },
};
