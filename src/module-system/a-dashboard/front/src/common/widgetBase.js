export default function (Vue, bGroup) {
  // widths
  const _colWidths = [5, 10, 15, 20, 25, 30, 33, 35, 40, 45, 50, 55, 60, 65, 66, 70, 75, 80, 85, 90, 95, 100];
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
        ebWidget: {
          clue: 'title',
          category: 'Basic',
        },
      },
      widthSmall: {
        type: 'integer',
        ebType: 'select',
        ebTitle: 'Width(Small)',
        ebOptions: _widthOptions,
        ebWidget: {
          clue: 'width',
          category: 'Basic',
        },
      },
      widthMedium: {
        type: 'integer',
        ebType: 'select',
        ebTitle: 'Width(Medium)',
        ebOptions: _widthOptions,
        ebWidget: {
          clue: 'width',
          category: 'Basic',
        },
      },
      widthLarge: {
        type: 'integer',
        ebType: 'select',
        ebTitle: 'Width(Large)',
        ebOptions: _widthOptions,
        ebWidget: {
          clue: 'width',
          category: 'Basic',
        },
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
        ebWidget: {
          clue: 'height',
          category: 'Basic',
        },
        ebParams: {
          immediate: false,
        },
      },
    },
  });

  // schema attr group
  const schemaAttrsGroup = {
    type: 'object',
    properties: {
      attrTitle: {
        ebTitle: 'Title',
        ebWidget: {
          clue: 'title',
          category: 'Basic',
        },
      },
      attrWidthSmall: {
        ebTitle: 'Width(Small)',
        ebWidget: {
          clue: 'width',
          category: 'Basic',
        },
      },
      attrWidthMedium: {
        ebTitle: 'Width(Medium)',
        ebWidget: {
          clue: 'width',
          category: 'Basic',
        },
      },
      attrWidthLarge: {
        ebTitle: 'Width(Large)',
        ebWidget: {
          clue: 'width',
          category: 'Basic',
        },
      },
    },
  };
  // schema widget
  const schemaAttrsWidget = Vue.prototype.$utils.extend({}, schemaAttrsGroup, {
    type: 'object',
    properties: {
      attrHeight: {
        ebTitle: 'Height',
        ebWidget: {
          clue: 'height',
          category: 'Basic',
        },
      },
    },
  });

  const _propHeight = bGroup ? undefined : { type: String };
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
      height: _propHeight,
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
      height() {
        if (bGroup) return; // do nothing
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
      this.$emit('widgetRealReady', this);
    },
    beforeDestroy() {
      this.$emit('widgetReal:destroy', this);
      this.$emit('widgetRealDestroy', this);
    },
    methods: {
      getAttrsSchema() {
        return null;
      },
      getPropsSchema() {
        return null;
      },
      getPropSchemaExtra(/* propName*/) {
        return null;
      },
    },
  };
}
