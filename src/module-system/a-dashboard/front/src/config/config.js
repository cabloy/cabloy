export default {
  profile: {
    default: {
      widgets: [
        {
          module: 'test-party', name: 'widgetProducts',
        },
        {
          module: 'test-party', name: 'widgetAbout',
        },
      ],
    },
    meta: {
      widget: {
        properties: {
          width: { small: 100, medium: 50, large: 50 },
          height: 'auto',
        },
      },
    },
  },
};
