const _colWidths = [ 5, 10, 15, 20, 25, 30, 33, 35, 40, 45, 50, 55, 60, 65, 66, 70, 75, 80, 85, 90, 95, 100 ];
const _widthOptions = [];
for (const width of _colWidths) {
  _widthOptions.push({ title: `${width}%`, value: width });
}

export default {
  profile: {
    default: {
      root: {
        widgets: [],
      },
    },
    meta: {
      widget: {
        properties: {
          title: { value: '' },
          widthSmall: { value: 100 },
          widthMedium: { value: 50 },
          widthLarge: { value: 25 },
          height: { value: 'auto' },
        },
      },
      group: {
        properties: {
          title: { value: '' },
          widthSmall: { value: 100 },
          widthMedium: { value: 100 },
          widthLarge: { value: 100 },
          height: { value: 'auto' },
        },
      },
    },
  },
  widget: {
    schema: {
      basic: {
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
          height: {
            type: 'string',
            ebType: 'text',
            ebTitle: 'Height',
            notEmpty: true,
          },
        },
      },
    },
  },
};
