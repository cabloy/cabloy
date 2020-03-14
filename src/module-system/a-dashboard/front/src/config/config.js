export default function(Vue) {

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
    profile: {
      default: {
        root: {
          widgets: [],
        },
      },
      meta: {
        widget: {
          properties: {
            title: { type: 1, value: '' },
            widthSmall: { type: 1, value: 100 },
            widthMedium: { type: 1, value: 50 },
            widthLarge: { type: 1, value: 25 },
            height: { type: 1, value: 'auto' },
          },
        },
        group: {
          properties: {
            title: { type: 1, value: '' },
            widthSmall: { type: 1, value: 100 },
            widthMedium: { type: 1, value: 100 },
            widthLarge: { type: 1, value: 100 },
            height: { type: 1, value: 'auto' },
          },
        },
      },
    },
    schema: {
      basic: {
        widget: {
          props: schemaPropsWidget,
          attrs: schemaAttrsWidget,
        },
        group: {
          props: schemaPropsGroup,
          attrs: schemaAttrsGroup,
        },
      },
    },
  };

}

