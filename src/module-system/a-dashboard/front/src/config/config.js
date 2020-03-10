export default {
  profile: {
    default: {
      root: {
        widgets: [
          {
            module: 'test-party', name: 'widgetProducts',
          },
          {
            module: 'test-party', name: 'widgetAbout',
          },
        ],
      },
    },
    meta: {
      widget: {
        properties: {
          width: { small: 100, medium: 50, large: 25 },
          height: 'auto',
        },
      },
      group: {
        properties: {
          width: { small: 100, medium: 100, large: 100 },
          height: 'auto',
        },
      },
    },
  },
};
