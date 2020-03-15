export default function(Vue, bGroup) {
  // widths
  const _colWidths = [ 5, 10, 15, 20, 25, 30, 33, 35, 40, 45, 50, 55, 60, 65, 66, 70, 75, 80, 85, 90, 95, 100 ];
  const _widthOptions = [];
  for (const width of _colWidths) {
    _widthOptions.push({ title: `${width}%`, value: width });
  }

  // schema prop group
  const schemaPropsGroup = {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Title',
        ebClue: 'title',
      },
      widthSmall: {
        type: 'integer',
        ebType: 'select',
        ebTitle: 'Width(Small)',
        ebOptions: _widthOptions,
        ebClue: 'width',
      },
      widthMedium: {
        type: 'integer',
        ebType: 'select',
        ebTitle: 'Width(Medium)',
        ebOptions: _widthOptions,
        ebClue: 'width',
      },
      widthLarge: {
        type: 'integer',
        ebType: 'select',
        ebTitle: 'Width(Large)',
        ebOptions: _widthOptions,
        ebClue: 'width',
      },
    },
  };
  // schema widget
  const schemaPropsWidget = Vue.prototype.$utils.extend({}, schemaPropsGroup, {
    type: 'object',
    properties: {
      height: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Height',
        ebClue: 'height',
      },
    },
  });

  // schema attr group
  const schemaAttrsGroup = {
    type: 'object',
    properties: {
      attrTitle: {
        ebTitle: 'Title',
        ebClue: 'title',
      },
      attrWidthSmall: {
        ebTitle: 'Width(Small)',
        ebClue: 'width',
      },
      attrWidthMedium: {
        ebTitle: 'Width(Medium)',
        ebClue: 'width',
      },
      attrWidthLarge: {
        ebTitle: 'Width(Large)',
        ebClue: 'width',
      },
    },
  };
  // schema widget
  const schemaAttrsWidget = Vue.prototype.$utils.extend({}, schemaAttrsGroup, {
    type: 'object',
    properties: {
      attrHeight: {
        ebTitle: 'Height',
        ebClue: 'height',
      },
    },
  });

  return {
    meta: {
      widget: {
        schema: {
          props: bGroup ? schemaPropsGroup : schemaPropsWidget,
          attrs: bGroup ? schemaAttrsGroup : schemaAttrsWidget,
        },
      },
    },
    props: {
      widget: {
        type: Object,
      },
      title: {
        type: String,
      },
      widthSmall: {
        type: Number,
      },
      widthMedium: {
        type: Number,
      },
      widthLarge: {
        type: Number,
      },
      height: bGroup ? undefined : {
        type: String,
      },
    },
    data() {
      return {
        attrTitle: null,
        attrWidthSmall: null,
        attrWidthMedium: null,
        attrWidthLarge: null,
        attrHeight: bGroup ? undefined : null,
      };
    },
    watch: {
      title() {
        this.attrTitle = this.title;
      },
      widthSmall() {
        this.attrWidthSmall = this.widthSmall;
      },
      widthMedium() {
        this.attrWidthMedium = this.widthMedium;
      },
      widthLarge() {
        this.attrWidthLarge = this.widthLarge;
      },
      height: bGroup ? undefined : function() {
        this.attrHeight = this.height;
      },
    },
    created() {
      this.attrTitle = this.title;
      this.attrWidthSmall = this.widthSmall;
      this.attrWidthMedium = this.widthMedium;
      this.attrWidthLarge = this.widthLarge;
      if (!bGroup) {
        this.attrHeight = this.height;
      }
    },
    mounted() {
      this.$emit('widgetReal:ready', this);
    },
    beforeDestroy() {
      this.$emit('widgetReal:destroy', this);
    },
  };

}
