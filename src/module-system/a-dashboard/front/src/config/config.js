export default function(Vue) {

  // widths
  const _colWidths = [ 5, 10, 15, 20, 25, 30, 33, 35, 40, 45, 50, 55, 60, 65, 66, 70, 75, 80, 85, 90, 95, 100 ];
  const _widthOptions = [];
  for (const width of _colWidths) {
    _widthOptions.push({ title: `${width}%`, value: width });
  }

  // schema group
  const schemaGroup = {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Title',
      },
      widthSmall: {
        type: 'integer',
        ebType: 'select',
        ebTitle: 'Width(Small)',
        ebOptions: _widthOptions,
        notEmpty: true,
      },
      widthMedium: {
        type: 'integer',
        ebType: 'select',
        ebTitle: 'Width(Medium)',
        ebOptions: _widthOptions,
        notEmpty: true,
      },
      widthLarge: {
        type: 'integer',
        ebType: 'select',
        ebTitle: 'Width(Large)',
        ebOptions: _widthOptions,
        notEmpty: true,
      },
    },
  };
  // schema widget
  const schemaWidget = Vue.prototype.$utils.extend({}, schemaGroup, {
    type: 'object',
    properties: {
      height: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Height',
        notEmpty: true,
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
        widget: schemaWidget,
        group: schemaGroup,
      },
    },
  };

}

