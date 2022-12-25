export default {
  methods: {
    _renderImage_render({ modeView, context }) {
      const { parcel, key, property, dataPath } = context;
      const title = this.getTitle(context);
      const value = context.getValue();
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
      const value2 = value || '';
      const images = value2 ? value2.split(',') : [];
      for (const image of images) {
        domImages.push(
          <a
            class="box-grid-cell image-preview"
            style={cellStyle}
            onClick={event => this._renderImage_preview(event, context, image)}
          >
            <img src={image} />
            <a class="image-delete">
              <f7-icon f7="::close"></f7-icon>
            </a>
          </a>
        );
      }
      // domImageAdd
      let domImageAdd;
      if (!modeView && max - images.length > 0) {
        domImageAdd = (
          <a
            class="box-grid-cell image-add"
            style={cellStyleAdd}
            onClick={event => this._renderImage_add(event, context)}
          >
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
          <div slot="root" class="eb-box-grid-row images-container">
            {domImages}
            {domImageAdd}
          </div>
        </f7-list-item>
      );
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
              context.setValue(value.downloadUrl);
            }
          },
        },
      });
    },
    renderImage(context) {
      const { parcel, key, property, dataPath } = context;
      const title = this.getTitle(context);
      const value = context.getValue();
      // view
      if (this.validate.readOnly || property.ebReadOnly) {
        return this._renderImage_render({ modeView: true, context });
      }
      // edit
      return this._renderImage_render({ modeView: false, context });
    },
  },
};
